import { MetricCard } from "../common/MetricCard";
import { ResidualScatterChart } from "./ResidualScatterChart";
import type { ResidualPoint } from "../../types/dashboard";

type WorstPredictionStats = {
  total: number;
  overprediction: number;
  underprediction: number;
  meanAbsoluteError: number;
  maximumAbsoluteError: number;
};

type WorstPredictionChartsProps = {
  predictions: ResidualPoint[];
  stats: WorstPredictionStats;
};

export function WorstPredictionCharts({
  predictions,
  stats,
}: WorstPredictionChartsProps) {
  return (
    <>
      <ResidualScatterChart
        title="Worst Predictions: Residual vs Temperature"
        description="Residual distribution across temperature for the 10 worst individual predictions"
        xDataKey="temperature_K"
        xName="Temperature"
        xLabel="Temperature (K)"
        data={predictions}
        fill="#f97316"
        pointName="Worst individual predictions"
        pointSize={70}
      />

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
              value={String(stats.total)}
              detail="Worst individual predictions"
            />
            <MetricCard
              label="Overprediction"
              value={String(stats.overprediction)}
              detail="Residual below zero"
            />
            <MetricCard
              label="Underprediction"
              value={String(stats.underprediction)}
              detail="Residual above zero"
            />
            <MetricCard
              label="Mean Absolute Error"
              value={stats.meanAbsoluteError.toFixed(6)}
              detail="Average absolute error"
            />
            <MetricCard
              label="Maximum Absolute Error"
              value={stats.maximumAbsoluteError.toFixed(6)}
              detail="Largest individual error"
            />
          </div>
        </div>
      </section>

      <ResidualScatterChart
        title="Worst Predictions: Residual vs Pressure"
        description="Residual distribution across pressure for the 10 worst individual predictions"
        xDataKey="pressure_Pa"
        xName="Pressure"
        xLabel="Pressure (MPa)"
        data={predictions}
        fill="#a78bfa"
        pointName="Worst individual predictions"
        pointSize={70}
      />
    </>
  );
}
