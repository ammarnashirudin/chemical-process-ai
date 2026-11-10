import type {
  ResidualPoint,
  ResidualResponse,
} from "../../types/dashboard";
import { ResidualFilterInputs } from "./ResidualFilterInputs";
import { TopResidualsTable } from "./TopResidualsTable";

type ResidualFilterPanelProps = {
  residualData: ResidualResponse | null;
  filteredResiduals: ResidualPoint[];
  topResiduals: ResidualPoint[];
  selectedResidual: ResidualPoint | null;
  onSelectResidual: (point: ResidualPoint) => void;
  minTemperature: string;
  maxTemperature: string;
  minPressure: string;
  maxPressure: string;
  setMinTemperature: (value: string) => void;
  setMaxTemperature: (value: string) => void;
  setMinPressure: (value: string) => void;
  setMaxPressure: (value: string) => void;
};

export function ResidualFilterPanel({
  residualData,
  filteredResiduals,
  topResiduals,
  selectedResidual,
  onSelectResidual,
  minTemperature,
  maxTemperature,
  minPressure,
  maxPressure,
  setMinTemperature,
  setMaxTemperature,
  setMinPressure,
  setMaxPressure,
}: ResidualFilterPanelProps) {
  function resetFilters() {
    setMinTemperature("220");
    setMaxTemperature("400");
    setMinPressure("0.1");
    setMaxPressure("8");
  }

  return (
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

      <ResidualFilterInputs
        minTemperature={minTemperature}
        maxTemperature={maxTemperature}
        minPressure={minPressure}
        maxPressure={maxPressure}
        setMinTemperature={setMinTemperature}
        setMaxTemperature={setMaxTemperature}
        setMinPressure={setMinPressure}
        setMaxPressure={setMaxPressure}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-400">
          Showing {filteredResiduals.length} matching samples
        </p>
        <button
          type="button"
          onClick={resetFilters}
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
          onSelect={onSelectResidual}
        />
      )}

      {residualData && (
        <p className="text-xs text-slate-500">
          Showing {topResiduals.length} of {residualData.count} test samples.
          Click a row to view residual details.
        </p>
      )}
    </section>
  );
}
