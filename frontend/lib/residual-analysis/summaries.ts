import type { ResidualPoint } from "../../types/dashboard";

export function calculateWorstPredictionStats(
  predictions: ResidualPoint[]
) {
  return {
    total: predictions.length,

    overprediction: predictions.filter(
      (point) => point.residual < 0
    ).length,

    underprediction: predictions.filter(
      (point) => point.residual > 0
    ).length,

    meanAbsoluteError:
      predictions.length > 0
        ? predictions.reduce(
            (sum, point) => sum + point.absolute_error,
            0
          ) / predictions.length
        : 0,

    maximumAbsoluteError:
      predictions.length > 0
        ? Math.max(
            ...predictions.map((point) => point.absolute_error)
          )
        : 0,
  };
}

export function interpretResiduals(
  count: number,
  meanResidual: number
): string {
  if (count === 0) {
    return "No residual data available. Adjust the filters or load residual data.";
  }

  if (meanResidual < -0.001) {
    return "The model tends to overpredict the compressibility factor Z compared with PR-EOS.";
  }

  if (meanResidual > 0.001) {
    return "The model tends to underpredict the compressibility factor Z compared with PR-EOS.";
  }

  return "The model has a relatively small mean residual compared with PR-EOS.";
}

export function buildResidualHistogram(
  residuals: ResidualPoint[]
) {
  const values = residuals.map((point) => point.residual);

  if (values.length === 0) {
    return [];
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const binCount = 20;

  const range = max - min;
  const binWidth = range > 0 ? range / binCount : 1;

  const bins = Array.from(
    { length: binCount },
    (_, index) => ({
      binStart: min + index * binWidth,
      binEnd: min + (index + 1) * binWidth,
      frequency: 0,
    })
  );

  values.forEach((value) => {
    let index =
      range > 0
        ? Math.floor((value - min) / binWidth)
        : 0;

    index = Math.min(index, binCount - 1);
    bins[index].frequency += 1;
  });

  return bins.map((bin) => ({
    residualRange: `${bin.binStart.toFixed(4)} to ${bin.binEnd.toFixed(4)}`,
    frequency: bin.frequency,
  }));
}
