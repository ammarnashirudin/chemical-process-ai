import pytest

from src.thermodynamics.pr_eos import(
    METHANE,
    calculate_z,
    compressibility_roots,
    pr_parameters,
    reduced_parameters,
)

def test_pr_parameters_are_positive():
    params = pr_parameters(METHANE)

    assert params["a"] > 0
    assert params["b"] > 0
    assert params["kappa"] > 0

def test_reduced_parameters_are_positive():
    params = reduced_parameters(
        temperature=300.0,
        pressure=1_000_000.0,
        fluid=METHANE,
    )

    assert params["alpha"]>0
    assert params["A"]>0
    assert params["B"]>0

def test_methane_has_valid_compressibility_root():
    roots=compressibility_roots(
        temperature=300.0,
        pressure=1_000_000.0,
        fluid=METHANE,
    )

    assert len(roots) >= 1
    assert roots == sorted(roots)
    assert all(root > 0 for root in roots)

def test_vapor_z_uses_largest_root():
    roots = compressibility_roots(300.0, 1_000_000.0, METHANE)

    z = calculate_z(
        300.0,
        1_000_000.0,
        METHANE,
        phase="vapor",
    )

    assert z == pytest.approx(roots[-1])

def test_liquid_z_uses_smallest_root():
    roots = compressibility_roots(300.0, 1_000_000.0, METHANE)

    z = calculate_z(
        300.0,
        1_000_000.0,
        METHANE,
        phase="liquid",
    )

    assert z == pytest.approx(roots[0])

def test_invalid_temperature_is_rejected():
    with pytest.raises(ValueError):
        calculate_z(0.0, 1_000_000.0, METHANE)

def test_invalid_phase_is_rejected():
    with pytest.raises(ValueError):
        calculate_z(
            300.0,
            1_000_000.0,
            METHANE,
            phase="unknown",
        )
