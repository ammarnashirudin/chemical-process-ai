from CoolProp import AbstractState, PT_INPUTS

from src.thermodynamics.pr_eos import METHANE, calculate_z

def main():
    reference = AbstractState("PR", "Methane")

    test_states = [
        (300.0, 100_000.0),
        (300.0, 1_000_000.0),
        (300.0, 3_000_000.0),
    ]

    print("T (K) | P (Pa) | Project Z | CoolProp Z | Abs. error")

    for temperature, pressure in test_states:
        z_project = calculate_z(
            temperature,
            pressure,
            METHANE,
            phase="vapor",
        )

        reference.update(
            PT_INPUTS,
            pressure,
            temperature,
        )

        z_reference = reference.compressibility_factor()

        error = abs(z_project-z_reference)

        print(
            f"{temperature:.2f} | {pressure:.0f} |"
            f"{z_project:.8f} | {z_reference:.8f} |"
            f"{error:.3e}"
        )

if __name__ == "__main__":
    main()