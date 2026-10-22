from src.data.generate_dataset import(
    generate_dataset,
    validate_dataset,
)

def test_dataset_has_expected_number_of_rows():
    df = generate_dataset()
    assert len(df) == 750

def test_dataset_passes_validation():
    df = generate_dataset()
    validate_dataset(df)

def test_dataset_has_unique_temperature_pressure_pairs():
    df = generate_dataset()

    assert not df.duplicated(
        subset=["temperature_K", "pressure_Pa"]
    ).any()

def test_dataset_has_finite_target_values():
    df = generate_dataset()

    assert df["Z_vapor_root"].notna().all()
    assert df["Z_vapor_root"].map(
        lambda value: abs(value) < float("inf")
    ).all