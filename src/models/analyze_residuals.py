import json
from pathlib import Path

import joblib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split

ROOT = Path(__file__).resolve().parents[2]
DATA_PATH = ROOT / "data" / "processed" / "methane_pr_eos.csv"
MODEL_PATH = ROOT / "models" / "random_forest_tuned.joblib"
REPORT_DIR = ROOT / "reports"
PLOT_DIR = REPORT_DIR / "figures"

FEATURES = ["temperature_K", "pressure_Pa"]
TARGET = "Z_vapor_root"
RANDOM_STATE = 42

def main()-> None:
    df = pd.read_csv(DATA_PATH)

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
        random_state=RANDOM_STATE
    )

    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Model not found: {MODEL_PATH}."
            "run python -m src.models.train.models first"
        )
    model = joblib.load(MODEL_PATH)
    predictions = model.predict(x_test)

    residuals = y_test.to_numpy() - predictions

    results = {
        "test_rows" : int(len(y_test)),
        "mean_residual" : float(np.mean(residuals)),
        "mean_absolute_residual" : float(np.mean(np.abs(residuals))),
        "residual_std" : float(np.std(residuals)),
        "fraction_overpredicted" : float(np.mean(residuals < 0)),
        "fraction_underpredicted" : float(np.mean(residuals > 0)),
        "note" : (
            "Residual = actual PR-EOS Z minus predicted Z."
            "these residuals measure ML approximation of PR-EOS labels,"
            "not experimental error"
        ),
    }

    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    PLOT_DIR.mkdir(parents=True, exist_ok=True)

    residual_df = x_test.copy()

    residual_df["z_actual"] = y_test.to_numpy()
    residual_df["z_predicted"] = predictions
    residual_df["residual"]=residuals

    residual_df["absolute_error"] = np.abs(residual_df["residual"])
    worst_cases = residual_df.nlargest(10, "absolute_error")
    print("\nTop 10 largest absolute residuals: ")
    print(
        worst_cases[
            [
                "temperature_K",
                "pressure_Pa",
                "z_actual",
                "z_predicted",
                "residual",
                "absolute_error",
            ]
        ].to_string(index=False)
    )
    residual_path = REPORT_DIR/"test_residuals.csv"
    residual_df.to_csv(residual_path, index=False)

    metrics_path = REPORT_DIR / "residual_metrics.json"
    metrics_path.write_text(
        json.dumps(results, indent=2),
        encoding = "utf-8",
    )

    fig, ax = plt.subplots(figsize = (8, 5))
    ax.scatter(predictions, residuals, alpha=0.75)
    ax.axhline(0,linestyle="--")
    ax.set_xlabel("Predicted Z")
    ax.set_ylabel("Residual(actual Z - predicted Z)")
    ax.set_title("Random forest residual plot - test set")
    ax.grid(True, alpha=0.3)
    fig.tight_layout()

    plot_path = PLOT_DIR/"residual_plot.png"
    print("Plot directory:", PLOT_DIR)
    print("directory exists:", PLOT_DIR.exists())
    print("Is directory:", PLOT_DIR.is_dir())
    print("output path:", plot_path)

    fig.tight_layout()
    fig.savefig(plot_path, dpi=160)
    plt.close(fig)

    print(json.dumps(results, indent=2))
    print(f"residual data saved to :{residual_path}")
    print(f"residual metrics saved to: {metrics_path}")
    print(f"residual plot saved : {PLOT_DIR/'residual_plot.png'}")

if __name__ == "__main__" :
    main()
