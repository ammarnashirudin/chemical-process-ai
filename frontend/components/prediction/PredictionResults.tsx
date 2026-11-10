import { ResultCard } from "../common/ResultCard";

import type {
  PredictionResult,
  ComparisonResult,
} from "../../types/dashboard";

type PredictionResultsProps = {
  result: PredictionResult | null;
  comparison: ComparisonResult | null;
};

export function PredictionResults({
  result,
  comparison,
}: PredictionResultsProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="text-lg font-semibold">Prediction Results</h3>
      <p className="mt-1 text-sm text-slate-400">
        Results returned by the FastAPI backend.
      </p>

      {result && comparison ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-cyan-900 bg-cyan-950/40 p-5">
            <p className="text-sm text-cyan-300">
              Predicted compressibility factor (Z)
            </p>
            <p className="mt-2 text-4xl font-bold tabular-nums">
              {result.predicted_Z.toFixed(6)}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Model: {result.model}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultCard
              label="PR-EOS Z"
              value={comparison.pr_eos_Z.toFixed(6)}
            />
            <ResultCard
              label="Absolute Difference"
              value={comparison.absolute_error.toFixed(6)}
            />
          </div>

          <div
            className={`rounded-xl border p-4 text-sm ${
              result.within_training_range
                ? "border-emerald-900 bg-emerald-950/30 text-emerald-300"
                : "border-amber-800 bg-amber-950/30 text-amber-300"
            }`}
          >
            {result.within_training_range
              ? "Input berada dalam rentang pelatihan model."
              : "Perhatian: input berada di luar rentang pelatihan model."}
            {result.warning && (
              <p className="mt-2">{result.warning}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-6 flex min-h-64 items-center justify-center rounded-xl border border-dashed border-slate-700 p-6 text-center text-sm text-slate-500">
          Masukkan temperatur dan tekanan, lalu klik Run Prediction
          untuk melihat hasil.
        </div>
      )}
    </div>
  );
}
