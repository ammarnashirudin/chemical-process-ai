import { ResultCard } from "../common/ResultCard";
import type {
  PredictionResult,
  ComparisonResult,
} from "../../types/dashboard";

type PredictionPanelProps = {
  temperature: string;
  setTemperature: (value: string) => void;
  pressure: string;
  setPressure: (value: string) => void;
  loading: boolean;
  error: string;
  predict: () => Promise<void>;
  result: PredictionResult | null;
  comparison: ComparisonResult | null;
};

export function PredictionPanel({
  temperature,
  setTemperature,
  pressure,
  setPressure,
  loading,
  error,
  predict,
  result,
  comparison,
}: PredictionPanelProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="text-lg font-semibold">Prediction Parameters</h3>
        <p className="mt-1 text-sm text-slate-400">
          Enter operating conditions for methane.
        </p>

        <form
          className="mt-6 space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            void predict();
          }}
        >
          <div>
            <label
              htmlFor="temperature"
              className="mb-2 block text-sm text-slate-300"
            >
              Temperature (K)
            </label>
            <input
              id="temperature"
              type="number"
              min="1"
              step="any"
              required
              value={temperature}
              onChange={(event) => setTemperature(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label
              htmlFor="pressure"
              className="mb-2 block text-sm text-slate-300"
            >
              Pressure (Pa)
            </label>
            <input
              id="pressure"
              type="number"
              min="1"
              step="any"
              required
              value={pressure}
              onChange={(event) => setPressure(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
            />
            <p className="mt-2 text-xs text-slate-500">
              Example: 1000000 Pa = 1 MPa
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Calculating..." : "Run Prediction"}
          </button>
        </form>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-red-900 bg-red-950/50 p-3 text-sm text-red-300"
          >
            {error}
          </p>
        )}
      </div>

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
    </section>
  );
}
