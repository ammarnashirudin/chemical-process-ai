import { useMemo } from "react";
import type { ResidualResponse } from "../types/dashboard";
import { filterResiduals, getTopResiduals } from "../lib/residual-analysis/filters";
import { calculateResidualStats } from "../lib/residual-analysis/statistics";
import {
  calculateWorstPredictionStats,
  interpretResiduals,
  buildResidualHistogram,
} from "../lib/residual-analysis/summaries";
import {
  analyzeOperatingConditions,
  getWorstConditionPredictions,
  temperatureRanges,
  pressureRanges,
} from "../lib/residual-analysis/operating-conditions";

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
    const filteredResiduals = filterResiduals({
      residualData,
      minTemperature,
      maxTemperature,
      minPressure,
      maxPressure,
    });

    const topResiduals = getTopResiduals(filteredResiduals);

    const residualStats = calculateResidualStats(filteredResiduals);

    const {
      temperatureAnalysis,
      pressureAnalysis,
      temperaturePressureMatrix,
      maxMatrixRmse,
      worstOperatingConditions,
    } = analyzeOperatingConditions(filteredResiduals);

    const worstConditionPredictions = getWorstConditionPredictions(
      filteredResiduals,
      worstOperatingConditions
    );
    const worstPredictionStats = calculateWorstPredictionStats(
      worstConditionPredictions
    );

    const residualInterpretation = interpretResiduals(
      residualStats.count,
      residualStats.meanResidual
    );

    const residualHistogram = buildResidualHistogram(
      filteredResiduals
    );

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
