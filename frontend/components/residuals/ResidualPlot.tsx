import { ResidualPlotStats } from "./ResidualPlotStats";
import { ResidualScatterCharts } from "./ResidualScatterCharts";
import { SelectedResidualDetails } from "./SelectedResidualDetails";
import { ResidualDistribution } from "./ResidualDistribution";
import type {
  ResidualPoint,
  ResidualResponse,
  ResidualHistogramPoint,
  ResidualStats,
} from "../../types/dashboard";

type ResidualPlotProps = {
  residualData: ResidualResponse | null;
  residualLoading: boolean;
  residualError: string;
  loadResiduals: () => void;
  filteredResiduals: ResidualPoint[];
  residualStats: ResidualStats;
  selectedResidual: ResidualPoint | null;
  onSelectResidual: (point: ResidualPoint | null) => void;
  residualInterpretation: string;
  residualHistogram: ResidualHistogramPoint[];
};

export function ResidualPlot({
  residualData,
  residualLoading,
  residualError,
  loadResiduals,
  filteredResiduals,
  residualStats,
  selectedResidual,
  onSelectResidual,
  residualInterpretation,
  residualHistogram,
}: ResidualPlotProps) {
  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">
            Residual Plot
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Predicted Z versus residual pada test dataset
          </p>
        </div>

        <button
          onClick={loadResiduals}
          disabled={residualLoading}
          className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
        >
          {residualLoading ? "Loading..." : "Load Residual Plot"}
        </button>
      </div>

      {residualError && (
        <p className="text-sm text-red-400">
          {residualError}
        </p>
      )}

      {residualData && (
        <>
          <p className="text-sm text-slate-400">
            {residualData.count} test samples
          </p>

          <p className="text-sm text-slate-400">
            Filtered samples: {filteredResiduals.length}
          </p>

          <ResidualPlotStats residualStats={residualStats} />

          <ResidualScatterCharts
            filteredResiduals={filteredResiduals}
            onPointClick={onSelectResidual}
          />

          <p className="text-sm leading-6 text-slate-300">
            Residual = actual PR-EOS Z − predicted ML Z.
            Points above zero indicate that the ML prediction is lower
            than the PR-EOS value, while points below zero
            indicate that the ML prediction is higher than the PR-EOS value.
          </p>
        </>
      )}

      <SelectedResidualDetails
        selectedResidual={selectedResidual}
        onClear={() => onSelectResidual(null)}
      />

      <ResidualDistribution
        residualInterpretation={residualInterpretation}
        residualHistogram={residualHistogram}
        qqPlot={residualData?.qq_plot ?? []}
      />
    </section>
  );
}
