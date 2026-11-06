from pathlib import Path

import joblib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

from src.thermodynamics.pr_eos import METHANE, calculate_z

ROOT = Path(__file__).resolve().parents[2]
MODEL_PATH = ROOT/"models"/"random_forest.joblib"
FIGURE_DIR = ROOT/"reports"/"figures"

TEMPERATURE_K = 300.0
PRESSURE_PA = np.linspace(100_000.0, 8_000_000.0, 100)

def main():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"model file not found: {MODEL_PATH}"
        )

    model = joblib.load(MODEL_PATH)

    features = pd.DataFrame(
        {
            "temperature_K" : np.full(
                len(PRESSURE_PA), TEMPERATURE_K
            ),
            "pressure_Pa" : PRESSURE_PA,
        }
    )

    predicted_z = model.predict(features)

    pr_eos_z = np.array(
        [
            calculate_z(
                temperature=TEMPERATURE_K,
                pressure=float(pressure),
                fluid = METHANE,
                phase="vapor"
            )
            for pressure in PRESSURE_PA
        ]
    )

    absolute_error = np.abs(pr_eos_z - predicted_z)

    FIGURE_DIR.mkdir(parents=True, exist_ok=True)

    # Grafik perbandingan Z
    plt.figure(figsize=(9,5.5))
    plt.plot(
        PRESSURE_PA / 1e6,
        pr_eos_z,
        label = "PR-EOS reference",
        linewidth = 2,
    )
    plt.plot(
        PRESSURE_PA / 1e6,
        predicted_z,
        label = "Random Forest",
        linestyle= "--",
        linewidth = 2,
    )

    plt.xlabel("Pressure(MPa)")
    plt.ylabel("Compressibility factor, Z")
    plt.title(
        "PR-EOS vs Random Forest"
        f"at T = {TEMPERATURE_K:.0f} K"
    )

    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.tight_layout()

    comparison_path =  FIGURE_DIR/"eos_ml_comparison.png"
    plt.savefig(comparison_path, dpi=300)
    plt.close()

    # Grafik galat absolute
    plt.figure(figsize=(9, 5.5))
    plt.plot(
        PRESSURE_PA/1e6,
        absolute_error,
        linewidth=2,
    )

    plt.xlabel("Pressure (MPa)")
    plt.ylabel("Absolute error in Z")
    plt.title(
        "Absolute Error : PR-EOS vs Random Forest"
        f"at T = {TEMPERATURE_K:.0f} K"
    )

    plt.grid(True, alpha=0.3)
    plt.tight_layout()

    error_path = FIGURE_DIR/"eos_ml_absolute_error.png"
    plt.savefig(error_path, dpi=300)
    plt.close()

    print(f"Comparison plot saved : {comparison_path}")
    print(f"Absolute error plot save : {error_path}")
    print(f"Mean absolute error on this pressure sweep: "
          f"{absolute_error.mean():.8f}")
    print(f"Maximum absolute error on this pressure sweep: "
          f"{absolute_error.max():.8f}")

if __name__ == "__main__":
    main()
