import type { ResidualPoint } from "../../types/dashboard";

type WorstIndividualPrediction = ResidualPoint & {
  temperatureRange: string;
  pressureRange: string;
};

type WorstIndividualPredictionsProps = {
  predictions: WorstIndividualPrediction[];
};

export function WorstIndividualPredictions({
  predictions,
}: WorstIndividualPredictionsProps) {
  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 space-y-5">
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
        <h3 className="text-lg font-semibold text-white">
          Top 10 Worst Individual Predictions
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          Individual samples with the highest absolute errors
          within the five worst operating conditions
        </p>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-700 text-slate-400">
              <tr>
                <th className="px-3 py-3">Rank</th>
                <th className="px-3 py-3">Temperature (K)</th>
                <th className="px-3 py-3">Pressure (MPa)</th>
                <th className="px-3 py-3">Actual Z</th>
                <th className="px-3 py-3">Predicted Z</th>
                <th className="px-3 py-3">Residual</th>
                <th className="px-3 py-3">Absolute Error</th>
                <th className="px-3 py-3">Operating Condition</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800 text-slate-200">
              {predictions.map((point, index) => (
                <tr
                  key={`${point.temperature_K}-${point.pressure_Pa}`}
                  className="hover:bg-slate-800/50"
                >
                  <td className="px-3 py-3 font-semibold">
                    #{index + 1}
                  </td>

                  <td className="px-3 py-3">
                    {point.temperature_K.toFixed(2)}
                  </td>

                  <td className="px-3 py-3">
                    {(point.pressure_Pa / 1_000_000).toFixed(3)}
                  </td>

                  <td className="px-3 py-3">
                    {point.z_actual.toFixed(6)}
                  </td>

                  <td className="px-3 py-3">
                    {point.z_predicted.toFixed(6)}
                  </td>

                  <td
                    className={`px-3 py-3 font-medium ${
                      point.residual < 0
                        ? "text-rose-400"
                        : point.residual > 0
                          ? "text-cyan-400"
                          : "text-slate-400"
                    }`}
                  >
                    {point.residual.toFixed(6)}
                  </td>

                  <td className="px-3 py-3 font-semibold text-rose-400">
                    {point.absolute_error.toFixed(6)}
                  </td>

                  <td className="px-3 py-3 text-slate-300">
                    {point.temperatureRange} / {point.pressureRange}
                  </td>
                </tr>
              ))}

              {predictions.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-3 py-6 text-center text-slate-400"
                  >
                    No individual predictions available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
