from dataclasses import dataclass

import numpy as np

R = 8.314462618 #J/mol k

@dataclass(frozen=True)
class PureFluid:
    name: str
    critical_temperature: float
    critical_pressure: float
    acentric_factor: float

# Methane: Properties for the initial model

METHANE = PureFluid(
    name= "Methane",
    critical_temperature= 190.564,
    critical_pressure=4.5992e6,
    acentric_factor=0.01142,
)

def validate_state(temperature: float, pressure: float)-> None:
    if not np.isfinite(temperature) or temperature <= 0:
        raise ValueError("Temperature must be finite and positive (k).")
    if not np.isfinite(pressure) or pressure <= 0:
        raise ValueError("Preassure must be finite and positive (Pa)")

def pr_parameters(fluid:PureFluid)-> dict[str, float]:
    tc = fluid.critical_temperature
    pc = fluid.critical_pressure
    omega = fluid.acentric_factor

    if not np.isfinite(tc) or tc <= 0:
        raise ValueError("Critical temperatur must be positive")
    if not np.isfinite(pc) or pc <= 0:
        raise ValueError("Critical pressure must be possitive")
    if not np.isfinite(omega):
        raise ValueError("Acentric factor must be finite")

    a = 0.45724 * R**2 * tc**2 /pc
    b = 0.07780 * R * tc / pc
    kappa = 0.37464 + 1.54336 * omega - 0.26992 * omega**2

    return{
        "a": a,
        "b" : b,
        "kappa": kappa,
    }

def reduced_parameters(
        temperature: float,
        pressure: float,
        fluid: PureFluid,
) -> dict[str,float]:
    validate_state(temperature, pressure)
    params = pr_parameters(fluid)
    tr = temperature/fluid.critical_temperature

    alpha = (
        1.0 + params["kappa"] * (1.0 - np.sqrt(tr))
    )**2

    a_alpha = params["a"]*alpha
    a_dimensionless = (
        a_alpha*pressure/(R**2 * temperature**2)
    )
    b_dimensionless = (
        params["b"] * pressure/(R*temperature)
    )

    return{
        "alpha" : alpha,
        "A" : a_dimensionless,
        "B" : b_dimensionless,
    }

def compressibility_roots(
        temperature: float,
        pressure: float,
        fluid: PureFluid,
)-> list[float]:

    params = reduced_parameters(temperature, pressure, fluid)
    A = params["A"]
    B = params["B"]

    coefficients = [
        1.0,
        -(1.0-B),
        A-3.0*B**2-2.0*B,
        -(A*B-B**2-B**3),
    ]

    roots = np.roots(coefficients)

    real_roots = sorted(
        float(root.real)
        for root in roots
        if abs(root.imag) < 1e-8 and root.real > B
    )

    if not real_roots:
        raise ValueError(
            "No physically admissible positive-volume root found"
        )
    return real_roots

def calculate_z(
        temperature: float,
        pressure: float,
        fluid: PureFluid = METHANE,
        phase: str = "vapor",
)-> float :
        """Return the selected compressibility root.

    Vapor selects the largest root; liquid selects the smallest.
    When only one admissible root exists, both return that root.

    Root selection alone does not establish thermodynamic phase
    stability, particularly when multiple roots exist.
    """
        if phase not in {"vapor", "liquid"}:
            raise ValueError("phase must be vapor or liquid")

        roots = compressibility_roots(temperature, pressure, fluid)

        if phase == "vapor":
            return roots[-1]

        return roots[0]
