import type { ResidualPoint } from "../../../types/dashboard";

export function formatResidualDetails(point: ResidualPoint) {
  return {
    temperature: `${point.temperature_K.toFixed(2)}K`,
    pressure: `${(point.pressure_Pa / 1_000_000).toFixed(3)}MPa`,
    actualZ: point.z_actual.toFixed(6),
    predictedZ: point.z_predicted.toFixed(6),
    residual: point.residual.toFixed(6),
    absoluteError: point.absolute_error.toFixed(6),
    predictionErrorType:
      point.residual < 0
        ? "Overprediction"
        : point.residual > 0
          ? "Underprediction"
          : "Exact Prediction",
  };
}
