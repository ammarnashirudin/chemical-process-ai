import type { ResidualPoint } from "../../types/dashboard";

export const temperatureRanges = [
  { label: "220-260 K", min: 220, max: 260 },
  { label: "260-300 K", min: 260, max: 300 },
  { label: "300-350 K", min: 300, max: 350 },
  { label: "350-400 K", min: 350, max: 400 },
];

export const pressureRanges = [
  { label: "0.1-2 MPa", min: 0.1, max: 2 },
  { label: "2-4 MPa", min: 2, max: 4 },
  { label: "4-6 MPa", min: 4, max: 6 },
  { label: "6-8 MPa", min: 6, max: 8 },
];

function calculateMetrics(samples: ResidualPoint[]) {
  const count = samples.length;

  return {
    count,
    meanResidual:
      count > 0
        ? samples.reduce((sum, point) => sum + point.residual, 0) /
          count
        : null,
    mae:
      count > 0
        ? samples.reduce(
            (sum, point) => sum + point.absolute_error,
            0
          ) / count
        : null,
    rmse:
      count > 0
        ? Math.sqrt(
            samples.reduce(
              (sum, point) => sum + point.residual ** 2,
              0
            ) / count
          )
        : null,
  };
}

function matchesTemperature(
  point: ResidualPoint,
  range: (typeof temperatureRanges)[number]
) {
  return (
    point.temperature_K >= range.min &&
    (range.max === 400
      ? point.temperature_K <= range.max
      : point.temperature_K < range.max)
  );
}

function matchesPressure(
  point: ResidualPoint,
  range: (typeof pressureRanges)[number]
) {
  const pressureMPa = point.pressure_Pa / 1_000_000;

  return (
    pressureMPa >= range.min &&
    (range.max === 8
      ? pressureMPa <= range.max
      : pressureMPa < range.max)
  );
}

export function analyzeOperatingConditions(
  filteredResiduals: ResidualPoint[]
) {
  const temperatureAnalysis = temperatureRanges.map((range) => {
    const samples = filteredResiduals.filter((point) =>
      matchesTemperature(point, range)
    );

    return {
      temperatureRange: range.label,
      ...calculateMetrics(samples),
    };
  });

  const pressureAnalysis = pressureRanges.map((range) => {
    const samples = filteredResiduals.filter((point) =>
      matchesPressure(point, range)
    );

    return {
      pressureRange: range.label,
      ...calculateMetrics(samples),
    };
  });

  const temperaturePressureMatrix = temperatureRanges.flatMap(
    (temperatureRange) =>
      pressureRanges.map((pressureRange) => {
        const samples = filteredResiduals.filter(
          (point) =>
            matchesTemperature(point, temperatureRange) &&
            matchesPressure(point, pressureRange)
        );

        return {
          temperatureRange: temperatureRange.label,
          pressureRange: pressureRange.label,
          ...calculateMetrics(samples),
        };
      })
  );

  const maxMatrixRmse = Math.max(
    0,
    ...temperaturePressureMatrix.map((item) => item.rmse ?? 0)
  );

  const MIN_CELL_SAMPLES = 5;

  const worstOperatingConditions = temperaturePressureMatrix
    .filter(
      (item) =>
        item.count >= MIN_CELL_SAMPLES &&
        item.rmse !== null &&
        item.mae !== null &&
        item.meanResidual !== null
    )
    .sort((a, b) => (b.rmse ?? 0) - (a.rmse ?? 0))
    .slice(0, 5)
    .map((item, index) => ({
      rank: index + 1,
      temperatureRange: item.temperatureRange,
      pressureRange: item.pressureRange,
      count: item.count,
      meanResidual: item.meanResidual,
      mae: item.mae,
      rmse: item.rmse,
      errorDirection:
        item.meanResidual! < 0
          ? "Overprediction"
          : item.meanResidual! > 0
            ? "Underprediction"
            : "Balanced",
    }));

  return {
    temperatureAnalysis,
    pressureAnalysis,
    temperaturePressureMatrix,
    maxMatrixRmse,
    worstOperatingConditions,
  };
}

export function getWorstConditionPredictions(
  filteredResiduals: ResidualPoint[],
  worstOperatingConditions: ReturnType<
    typeof analyzeOperatingConditions
  >["worstOperatingConditions"]
) {
  return worstOperatingConditions
    .flatMap((condition) => {
      const temperatureRange = temperatureRanges.find(
        (range) => range.label === condition.temperatureRange
      );

      const pressureRange = pressureRanges.find(
        (range) => range.label === condition.pressureRange
      );

      if (!temperatureRange || !pressureRange) {
        return [];
      }

      const samples = filteredResiduals.filter(
        (point) =>
          matchesTemperature(point, temperatureRange) &&
          matchesPressure(point, pressureRange)
      );

      return samples.map((point) => ({
        ...point,
        temperatureRange: condition.temperatureRange,
        pressureRange: condition.pressureRange,
      }));
    })
    .sort((a, b) => b.absolute_error - a.absolute_error)
    .slice(0, 10);
}
