
"use client";

import { useState } from "react";
import { usePrediction } from "../hooks/usePrediction";
import { useModelEvaluation } from "../hooks/useModelEvaluation";
import { useResidualData } from "../hooks/useResidualData";
import { usePressureCurve } from "../hooks/usePressureCurve";
import { MetricCard } from "../components/common/MetricCard";
import { DashboardHeader } from "../components/layout/DashboardHeader";
import { DashboardIntro } from "../components/layout/DashboardIntro";
import { EvaluationSummary } from "../components/prediction/EvaluationSummary";
import { ModelComparison } from "../components/prediction/ModelComparison";
import { PredictionPanel } from "../components/prediction/PredictionPanel";
import { ModelReferenceChart } from "../components/prediction/ModelReferenceChart";
import { PressureCurveChart } from "../components/prediction/PressureCurveChart";
import { ResidualAnalysisSummary } from "../components/residuals/ResidualAnalysisSummary";
import { ResidualPlot } from "../components/residuals/ResidualPlot";
import { ResidualRangeAnalysis } from "../components/residuals/ResidualRangeAnalysis";
import { ResidualErrorHeatmap } from "../components/residuals/ResidualErrorHeatmap";
import { WorstOperatingConditions } from "../components/residuals/WorstOperatingConditions";
import { WorstIndividualPredictions } from "../components/residuals/WorstIndividualPredictions";
import { TopResidualsTable } from "../components/residuals/TopResidualsTable";
import {
  checkApiStatus,
} from "../lib/api";

import type {
  ModelComparisonPoint,
  ResidualPoint,
} from "../types/dashboard";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine,
} from "recharts";



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




  const modelComparisonData: ModelComparisonPoint[] = evaluation
    ? [
        {
          model: "Linear Regression",
          ...evaluation.validation_results.linear_regression,
        },
        {
          model: "Random Forest (Standard)",
          ...evaluation.validation_results.random_forest,
        },
        {
          model: "Random Forest (Tuned)",
          ...evaluation.validation_results.random_forest_tuned,
        },
        {
          model: "Gradient Boosting",
          ...evaluation.validation_results.gradient_boosting,
        },
      ]
    : [];

  const filteredResiduals = residualData
  ? residualData.residuals.filter((point)=>{
    const minT = Number(minTemperature);
    const maxT = Number(maxTemperature);
    const minP = Number(minPressure)*1_000_000;
    const maxP = Number(maxPressure)*1_000_000;

    return(
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
  }):[];

  const topResiduals = [...filteredResiduals]
  .sort((a,b)=>b.absolute_error - a.absolute_error)
  .slice(0, 10);

  const residualStats = {
    count: filteredResiduals.length,

    meanResidual:
    filteredResiduals.length>0
    ? filteredResiduals.reduce(
      (sum, point)=>sum+point.residual,0
    )/filteredResiduals.length : 0,

    mae:
    filteredResiduals.length>0
    ? filteredResiduals.reduce(
      (sum, point)=>sum+point.absolute_error, 0
    )/filteredResiduals.length : 0,

    overPrediction:
    filteredResiduals.filter((point)=>point.residual<0).length,

    underPrediction:
    filteredResiduals.filter((point)=>point.residual>0).length,

    standardDeviation:
      filteredResiduals.length > 1
        ? Math.sqrt(
            filteredResiduals.reduce(
              (sum, point) =>
                sum + Math.pow(
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
      ).length/filteredResiduals.length)*100
      :0,

      underPredictionPercent:
      filteredResiduals.length > 0
      ? (filteredResiduals.filter(
        (point) => point.residual > 0
      ).length / filteredResiduals.length) * 100
      : 0,
  };

  const temperatureRanges = [
    {label: "220-260 K", min: 220, max: 260},
    {label: "260-300 K", min: 260, max: 300},
    {label: "300-350 K", min: 300, max: 350},
    {label: "350-400 K", min: 350, max: 400},
  ];

  const temperatureAnalysis = temperatureRanges.map((range)=>{
    const samples = filteredResiduals.filter((point)=>{
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
    ? samples.reduce(
      (sum, point) => sum + point.residual, 0
    ) / count
    : null;

    const mae =
    count > 0
    ? samples.reduce(
      (sum, point) => sum + point.absolute_error, 0
    ) / count
    : null;

    const rmse =
    count > 0
    ? Math.sqrt(
      samples.reduce(
        (sum, point) => sum + point.residual ** 2, 0
      ) / count
    ) : null;

    return {
      temperatureRange: range.label,
      count,
      meanResidual,
      mae,
      rmse,
    }
  });

  const pressureRanges = [
    {label: "0.1-2 MPa", min: 0.1, max: 2},
    {label: "2-4 MPa", min: 2, max: 4},
    {label: "4-6 MPa", min: 4, max: 6},
    {label: "6-8 MPa", min: 6, max: 8},
  ];

  const pressureAnalysis = pressureRanges.map((range)=>{
    const samples = filteredResiduals.filter((point)=>{
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
    ? samples.reduce(
      (sum, point) => sum + point.residual, 0
    ) / count
    : null;

    const mae =
    count > 0
    ? samples.reduce(
      (sum, point) => sum + point.absolute_error, 0
    ) / count
    : null;

    const rmse =
    count > 0
    ? Math.sqrt(
      samples.reduce(
        (sum, point) => sum + point.residual ** 2, 0
      ) / count
    ) : null;

    return {
      pressureRange: range.label,
      count,
      meanResidual,
      mae,
      rmse,
    }
  });

  const temperaturePressureMatrix = temperatureRanges.flatMap(
    (temperatureRange) => pressureRanges.map((pressureRange) => {
      const samples = filteredResiduals.filter((point) => {
        const pressureMPa = point.pressure_Pa / 1_000_000;

        const isLastTemperatureGroup = temperatureRange.max === 400;

        const isLastPressureGroup = pressureRange.max === 8;

        const temperatureMatch =
        point.temperature_K >= temperatureRange.min &&
        (isLastTemperatureGroup
          ? point.temperature_K <= temperatureRange.max
          : point.temperature_K < temperatureRange.max)

        const pressureMatch =
        pressureMPa >= pressureRange.min &&
        (isLastPressureGroup
          ? pressureMPa <= pressureRange.max
          : pressureMPa < pressureRange.max)

        return temperatureMatch && pressureMatch;
    });

    const count = samples.length;

    const meanResidual =
    count > 0
    ? samples.reduce(
      (sum, point) => sum + point.residual, 0
    ) / count
    : null;

    const mae =
    count > 0
    ? samples.reduce(
      (sum, point) => sum + point.absolute_error, 0
    ) / count
    : null;

    const rmse =
    count > 0
    ? Math.sqrt(
      samples.reduce(
        (sum, point) => sum + point.residual ** 2, 0
      ) / count
    ) : null;

    return {
      temperatureRange: temperatureRange.label,
      pressureRange: pressureRange.label,
      count,
      meanResidual,
      mae,
      rmse,
    };
  }));

  const maxMatrixRmse = Math.max(
    0,
    ...temperaturePressureMatrix
    .map((item) => item.rmse ?? 0)
  );

  const MIN_CELL_SAMPLES = 5;

  const worstOperatingConditions = temperaturePressureMatrix
  .filter(
    (item)=>
      item.count >= MIN_CELL_SAMPLES &&
      item.rmse !== null &&
      item.mae !== null &&
      item.meanResidual !== null
    )
    .sort((a,b)=>(b.rmse ?? 0) - (a.rmse ?? 0))
    .slice(0, 5)
    .map((item, index)=>({
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
    })

  )

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
  :  "The model has a relatively small mean residual compared with PR-EOS.";

  const residualHistogram = (()=>{
    const values = filteredResiduals.map(
      (point) => point.residual
    );
    if (values.length === 0){
      return [];
    }

    const min = Math.min(...values);
    const max = Math.max(...values);
    const binCount = 20;

    const range = max - min;
    const binWidth = range > 0 ? range / binCount : 1;

    const bins = Array.from(
      {length : binCount},
      (_, index) => ({
        binStart: min + index * binWidth,
        binEnd: min + (index + 1) * binWidth,
        frequency : 0,
      })
    );

    values.forEach((value)=>{
      let index =
      range > 0
      ? Math.floor((value - min) / binWidth)
      :0;

      index = Math.min(index, binCount-1);

      bins[index].frequency += 1;
    });

    return bins.map((bin) => ({
      residualRange :
      `${bin.binStart.toFixed(4)} to ${bin.binEnd.toFixed(4)}`,
      frequency: bin.frequency,
    }));
  })();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <DashboardHeader apiOnline={apiOnline} checkApi={checkApi} />

      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <DashboardIntro />

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Fluid"
            value="Methane (CHÃ¢â€šâ€ž)"
            detail="Pure component"
          />
          <MetricCard
            label="ML Model"
            value="Random Forest Tuned"
            detail="Supervised regression"
          />
          <MetricCard
            label="Reference"
            value="PR-EOS"
            detail="PengÃ¢â‚¬â€œRobinson equation"
          />
          <MetricCard
            label="Target Property"
            value="Z-factor"
            detail="Dimensionless"
          />
        </section>

        <EvaluationSummary
          evaluation={evaluation}
          evaluationLoading={evaluationLoading}
          evaluationError={evaluationError}
          loadEvaluation={loadEvaluation}
        />

        <ModelComparison
          evaluation={evaluation}
          modelComparisonData={modelComparisonData}
        />

        <ResidualAnalysisSummary evaluation={evaluation} />

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
<section className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 space-y-5">
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
          <h3 className="text-lg font-semibold text-white">
            Worst Predictions: Residual vs Temperature
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Residual distribution across temperature for the 10 worst individual predictions
          </p>

          <div className="mt-5 h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 10, right: 20, bottom: 20, left: 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                />

                <XAxis
                  type="number"
                  dataKey="temperature_K"
                  name="Temperature"
                  domain={["auto", "auto"]}
                  stroke="#94a3b8"
                  label={{
                    value: "Temperature (K)",
                    position: "insideBottom",
                    offset: -10,
                    fill: "#94a3b8",
                  }}
                />

                <YAxis
                  type="number"
                  dataKey="residual"
                  name="Residual"
                  domain={["auto", "auto"]}
                  stroke="#94a3b8"
                  label={{
                    value: "Residual",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#94a3b8",
                  }}
                />

                <ZAxis range={[70, 70]} />

                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => [
                    Number(value).toFixed(6),
                    String(name),
                  ]}
                />

                <ReferenceLine
                  y={0}
                  stroke="#f87171"
                  strokeDasharray="5 5"
                />

                <Scatter
                  name="Worst individual predictions"
                  data={worstConditionPredictions}
                  fill="#f97316"
                  fillOpacity={0.85}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
        </section>

        <section className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 space-y-5">

        <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
          <h3 className="text-lg font-semibold text-white">
            Worst Prediction Statistics
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Statistical summary of the 10 worst individual predictions
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <MetricCard
              label="Total Samples"
              value={String(worstPredictionStats.total)}
              detail="Worst individual predictions"
            />

            <MetricCard
              label="Overprediction"
              value={String(worstPredictionStats.overprediction)}
              detail="Residual below zero"
            />

            <MetricCard
              label="Underprediction"
              value={String(worstPredictionStats.underprediction)}
              detail="Residual above zero"
            />

            <MetricCard
              label="Mean Absolute Error"
              value={worstPredictionStats.meanAbsoluteError.toFixed(6)}
              detail="Average absolute error"
            />

            <MetricCard
              label="Maximum Absolute Error"
              value={worstPredictionStats.maximumAbsoluteError.toFixed(6)}
              detail="Largest individual error"
            />
          </div>
        </div>
        </section>

        <section className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 space-y-5">
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
          <h3 className="text-lg font-semibold text-white">
            Worst Predictions: Residual vs Pressure
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Residual distribution across pressure for the 10 worst individual predictions
          </p>

          <div className="mt-5 h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 10, right: 20, bottom: 20, left: 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                />

                <XAxis
                  type="number"
                  dataKey="pressure_Pa"
                  name="Pressure"
                  domain={["auto", "auto"]}
                  tickFormatter={(value) =>
                    (Number(value) / 1_000_000).toFixed(1)
                  }
                  stroke="#94a3b8"
                  label={{
                    value: "Pressure (MPa)",
                    position: "insideBottom",
                    offset: -10,
                    fill: "#94a3b8",
                  }}
                />

                <YAxis
                  type="number"
                  dataKey="residual"
                  name="Residual"
                  domain={["auto", "auto"]}
                  stroke="#94a3b8"
                  label={{
                    value: "Residual",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#94a3b8",
                  }}
                />

                <ZAxis range={[70, 70]} />

                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => [
                    name === "Pressure"
                      ? `${(Number(value) / 1_000_000).toFixed(3)} MPa`
                      : Number(value).toFixed(6),
                    String(name),
                  ]}
                />

                <ReferenceLine
                  y={0}
                  stroke="#f87171"
                  strokeDasharray="5 5"
                />

                <Scatter
                  name="Worst individual predictions"
                  data={worstConditionPredictions}
                  fill="#a78bfa"
                  fillOpacity={0.85}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
        </section>

        <section className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 space-y-5">
        <div>
          <h2 className="text-xl font-bold text-white">
            Top 10 Largest Residuals
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Test samples with the largest absolute errors,
            sorted from largest to smallest
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-700 bg-slate-900/70 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label
              htmlFor="min-temperature"
              className="mb-2 block text-sm text-slate-400"
            >
              Min Temperature (K)
            </label>
            <input
              id="min-temperature"
              type="number"
              value={minTemperature}
              min={220}
              max={400}
              onChange={(event) => setMinTemperature(event.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label
              htmlFor="max-temperature"
              className="mb-2 block text-sm text-slate-400"
            >
              Max Temperature (K)
            </label>
            <input
              id="max-temperature"
              type="number"
              value={maxTemperature}
              min={220}
              max={400}
              onChange={(event) => setMaxTemperature(event.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label
              htmlFor="min-pressure"
              className="mb-2 block text-sm text-slate-400"
            >
              Min Pressure (MPa)
            </label>
            <input
              id="min-pressure"
              type="number"
              value={minPressure}
              min={0.1}
              max={8}
              step={0.1}
              onChange={(event) => setMinPressure(event.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label
              htmlFor="max-pressure"
              className="mb-2 block text-sm text-slate-400"
            >
              Max Pressure (MPa)
            </label>
            <input
              id="max-pressure"
              type="number"
              value={maxPressure}
              min={0.1}
              max={8}
              step={0.1}
              onChange={(event) => setMaxPressure(event.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-400">
            Showing {filteredResiduals.length} matching samples
          </p>

          <button
            type="button"
            onClick={() => {
              setMinTemperature("220");
              setMaxTemperature("400");
              setMinPressure("0.1");
              setMaxPressure("8");
            }}
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-700"
          >
            Reset Filters
          </button>
        </div>

        {!residualData ? (
          <p className="text-sm text-slate-400">
            Click load residual plot to load the residual data.
          </p>
        ) : (
          <TopResidualsTable
            residuals={topResiduals}
            selectedResidual={selectedResidual}
            onSelect={setSelectResidual}
          />
        )}
        {residualData &&(
          <p className="text-xs text-slate-500">
            Showing {topResiduals.length} of {residualData.count} test samples.
            click a row to view residual details.
          </p>
        )}

        </section>

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

        <footer className="border-t border-slate-800 py-5 text-xs text-slate-500">
          Chemical Process AI | Machine Learning + Thermodynamic Modeling
          <p className="mt-1">
            Educational and portfolio project. ML predictions require
            independent validation before engineering deployment.
          </p>
        </footer>
      </div>
    </main>
  );
}
