import { useMemo } from "react";
import type { ResidualResponse } from "../types/dashboard";

type ResidualData = ResidualResponse | null;

type ResidualAnalysisOptions = {
  residualData: ResidualData;
  minTemperature: string;
  maxTemperature: string;
  minPressure: string;
  maxPressure: string;
};

export function useResidualAnalysis({
  residualData,
  minTemperature,
  maxTemperature,
  minPressure,
  maxPressure,
}: ResidualAnalysisOptions) {
  return useMemo(() => {
    const filteredResiduals = residualData
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

    const topResiduals = [...filteredResiduals]
      .sort((a, b) => b.absolute_error - a.absolute_error)
      .slice(0, 10);

    const residualStats = {
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

    const temperatureRanges = [
      { label: "220-260 K", min: 220, max: 260 },
      { label: "260-300 K", min: 260, max: 300 },
      { label: "300-350 K", min: 300, max: 350 },
      { label: "350-400 K", min: 350, max: 400 },
    ];

    const pressureRanges = [
      { label: "0.1-2 MPa", min: 0.1, max: 2 },
      { label: "2-4 MPa", min: 2, max: 4 },
      { label: "4-6 MPa", min: 4, max: 6 },
      { label: "6-8 MPa", min: 6, max: 8 },
    ];

    const temperatureAnalysis = temperatureRanges.map((range) => {
      const samples = filteredResiduals.filter((point) => {
        const isLastGroup = range.max === 400;
        return (
          point.temperature_K >= range.min &&
          (isLastGroup
            ? point.temperature_K <= range.max
            : point.temperature_K < range.max)
        );
      });

      const count = samples.length;

      const meanResidual =
        count > 0
          ? samples.reduce((sum, point) => sum + point.residual, 0) /
            count
          : null;

      const mae =
        count > 0
          ? samples.reduce(
              (sum, point) => sum + point.absolute_error,
              0
            ) / count
          : null;

      const rmse =
        count > 0
          ? Math.sqrt(
              samples.reduce(
                (sum, point) => sum + point.residual ** 2,
                0
              ) / count
            )
          : null;

      return {
        temperatureRange: range.label,
        count,
        meanResidual,
        mae,
        rmse,
      };
    });

    const pressureAnalysis = pressureRanges.map((range) => {
      const samples = filteredResiduals.filter((point) => {
        const pressureMPa = point.pressure_Pa / 1_000_000;
        const isLastGroup = range.max === 8;

        return (
          pressureMPa >= range.min &&
          (isLastGroup
            ? pressureMPa <= range.max
            : pressureMPa < range.max)
        );
      });

      const count = samples.length;

      const meanResidual =
        count > 0
          ? samples.reduce((sum, point) => sum + point.residual, 0) /
            count
          : null;

      const mae =
        count > 0
          ? samples.reduce(
              (sum, point) => sum + point.absolute_error,
              0
            ) / count
          : null;

      const rmse =
        count > 0
          ? Math.sqrt(
              samples.reduce(
                (sum, point) => sum + point.residual ** 2,
                0
              ) / count
            )
          : null;

      return {
        pressureRange: range.label,
        count,
        meanResidual,
        mae,
        rmse,
      };
    });

    const temperaturePressureMatrix = temperatureRanges.flatMap(
      (temperatureRange) =>
        pressureRanges.map((pressureRange) => {
          const samples = filteredResiduals.filter((point) => {
            const pressureMPa = point.pressure_Pa / 1_000_000;

            const temperatureMatch =
              point.temperature_K >= temperatureRange.min &&
              (temperatureRange.max === 400
                ? point.temperature_K <= temperatureRange.max
                : point.temperature_K < temperatureRange.max);

            const pressureMatch =
              pressureMPa >= pressureRange.min &&
              (pressureRange.max === 8
                ? pressureMPa <= pressureRange.max
                : pressureMPa < pressureRange.max);

            return temperatureMatch && pressureMatch;
          });

          const count = samples.length;

          const meanResidual =
            count > 0
              ? samples.reduce(
                  (sum, point) => sum + point.residual,
                  0
                ) / count
              : null;

          const mae =
            count > 0
              ? samples.reduce(
                  (sum, point) => sum + point.absolute_error,
                  0
                ) / count
              : null;

          const rmse =
            count > 0
              ? Math.sqrt(
                  samples.reduce(
                    (sum, point) => sum + point.residual ** 2,
                    0
                  ) / count
                )
              : null;

          return {
            temperatureRange: temperatureRange.label,
            pressureRange: pressureRange.label,
            count,
            meanResidual,
            mae,
            rmse,
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

    const worstConditionPredictions = worstOperatingConditions
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

        const samples = filteredResiduals.filter((point) => {
          const pressureMPa = point.pressure_Pa / 1_000_000;

          const temperatureMatch =
            point.temperature_K >= temperatureRange.min &&
            (temperatureRange.max === 400
              ? point.temperature_K <= temperatureRange.max
              : point.temperature_K < temperatureRange.max);

          const pressureMatch =
            pressureMPa >= pressureRange.min &&
            (pressureRange.max === 8
              ? pressureMPa <= pressureRange.max
              : pressureMPa < pressureRange.max);

          return temperatureMatch && pressureMatch;
        });

        return samples.map((point) => ({
          ...point,
          temperatureRange: condition.temperatureRange,
          pressureRange: condition.pressureRange,
        }));
      })
      .sort((a, b) => b.absolute_error - a.absolute_error)
      .slice(0, 10);

    const worstPredictionStats = {
      total: worstConditionPredictions.length,

      overprediction: worstConditionPredictions.filter(
        (point) => point.residual < 0
      ).length,

      underprediction: worstConditionPredictions.filter(
        (point) => point.residual > 0
      ).length,

      meanAbsoluteError:
        worstConditionPredictions.length > 0
          ? worstConditionPredictions.reduce(
              (sum, point) => sum + point.absolute_error,
              0
            ) / worstConditionPredictions.length
          : 0,

      maximumAbsoluteError:
        worstConditionPredictions.length > 0
          ? Math.max(
              ...worstConditionPredictions.map(
                (point) => point.absolute_error
              )
            )
          : 0,
    };

    const residualInterpretation =
      residualStats.count === 0
        ? "No residual data available. Adjust the filters or load residual data."
        : residualStats.meanResidual < -0.001
          ? "The model tends to overpredict the compressibility factor Z compared with PR-EOS."
          : residualStats.meanResidual > 0.001
            ? "The model tends to underpredict the compressibility factor Z compared with PR-EOS."
            : "The model has a relatively small mean residual comparedwith PR-EOS.";

    const residualHistogram = (() => {
      const values = filteredResiduals.map(
        (point) => point.residual
      );

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
    })();

    return {
      temperatureRanges,
      pressureRanges,
      filteredResiduals,
      topResiduals,
      residualStats,
      temperatureAnalysis,
      pressureAnalysis,
      temperaturePressureMatrix,
      maxMatrixRmse,
      worstOperatingConditions,
      worstConditionPredictions,
      worstPredictionStats,
      residualInterpretation,
      residualHistogram,
    };
  }, [
    residualData,
    minTemperature,
    maxTemperature,
    minPressure,
    maxPressure,
  ]);
}
