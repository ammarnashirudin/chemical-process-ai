import json
from pathlib import Path

import numpy as np
import pandas as pd

from src.thermodynamics.pr_eos import(
    METHANE,
    calculate_z,
    compressibility_roots,
    reduced_parameters,
)

ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT / "data"/"processed"
REPORT_DIR = ROOT / "reports"

def generate_dataset()-> pd.DataFrame:
    temperatures = np.linspace(220.0, 400.0, 25)
    pressures = np.linspace(100_000.0, 8_000_000.0, 30)

    rows = []

    for temperature in temperatures:
        for pressure in pressures:
            params = reduced_parameters(
                temperature= temperature,
                pressure= pressure,
                fluid= METHANE,
            )

            roots = compressibility_roots(
                temperature= temperature,
                pressure=pressure,
                fluid=METHANE,
            )

            z_vapor = calculate_z(
                temperature=temperature,
                pressure=pressure,
                fluid=METHANE,
                phase="vapor",
            )

            rows.append(
                {
                    "fluid" : METHANE.name,
                    "temperature_K" : temperature,
                    "pressure_Pa" : pressure,
                    "critical_temperatur_K" : (
                        METHANE.critical_temperature
                    ),
                    "critical_preassure_Pa" : (
                        METHANE.critical_pressure
                    ),
                    "acentric_factor" : METHANE.acentric_factor,
                    "alpha" : params["alpha"],
                    "A" : params["A"],
                    "B" : params["B"],
                    "number_of_admissible_roots" : len(roots),
                    "Z_vapor_root" : z_vapor,
                    "source" : "Peng-robinson EOS calculation",
                }
            )
    return pd.DataFrame(rows)

def validate_dataset(df: pd.DataFrame)->None:
    required = [
        "temperature_K",
        "pressure_Pa",
        "alpha",
        "A",
        "B",
        "Z_vapor_root",
        "number_of_admissible_roots",
    ]

    missing = set(required) - set(df.columns)
    if missing:
        raise ValueError(f"missing columns : {sorted(missing)}")
    if df.empty:
        raise ValueError("Dataset is empty")
    if df[required].isna().any().any():
        raise ValueError("dataset contains missing values")
    
    numeric = df[required].to_numpy(dtype = float)
    if not np.isfinite(numeric).all():
        raise ValueError("Dataset contain non-finite values.")
    if (df["temperature_K"] <= 0).any():
        raise ValueError("Temperature must be positive")
    if(df["pressure_Pa"] <= 0).any():
        raise ValueError("Preassure must be positive")
    if(df["Z_vapor_root"] < df["B"]).any():
        raise ValueError("Found a root with invalid molar volume")
    if(df["number_of_admissible_roots"]<1).any():
        raise ValueError("EVery state must have at least one root")

def main()->None:
    DATA_DIR.mkdir(parents=True, exist_ok = True)
    REPORT_DIR.mkdir(parents=True, exist_ok = True)

    df = generate_dataset()
    validate_dataset(df)

    output_path = DATA_DIR/"methane_pr_eos.csv"
    df.to_csv(output_path, index = False)

    metadata = {
        "dataset" : output_path.name,
        "fluid" : METHANE.name,
        "rows" : len(df),
        "temperature_unit" : "K",
        "pressure_unit" : "Pa",
        "target" : "Z_vapor_root",
        "target_definition" : (
            "Largest admissible real root of the peng-robinson"
            "cubic EOS; not an experimental measurement."
        ),
        "data_source" : "calculated using project PR-EOS implementation",
        "temperature_range_K" : [
            float(df["temperature_K"].min()),
            float(df["temperature_K"].max()),
        ],
        "pressure_range_Pa" : [
            float(df["pressure_Pa"].min()),
            float(df["pressure_Pa"].max()),
        ],
    }

    metadata_path = REPORT_DIR / "dataset_metadata.json"
    metadata_path.write_text(
        json.dumps(metadata, indent=2),
        encoding="utf-8",
    )

    print(f"Dataset saved: {output_path}")
    print(f"metadata saved: {metadata_path}")
    print(f"Rows: {len(df)}")
    print(df.head().to_string(index=False))

if __name__ == "__main__":
    main()
    

