import { MetricCard } from "../common/MetricCard";
import type { ResidualPoint } from "../../types/dashboard";

type SelectedResidualDetailsProps = {
  selectedResidual: ResidualPoint | null;
  onClear: () => void;
};

export function SelectedResidualDetails({
  selectedResidual,
  onClear,
}: SelectedResidualDetailsProps) {
  if (!selectedResidual) {
    return null;
  }

  return (
    <div className="rounded-xl border border-cyan-500/30 bg-slate-900 p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">
          Selected Residual Details
        </h3>

        <button
          onClick={onClear}
          className="rounded-lg border border-slate-600 px-3 py-1 text-sm text-slate-300 hover:bg-slate-800"
        >
          Clear
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          label="Temperature"
          value={`${selectedResidual.temperature_K.toFixed(2)}K`}
          detail="Operating temperature"
        />

        <MetricCard
          label="Pressure"
          value={`${(selectedResidual.pressure_Pa / 1_000_000).toFixed(3)}MPa`}
          detail="Operating pressure"
        />

        <MetricCard
          label="Actual Z"
          value={selectedResidual.z_actual.toFixed(6)}
          detail="PR-EOS reference"
        />

        <MetricCard
          label="Predicted Z"
          value={selectedResidual.z_predicted.toFixed(6)}
          detail="Random Forest Tuned"
        />

        <MetricCard
          label="Residual"
          value={selectedResidual.residual.toFixed(6)}
          detail="Actual Z - Predicted Z"
        />

        <MetricCard
          label="Absolute Error"
          value={selectedResidual.absolute_error.toFixed(6)}
          detail="Error magnitude"
        />

        <MetricCard
          label="Prediction Error Type"
          value={
            selectedResidual.residual < 0
              ? "Overprediction"
              : selectedResidual.residual > 0
                ? "Underprediction"
                : "Exact Prediction"
          }
          detail="Based on residual sign"
        />
      </div>
    </div>
  );
}
