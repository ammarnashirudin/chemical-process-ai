type PredictionParametersProps = {
  temperature: string;
  setTemperature: (value: string) => void;
  pressure: string;
  setPressure: (value: string) => void;
  loading: boolean;
  error: string;
  predict: () => Promise<void>;
};

export function PredictionParameters({
  temperature,
  setTemperature,
  pressure,
  setPressure,
  loading,
  error,
  predict,
}: PredictionParametersProps) {
  return (
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
  );
}
