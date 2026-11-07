import type {
  ResidualPoint,
  ResidualResponse,
} from "../../types/dashboard";

type ResidualFilterOptions = {
  residualData: ResidualResponse | null;
  minTemperature: string;
  maxTemperature: string;
  minPressure: string;
  maxPressure: string;
};

export function filterResiduals({
  residualData,
  minTemperature,
  maxTemperature,
  minPressure,
  maxPressure,
}: ResidualFilterOptions): ResidualPoint[] {
  return residualData
    ? residualData.residuals.filter((point) => {
        const minT = Number(minTemperature);
        const maxT = Number(maxTemperature);
        const minP = Number(minPressure) * 1_000_000;
        const maxP = Number(maxPressure) * 1_000_000;

        return (
          Number.isFinite(minT) &&
          Number.isFinite(maxT) &&
          Number.isFinite(minP) &&
          Number.isFinite(maxP) &&
          minT <= maxT &&
          minP <= maxP &&
          point.temperature_K >= minT &&
          point.temperature_K <= maxT &&
          point.pressure_Pa >= minP &&
          point.pressure_Pa <= maxP
        );
      })
    : [];
}

export function getTopResiduals(
  filteredResiduals: ResidualPoint[]
): ResidualPoint[] {
  return [...filteredResiduals]
    .sort((a, b) => b.absolute_error - a.absolute_error)
    .slice(0, 10);
}
