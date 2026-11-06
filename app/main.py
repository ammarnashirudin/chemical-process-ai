import json
from pathlib import Path

import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from src.thermodynamics.pr_eos import calculate_z, METHANE
from scipy.stats import norm

ROOT = Path(__file__).resolve().parents[1]
MODEL_PATH = ROOT / "models" / "random_forest_tuned.joblib"

MODEL_METRICS_PATH = ROOT / "reports" / "model_metrics.json"
RESIDUAL_METRICS_PATH = ROOT / "reports" / "residual_metrics.json"
RESIDUAL_DATA_PATH = ROOT / "reports" / "test_residuals.csv"

if not MODEL_PATH.exists():
    raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")

model = joblib.load(MODEL_PATH)

app = FastAPI(
    title="Chemical Process AI API",
    description=(
        "Predict methane compressibility factor Z using a "
        "Random Forest model trained on PR-EOS-generated data."
    ),
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content_Type"]
)


class PredictionInput(BaseModel):
    temperature_K: float = Field(
        gt=0,
        description="Temperature in kelvin",
        examples=[300.0],
    )
    pressure_Pa: float = Field(
        gt=0,
        description="Pressure in pascals",
        examples=[1_000_000.0],
    )


class PredictionOutput(BaseModel):
    temperature_K: float
    pressure_Pa: float
    predicted_Z: float
    model: str
    within_training_range: bool
    warning: str | None = None

class ComparisonOutput(BaseModel):
    temperature_K : float
    pressure_Pa : float
    pr_eos_Z : float
    predicted_Z : float
    absolute_error : float
    model : str

class PressureCurveInput(BaseModel):
    temperature_K : float = Field(gt=0)
    pressure_min_Pa : float = Field(default=100_000, gt=0)
    pressure_max_Pa : float = Field(default=8_000_000, gt=0)
    points : int = Field(default=50, ge=2, le=200)

@app.get("/")
def root():
    return {
        "message": "Chemical Process AI API is running",
        "docs": "/docs",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
    }

@app.get("/evaluation")
def evaluation():
    if not MODEL_METRICS_PATH.exists():
        from fastapi import HTTPException
        raise HTTPException(
            status_code = 500,
            detail="Model metrics file not found",
        )

    if not RESIDUAL_METRICS_PATH.exists():
        from fastapi import HTTPException
        raise HTTPException(
            status_code=500,
            detail="Residual metrics file not found"
        )

    with open(MODEL_METRICS_PATH, "r", encoding="utf-8") as file:
        model_metrics = json.load(file)

    with open(RESIDUAL_METRICS_PATH, "r", encoding="utf-8") as file:
        residual_metrics = json.load(file)

    return{
        "best_model" : model_metrics["best_model"],
        "dataset_rows" : model_metrics["dataset_rows"],
        "train_rows" : model_metrics["train_rows"],
        "validation_rows" : model_metrics["validation_rows"],
        "test_rows" : model_metrics["test_rows"],
        "validation_results" : model_metrics["validation_results"],
        "final_test_results" : model_metrics["final_test_results"],
        "residual_metrics" : residual_metrics,
        "interpretation" : model_metrics["interpretation"],
    }

@app.post("/residuals")
def get_residuals():
    from fastapi import HTTPException

    if not RESIDUAL_DATA_PATH.exists():
        raise HTTPException(
            status_code=404,
            detail=(
                "Residual data not found"
                "Run python -m src.model.analyze_residuals first."
            ),
        )
    residual_df = pd.read_csv(RESIDUAL_DATA_PATH)

    required_columns = [
        "temperature_K",
        "pressure_Pa",
        "z_actual",
        "z_predicted",
        "residual",
        "absolute_error",
    ]

    missing_columns = [
        column
        for column in required_columns
        if column not in residual_df.columns
    ]

    if missing_columns:
        raise HTTPException(
            status_code=500,
            details=f"Missing residual columns: {missing_columns}",
        )

    residual_values = residual_df["residual"].dropna().to_numpy()

    if len(residual_values) < 2:
        raise HTTPException(
            status_code=422,
            detail="At least two residual values are required for Q-Q analysis"
        )

    sorted_residuals = sorted(residual_values)

    mean_residual = float(residual_values.mean())
    std_residual = float(residual_values.std(ddof=1))

    if std_residual > 0:
        standarized_residuals = (
            residual_values - mean_residual
        ) / std_residual
    else:
        standarized_residuals = residual_values - mean_residual

    sorted_standarized = sorted(standarized_residuals)

    n = len(sorted_standarized)

    theoretical_quantiles = norm.ppf(
        [(i + 0.5) / n for i in range(n)]
    )

    qq_lot = [
        {
            "theoretical_quantile" : float(theoretical),
            "sample_quantile" : float(sample),
        }

        for theoretical, sample in zip(
            theoretical_quantiles,
            sorted_standarized,
        )
    ]

    return{
        "count": len(residual_df),
        "residuals": residual_df[required_columns].to_dict(
            orient="records"
        ),
        "qq_plot" : qq_lot,
        "definition" : (
            "Residual = actual PR-EOS Z minus predicted ML Z."
        )
    }

@app.post("/predict", response_model=PredictionOutput)
def predict(data: PredictionInput):
    temperature = data.temperature_K
    pressure = data.pressure_Pa

    features = pd.DataFrame(
        [[temperature, pressure]],
        columns=["temperature_K", "pressure_Pa"],
    )
    predicted_z = float(model.predict(features)[0])

    within_range = (
        220.0 <= temperature <= 400.0
        and 100_000.0 <= pressure <= 8_000_000.0
    )

    warning = None
    if not within_range:
        warning = (
            "Input is outside the training data range. "
            "Prediction is extrapolative and may be unreliable."
        )

    return PredictionOutput(
        temperature_K=temperature,
        pressure_Pa=pressure,
        predicted_Z=predicted_z,
        model="Random Forest Tuned",
        within_training_range=within_range,
        warning=warning,
    )

@app.post("/compare", response_model=ComparisonOutput)
def compare(data: PredictionInput):
    temperature = data.temperature_K
    pressure = data.pressure_Pa

    features = pd.DataFrame(
        [[temperature, pressure]],
        columns=["temperature_K", "pressure_Pa"],
    )

    predicted_z = float(model.predict(features)[0])

    pr_eos_z = calculate_z(
        temperature = temperature,
        pressure = pressure,
        fluid = METHANE,
        phase = "vapor",
    )

    absolute_error = abs(pr_eos_z-predicted_z)

    return ComparisonOutput(
        temperature_K= temperature,
        pressure_Pa = pressure,
        pr_eos_Z= pr_eos_z,
        predicted_Z= predicted_z,
        absolute_error=absolute_error,
        model = "Random Forest Tuned",
    )

@app.post("/pressure-curve")
def pressure_curve(data: PressureCurveInput):
    if data.pressure_min_Pa >= data.pressure_max_Pa:
        from fastapi import HTTPException
        raise HTTPException(
            status_code = 422,
            detail="pressure_min_Pa must be less than pressure_max_Pa",
        )

    pressures = [
        data.pressure_min_Pa
        + i * (data.pressure_max_Pa-data.pressure_min_Pa)
        / (data.points-1)
        for i in range(data.points)
    ]

    rows = []

    for pressure in pressures:
        prediction = model.predict(
            pd.DataFrame(
                [{
                    "temperature_K" : data.temperature_K,
                    "pressure_Pa" : pressure,
                }]
            )
        )[0]

        pr_eos = calculate_z(
            temperature=data.temperature_K,
            pressure=pressure,
            fluid=METHANE,
            phase="vapor"
        )

        rows.append({
            "pressure_Pa" : pressure,
            "pressure_MPa" : pressure/1_000_000,
            "ml_Z" : float(prediction),
            "pr_eos_Z" : float(pr_eos),
            "absolute_error" : abs(float(prediction)-float(pr_eos)),
        })

    return{
        "temperature_K" : data.temperature_K,
        "points" :rows,
        "model" : "Random Forest Tuned",
        "reference" : "Peng-Robinson EOS"
    }
