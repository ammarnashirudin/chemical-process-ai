import json
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

ROOT = Path(__file__).resolve().parents[2]
DATA_PATH = ROOT/"data"/"processed"/"methane_pr_eos.csv"
REPORT_DIR = ROOT / "reports"

FEATURES = ["temperature_K", "pressure_Pa"]
TARGET = "Z_vapor_root"

HELD_OUT_TEMPERATURES = [250.0, 310.0, 370.0]

def main()-> None:
    df = pd.read_csv(DATA_PATH)

    results = []

    for temperature in HELD_OUT_TEMPERATURES:
        train_df = df[df["temperature_K"] != temperature]
        test_df = df[df["temperature_K"] == temperature]

        model = RandomForestRegressor(
            n_estimators= 300,
            min_samples_leaf= 2,
            random_state= 42,
            n_jobs=-1,
        )

        model.fit(train_df[FEATURES], train_df[TARGET])
        predictions = model.predict(test_df[FEATURES])
        actual = test_df[TARGET].to_numpy()

        result = {
            "held_out_temperature_K": temperature,
            "train_rows" : int(len(train_df)),
            "test_rows" : int(len(test_df)),
            "mae" : float(mean_absolute_error(actual, predictions)),
            "rmse" : float(np.sqrt(mean_squared_error(actual, predictions))),
            "r2" : float(r2_score(actual,predictions)),
            "test_temperature_seen_during_training" : False,
        }

        results.append(result)

        print(f"\nHeld-out temperature: {temperature} K")
        print(json.dumps(result, indent=2))

    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    output_path = REPORT_DIR / "generalization_metric.json"
    output_path.write_text(
        json.dumps(results, indent=2),
        encoding = "utf-8",
    )

    print(f"\nResults saved to: {output_path}")

if __name__ == "__main__":
    main()
