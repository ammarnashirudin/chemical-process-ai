
import pytest

from src.thermodynamics.pr_eos import METHANE, calculate_z


def test_low_pressure_z_approaches_ideal_gas_limit():
    z = calculate_z(
        temperature=300.0,
        pressure=1_000.0,
        fluid=METHANE,
        phase="vapor",
    )

    assert z == pytest.approx(1.0, abs=0.002)


def test_moderate_state_returns_finite_z():
    z = calculate_z(
        temperature=300.0,
        pressure=1_000_000.0,
        fluid=METHANE,
        phase="vapor",
    )

    assert 0 < z < 2
