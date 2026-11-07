
"use client";

import { useState } from "react";
import { usePrediction } from "../hooks/usePrediction";
import { useModelEvaluation } from "../hooks/useModelEvaluation";
import { useResidualData } from "../hooks/useResidualData";
import { useResidualAnalysis } from "../hooks/useResidualAnalysis";
import { usePressureCurve } from "../hooks/usePressureCurve";
import { DashboardHeader } from "../components/layout/DashboardHeader";
import { DashboardIntro } from "../components/layout/DashboardIntro";
import { DashboardOverview } from "../components/layout/DashboardOverview";
import { DashboardFooter } from "../components/layout/DashboardFooter";
import { PredictionPanel } from "../components/prediction/PredictionPanel";
import { ModelReferenceChart } from "../components/prediction/ModelReferenceChart";
import { PressureCurveChart } from "../components/prediction/PressureCurveChart";
import { ResidualPlot } from "../components/residuals/ResidualPlot";
import { ResidualRangeAnalysis } from "../components/residuals/ResidualRangeAnalysis";
import { ResidualErrorHeatmap } from "../components/residuals/ResidualErrorHeatmap";
import { WorstOperatingConditions } from "../components/residuals/WorstOperatingConditions";
import { WorstIndividualPredictions } from "../components/residuals/WorstIndividualPredictions";
import { WorstPredictionCharts } from "../components/residuals/WorstPredictionCharts";
import { ResidualFilterPanel } from "../components/residuals/ResidualFilterPanel";
import {
  checkApiStatus,
} from "../lib/api";

import type {
  ResidualPoint,
} from "../types/dashboard";




export default function Home() {
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  const {
    temperature,
    setTemperature,
    pressure,
    setPressure,
    result,
    comparison,
    loading,
    error,
    predict,
  } = usePrediction(setApiOnline);

  const {
    curve,
    curveLoading,
    curveError,
    loadPressureCurve,
  } = usePressureCurve(temperature, setApiOnline);
  const {
    evaluation,
    evaluationLoading,
    evaluationError,
    loadEvaluation,
  } = useModelEvaluation(setApiOnline);
  const {
    residualData,
    residualLoading,
    residualError,
    loadResiduals,
  } = useResidualData(setApiOnline);
  const [selectedResidual, setSelectResidual] = useState<ResidualPoint | null>(null);
  const [minTemperature, setMinTemperature] = useState("220");
  const [maxTemperature, setMaxTemperature] = useState("400");
  const [minPressure, setMinPressure] = useState("0.1");
  const [maxPressure, setMaxPressure] = useState("8");

  async function checkApi() {
    try {
      const isOnline = await checkApiStatus();
      setApiOnline(isOnline);
    } catch {
      setApiOnline(false);
    }
  }




const {
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
  } = useResidualAnalysis({
    residualData,
    minTemperature,
    maxTemperature,
    minPressure,
    maxPressure,
  });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <DashboardHeader apiOnline={apiOnline} checkApi={checkApi} />

      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <DashboardIntro />

        <DashboardOverview
          evaluation={evaluation}
          evaluationLoading={evaluationLoading}
          evaluationError={evaluationError}
          loadEvaluation={loadEvaluation}
        />

        <ResidualPlot
          residualData={residualData}
          residualLoading={residualLoading}
          residualError={residualError}
          loadResiduals={loadResiduals}
          filteredResiduals={filteredResiduals}
          residualStats={residualStats}
          selectedResidual={selectedResidual}
          onSelectResidual={setSelectResidual}
          residualInterpretation={residualInterpretation}
          residualHistogram={residualHistogram}
        />

        <ResidualRangeAnalysis
          temperatureAnalysis={temperatureAnalysis}
          pressureAnalysis={pressureAnalysis}
        />
        <ResidualErrorHeatmap
          temperatureRanges={temperatureRanges}
          pressureRanges={pressureRanges}
          temperaturePressureMatrix={temperaturePressureMatrix}
          maxMatrixRmse={maxMatrixRmse}
        />
        <WorstOperatingConditions
          conditions={worstOperatingConditions}
        />
                <WorstIndividualPredictions
          predictions={worstConditionPredictions}
        />
        <WorstPredictionCharts
          predictions={worstConditionPredictions}
          stats={worstPredictionStats}
        />

        <ResidualFilterPanel
          residualData={residualData}
          filteredResiduals={filteredResiduals}
          topResiduals={topResiduals}
          selectedResidual={selectedResidual}
          onSelectResidual={setSelectResidual}
          minTemperature={minTemperature}
          maxTemperature={maxTemperature}
          minPressure={minPressure}
          maxPressure={maxPressure}
          setMinTemperature={setMinTemperature}
          setMaxTemperature={setMaxTemperature}
          setMinPressure={setMinPressure}
          setMaxPressure={setMaxPressure}
        />
<PredictionPanel
          temperature={temperature}
          setTemperature={setTemperature}
          pressure={pressure}
          setPressure={setPressure}
          loading={loading}
          error={error}
          predict={predict}
          result={result}
          comparison={comparison}
        />
        <ModelReferenceChart comparison={comparison} />
        <PressureCurveChart
          curve={curve}
          curveLoading={curveLoading}
          curveError={curveError}
          loadPressureCurve={loadPressureCurve}
        />

        <DashboardFooter />
      </div>
    </main>
  );
}
