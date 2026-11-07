import type { ResidualPoint } from "../../types/dashboard";

export function calculateResidualStats(
  filteredResiduals: ResidualPoint[]
) {
  return {
    count: filteredResiduals.length,

    meanResidual:
      filteredResiduals.length > 0
        ? filteredResiduals.reduce(
            (sum, point) => sum + point.residual,
            0
          ) / filteredResiduals.length
        : 0,

    mae:
      filteredResiduals.length > 0
        ? filteredResiduals.reduce(
            (sum, point) => sum + point.absolute_error,
            0
          ) / filteredResiduals.length
        : 0,

    overPrediction: filteredResiduals.filter(
      (point) => point.residual < 0
    ).length,

    underPrediction: filteredResiduals.filter(
      (point) => point.residual > 0
    ).length,

    standardDeviation:
      filteredResiduals.length > 1
        ? Math.sqrt(
            filteredResiduals.reduce(
              (sum, point) =>
                sum +
                Math.pow(
                  point.residual -
                    filteredResiduals.reduce(
                      (total, item) => total + item.residual,
                      0
                    ) / filteredResiduals.length,
                  2
                ),
              0
            ) / filteredResiduals.length
          )
        : 0,

    overPredictionPercent:
      filteredResiduals.length > 0
        ? (filteredResiduals.filter(
            (point) => point.residual < 0
          ).length /
            filteredResiduals.length) *
          100
        : 0,

    underPredictionPercent:
      filteredResiduals.length > 0
        ? (filteredResiduals.filter(
            (point) => point.residual > 0
          ).length /
            filteredResiduals.length) *
          100
        : 0,
  };
}
