import type {
  ResidualPoint,
  TemperatureAnalysisRow,
  PressureAnalysisRow,
  TemperaturePressureMatrixCell,
} from "../../types/dashboard";

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

const MIN_CELL_SAMPLES = 5;
const MAX_WORST_CONDITIONS = 5;
const MAX_WORST_PREDICTIONS = 10;
const PRESSURE_PA_PER_MPA = 1_000_000;

type OperatingConditionSample = {
  count: number;
  residualSum: number;
  absoluteErrorSum: number;
  squaredResidualSum: number;
};

function createEmptyGroup(): OperatingConditionSample {
  return {
    count: 0,
    residualSum: 0,
    absoluteErrorSum: 0,
    squaredResidualSum: 0,
  };
}

function addSample(
  group: OperatingConditionSample,
  point: ResidualPoint
) {
  group.count += 1;
  group.residualSum += point.residual;
  group.absoluteErrorSum += point.absolute_error;
  group.squaredResidualSum += point.residual ** 2;
}

function calculateMetrics(group: OperatingConditionSample) {
  const { count } = group;

  return {
    count,
    meanResidual:
      count > 0 ? group.residualSum / count : null,
    mae:
      count > 0 ? group.absoluteErrorSum / count : null,
    rmse:
      count > 0
        ? Math.sqrt(group.squaredResidualSum / count)
        : null,
  };
}

function findRangeIndex(
  value: number,
  ranges: typeof temperatureRanges | typeof pressureRanges
): number {
  return ranges.findIndex(
    (range, index) =>
      value >= range.min &&
      (index === ranges.length - 1
        ? value <= range.max
        : value < range.max)
  );
}

function createWorstOperatingConditions(
  matrix: TemperaturePressureMatrixCell[]
) {
  return matrix
    .filter(
      (item) =>
        item.count >= MIN_CELL_SAMPLES &&
        item.rmse !== null &&
        item.mae !== null &&
        item.meanResidual !== null
    )
    .sort((a, b) => (b.rmse ?? 0) - (a.rmse ?? 0))
    .slice(0, MAX_WORST_CONDITIONS)
    .map((item, index) => ({
      rank: index + 1,
      temperatureRange: item.temperatureRange,
      pressureRange: item.pressureRange,
      count: item.count,
      meanResidual: item.meanResidual!,
      mae: item.mae!,
      rmse: item.rmse!,
      errorDirection:
        item.meanResidual! < 0
          ? "Overprediction"
          : item.meanResidual! > 0
            ? "Underprediction"
            : "Balanced",
    }));
}

export function analyzeOperatingConditions(
  filteredResiduals: ResidualPoint[]
) {
  const temperatureGroups = temperatureRanges.map(() =>
    createEmptyGroup()
  );

  const pressureGroups = pressureRanges.map(() =>
    createEmptyGroup()
  );

  const matrixGroups = temperatureRanges.map(() =>
    pressureRanges.map(() => createEmptyGroup())
  );

  for (const point of filteredResiduals) {
    const temperatureIndex = findRangeIndex(
      point.temperature_K,
      temperatureRanges
    );

    const pressureIndex = findRangeIndex(
      point.pressure_Pa / PRESSURE_PA_PER_MPA,
      pressureRanges
    );

    if (temperatureIndex !== -1) {
      addSample(temperatureGroups[temperatureIndex], point);
    }

    if (pressureIndex !== -1) {
      addSample(pressureGroups[pressureIndex], point);
    }

    if (temperatureIndex !== -1 && pressureIndex !== -1) {
      addSample(
        matrixGroups[temperatureIndex][pressureIndex],
        point
      );
    }
  }

  const temperatureAnalysis: TemperatureAnalysisRow[] =
    temperatureRanges.map((range, index) => ({
      temperatureRange: range.label,
      ...calculateMetrics(temperatureGroups[index]),
    }));

  const pressureAnalysis: PressureAnalysisRow[] =
    pressureRanges.map((range, index) => ({
      pressureRange: range.label,
      ...calculateMetrics(pressureGroups[index]),
    }));

  const temperaturePressureMatrix: TemperaturePressureMatrixCell[] =
    temperatureRanges.flatMap((temperatureRange, temperatureIndex) =>
      pressureRanges.map((pressureRange, pressureIndex) => ({
        temperatureRange: temperatureRange.label,
        pressureRange: pressureRange.label,
        ...calculateMetrics(
          matrixGroups[temperatureIndex][pressureIndex]
        ),
      }))
    );

  const maxMatrixRmse = Math.max(
    0,
    ...temperaturePressureMatrix.map((item) => item.rmse ?? 0)
  );

  const worstOperatingConditions =
    createWorstOperatingConditions(temperaturePressureMatrix);

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
  const conditionIndexByKey = new Map(
    worstOperatingConditions.map((condition, index) => [
      `${condition.temperatureRange}|${condition.pressureRange}`,
      index,
    ])
  );

  const predictionsByCondition = worstOperatingConditions.map(
    () => [] as (ResidualPoint & {
      temperatureRange: string;
      pressureRange: string;
    })[]
  );

  for (const point of filteredResiduals) {
    const temperatureIndex = findRangeIndex(
      point.temperature_K,
      temperatureRanges
    );

    const pressureIndex = findRangeIndex(
      point.pressure_Pa / PRESSURE_PA_PER_MPA,
      pressureRanges
    );

    if (temperatureIndex === -1 || pressureIndex === -1) {
      continue;
    }

    const temperatureRange = temperatureRanges[temperatureIndex].label;
    const pressureRange = pressureRanges[pressureIndex].label;

    const conditionIndex = conditionIndexByKey.get(
      `${temperatureRange}|${pressureRange}`
    );

    if (conditionIndex === undefined) {
      continue;
    }

    predictionsByCondition[conditionIndex].push({
      ...point,
      temperatureRange,
      pressureRange,
    });
  }

  return predictionsByCondition
    .flat()
    .sort((a, b) => b.absolute_error - a.absolute_error)
    .slice(0, MAX_WORST_PREDICTIONS);
}
