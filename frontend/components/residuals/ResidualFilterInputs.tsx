type ResidualFilterInputsProps = {
  minTemperature: string;
  maxTemperature: string;
  minPressure: string;
  maxPressure: string;
  setMinTemperature: (value: string) => void;
  setMaxTemperature: (value: string) => void;
  setMinPressure: (value: string) => void;
  setMaxPressure: (value: string) => void;
};

export function ResidualFilterInputs({
  minTemperature,
  maxTemperature,
  minPressure,
  maxPressure,
  setMinTemperature,
  setMaxTemperature,
  setMinPressure,
  setMaxPressure,
}: ResidualFilterInputsProps) {
  return (
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
  );
}
