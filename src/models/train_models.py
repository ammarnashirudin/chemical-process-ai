import json
from pathlib import Path

import joblib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

from sklearn.ensemble import(
    GradientBoostingRegressor,
    RandomForestRegressor,
)

from sklearn.linear_model import LinearRegression
from sklearn.metrics import(
    mean_absolute_error,
    mean_squared_error,
    r2_score,
)
from sklearn.model_selection import train_test_split, ParameterGrid
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

ROOT = Path(__file__).resolve().parents[2]

DATA_PATH = ROOT / "data" / "processed" / "methane_pr_eos.csv"
MODEL_DIR = ROOT / "models"
REPORT_DIR = ROOT / "reports"
PLOT_DIR = REPORT_DIR / "figures"

FEATURES = ["temperature_K", "pressure_Pa"]
TARGET = "Z_vapor_root"
RANDOM_STATE = 42

def load_dataset()->pd.DataFrame:
    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"Dataset not found: {DATA_PATH}."
            "Runn python -m src.data.generate_dataset first"
        )
    df = pd.read_csv(DATA_PATH)

    required = FEATURES + [TARGET]
    missing = set(required) - set(df.columns)

    if missing:
        raise ValueError(f"missing columns: {sorted(missing)}")
    if df[required].isna().any().any():
        raise ValueError("Features or target contain missing value")
    if not np.isfinite(df[required].to_numpy(dtype=float)).all():
        raise ValueError("Features or target contain non finite values")
    return df

def build_models()->dict:
    return{
        "linear_regression" : Pipeline(
            [
                ("scaler", StandardScaler()),
                ("model", LinearRegression()),
            ]
        ),
        "random_forest" : RandomForestRegressor(
            n_estimators=300,
            min_samples_leaf=2,
            random_state=RANDOM_STATE,
            n_jobs=1,
        ),

        "gradient_boosting" : GradientBoostingRegressor(
            n_estimators=200,
            learning_rate=0.05,
            max_depth=2,
            loss="squared_error",
            random_state=RANDOM_STATE,
        ),
    }

def evaluate_model(y_true, y_pred)-> dict[str,float]:
    return{
        "mae" : float(mean_absolute_error(y_true, y_pred)),
        "rmse" : float(np.sqrt(mean_squared_error(y_true, y_pred))),
        "r2" : float(r2_score(y_true, y_pred)),
    }

def optimize_random_forest(
        x_train,
        y_train,
        x_val,
        y_val,
):
    param_grid = {
        "n_estimators" : [200, 300, 500],
        "max_depth" : [5, 10, None],
        "min_samples_split" : [2, 5],
        "min_samples_leaf" : [1, 2, 4],
    }

    results = []

    for params in ParameterGrid(param_grid):
        model = RandomForestRegressor(
            **params,
            random_state=RANDOM_STATE,
            n_jobs = -1,
        )

        model.fit(x_train, y_train)

        y_val_pred = model.predict(x_val)
        metrics = evaluate_model(y_val, y_val_pred)

        results.append({
            "params": params,
            "mae" : metrics["mae"],
            "rmse" : metrics["rmse"],
            "r2" : metrics["r2"],
        })

    best_result = min(
        results,
        key=lambda result: result["rmse"]
    )

    return best_result, results

def main() -> None:
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    PLOT_DIR.mkdir(parents=True, exist_ok=True)

    df = load_dataset()

    x = df[FEATURES]
    y = df[TARGET]

    x_train, x_temp, y_train, y_temp = train_test_split(
        x,
        y,
        test_size=0.40,
        random_state=RANDOM_STATE,
    )

    x_val, x_test, y_val, y_test = train_test_split(
        x_temp,
        y_temp,
        test_size=0.50,
        random_state=RANDOM_STATE,
    )

    print(f"Dataset rows: {len(df)}")
    print(f"Training rows: {len(x_train)}")
    print(f"Validation rows: {len(x_val)}")
    print(f"Test rows: {len(x_test)}")

    # Train each model and select the best using validation RMSE
    results = {}
    trained_models = {}
    validation_predictions = {}

    for name, model in build_models().items():
        model.fit(x_train, y_train)

        y_val_pred = model.predict(x_val)

        results[name] = evaluate_model(y_val, y_val_pred)
        trained_models[name] = model
        validation_predictions[name] = y_val_pred

        print(f"\nValidation - {name}")
        print(json.dumps(results[name], indent=2))

        # Optimize Random Forest hyperparameters
        best_rf_result, rf_search_results = optimize_random_forest(
            x_train,
            y_train,
            x_val,
            y_val,
        )

        print("\nBest Random Forest Hyperparameters:")
        print(json.dumps(best_rf_result, indent=2))

        # Rebuild the optimized Random Forest model
        optimized_rf = RandomForestRegressor(
            **best_rf_result["params"],
            random_state=RANDOM_STATE,
            n_jobs=-1,
        )

        optimized_rf.fit(x_train, y_train)

        # Add optimized Random Forest to model comparison
        results["random_forest_tuned"] = {
            "mae": best_rf_result["mae"],
            "rmse": best_rf_result["rmse"],
            "r2": best_rf_result["r2"],
        }

        trained_models["random_forest_tuned"] = optimized_rf

        best_name = min(
            results,
            key=lambda name: results[name]["rmse"],
        )

        best_model = trained_models[best_name]

    # Evaluate the selected model on the untouched test set
    y_test_pred = best_model.predict(x_test)
    test_metrics = evaluate_model(y_test, y_test_pred)

    model_path = MODEL_DIR / f"{best_name}.joblib"
    joblib.dump(best_model, model_path)

    metrics = {
        "target": TARGET,
        "features": FEATURES,
        "dataset_rows": int(len(df)),
        "train_rows": int(len(x_train)),
        "validation_rows": int(len(x_val)),
        "test_rows": int(len(x_test)),
        "random_state": RANDOM_STATE,
        "split_method": "random 60/20/20 train_validation_test split",
        "selection_metric": "validation_rmse",
        "best_model": best_name,
        "validation_results": results,
        "final_test_results": test_metrics,
        "interpretation": (
            "Metrics measure approximation of PR-EOS-generated labels, "
            "not accuracy against experimental measurements. "
            "Models were selected using validation RMSE. "
            "The test set was held out for final evaluation."
        ),
    }

    metrics_path = REPORT_DIR / "model_metrics.json"
    metrics_path.write_text(
        json.dumps(metrics, indent=2),
        encoding="utf-8",
    )

    # Parity plot for the final test predictions
    fig, ax = plt.subplots(figsize=(7, 7))
    ax.scatter(y_test, y_test_pred, alpha=0.75)

    lower = min(float(y_test.min()), float(y_test_pred.min()))
    upper = max(float(y_test.max()), float(y_test_pred.max()))

    ax.plot([lower, upper], [lower, upper], linestyle="--")
    ax.set_xlabel("PR-EOS Z (reference)")
    ax.set_ylabel("ML-predicted Z")
    ax.set_title(f"Final Test Parity Plot - {best_name}")
    ax.grid(True, alpha=0.3)

    fig.tight_layout()
    fig.savefig(PLOT_DIR / "parity_plot.png", dpi=160)
    plt.close(fig)

    print(f"\nSelected model: {best_name}")
    print(f"Validation metrics: {json.dumps(results[best_name], indent=2)}")
    print(f"Final test metrics: {json.dumps(test_metrics, indent=2)}")
    print(f"Metrics saved to: {metrics_path}")
    print(f"Parity plot saved to: {PLOT_DIR / 'parity_plot.png'}")
    print(f"Model saved to: {model_path}")


if __name__ == "__main__":
    main()
