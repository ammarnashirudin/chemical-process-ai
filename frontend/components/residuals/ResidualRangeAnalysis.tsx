import type {
  TemperatureAnalysisRow,
  PressureAnalysisRow,
} from "../../types/dashboard";

type ResidualRangeAnalysisProps = {
  temperatureAnalysis: TemperatureAnalysisRow[];
  pressureAnalysis: PressureAnalysisRow[];
};

function formatMetric(value: number | null): string {
  return value !== null ? value.toFixed(6) : "N/A";
}

export function ResidualRangeAnalysis({
  temperatureAnalysis,
  pressureAnalysis,
}: ResidualRangeAnalysisProps) {
  return (
    <>
      <section className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 space-y-5">
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
          <h3 className="text-lg font-semibold text-white">
            Residual Analysis by Temperature
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Quantitative evaluation of prediction errors across temperature ranges
          </p>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-700 text-slate-400">
                <tr>
                  <th className="px-3 py-3">Temperature Range</th>
                  <th className="px-3 py-3">Samples</th>
                  <th className="px-3 py-3">Mean Residual</th>
                  <th className="px-3 py-3">MAE</th>
                  <th className="px-3 py-3">RMSE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {temperatureAnalysis.map((row) => (
                  <tr key={row.temperatureRange}>
                    <td className="px-3 py-3">{row.temperatureRange}</td>
                    <td className="px-3 py-3">{row.count}</td>
                    <td className="px-3 py-3">
                      {formatMetric(row.meanResidual)}
                    </td>
                    <td className="px-3 py-3">{formatMetric(row.mae)}</td>
                    <td className="px-3 py-3">{formatMetric(row.rmse)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 space-y-5">
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
          <h3 className="text-lg font-semibold text-white">
            Residual Analysis by Pressure
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Quantitative evaluation of prediction errors across pressure ranges
          </p>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-700 text-slate-400">
                <tr>
                  <th className="px-3 py-3">Pressure Range</th>
                  <th className="px-3 py-3">Samples</th>
                  <th className="px-3 py-3">Mean Residual</th>
                  <th className="px-3 py-3">MAE</th>
                  <th className="px-3 py-3">RMSE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {pressureAnalysis.map((row) => (
                  <tr key={row.pressureRange}>
                    <td className="px-3 py-3">{row.pressureRange}</td>
                    <td className="px-3 py-3">{row.count}</td>
                    <td className="px-3 py-3">
                      {formatMetric(row.meanResidual)}
                    </td>
                    <td className="px-3 py-3">{formatMetric(row.mae)}</td>
                    <td className="px-3 py-3">{formatMetric(row.rmse)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
