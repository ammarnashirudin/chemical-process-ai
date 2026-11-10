import { MetricCard } from "../common/MetricCard";
import { formatResidualDetails } from "./utils/residualFormatters";

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

  const details = formatResidualDetails(selectedResidual);

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
          value={details.temperature}
          detail="Operating temperature"
        />

        <MetricCard
          label="Pressure"
          value={details.pressure}
          detail="Operating pressure"
        />

        <MetricCard
          label="Actual Z"
          value={details.actualZ}
          detail="PR-EOS reference"
        />

        <MetricCard
          label="Predicted Z"
          value={details.predictedZ}
          detail="Random Forest Tuned"
        />

        <MetricCard
          label="Residual"
          value={details.residual}
          detail="Actual Z - Predicted Z"
        />

        <MetricCard
          label="Absolute Error"
          value={details.absoluteError}
          detail="Error magnitude"
        />

        <MetricCard
          label="Prediction Error Type"
          value={details.predictionErrorType}
          detail="Based on residual sign"
        />
      </div>
    </div>
  );
}
