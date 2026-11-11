import type { ResidualPoint } from "../../types/dashboard";

export function calculateResidualStats(
  filteredResiduals: ResidualPoint[]
) {
  const count = filteredResiduals.length;

  const meanResidual =
    count > 0
      ? filteredResiduals.reduce(
          (sum, point) => sum + point.residual,
          0
        ) / count
      : 0;

  const mae =
    count > 0
      ? filteredResiduals.reduce(
          (sum, point) => sum + point.absolute_error,
          0
        ) / count
      : 0;

  const overPrediction = filteredResiduals.filter(
    (point) => point.residual < 0
  ).length;

  const underPrediction = filteredResiduals.filter(
    (point) => point.residual > 0
  ).length;

  const standardDeviation =
    count > 1
      ? Math.sqrt(
          filteredResiduals.reduce(
            (sum, point) =>
              sum + Math.pow(point.residual - meanResidual, 2),
            0
          ) / count
        )
      : 0;

  return {
    count,
    meanResidual,
    mae,
    overPrediction,
    underPrediction,
    standardDeviation,
    overPredictionPercent:
      count > 0 ? (overPrediction / count) * 100 : 0,
    underPredictionPercent:
      count > 0 ? (underPrediction / count) * 100 : 0,
  };
}
