import type {
  ResidualPoint,
  ResidualResponse,
} from "../../types/dashboard";
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

      <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-700 bg-slate-900/70 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="min-temperature" className="mb-2 block text-sm text-slate-400">
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
          <label htmlFor="max-temperature" className="mb-2 block text-sm text-slate-400">
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
          <label htmlFor="min-pressure" className="mb-2 block text-sm text-slate-400">
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
          <label htmlFor="max-pressure" className="mb-2 block text-sm text-slate-400">
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
