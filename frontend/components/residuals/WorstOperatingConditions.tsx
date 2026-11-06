type WorstOperatingCondition = {
  rank: number;
  temperatureRange: string;
  pressureRange: string;
  count: number;
  meanResidual: number | null;
  mae: number | null;
  rmse: number | null;
  errorDirection: string;
};

type WorstOperatingConditionsProps = {
  conditions: WorstOperatingCondition[];
};

export function WorstOperatingConditions({
  conditions,
}: WorstOperatingConditionsProps) {
  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 space-y-5">
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
        <h3 className="text-lg font-semibold text-white">
          Top 5 Worst Operating Conditions
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          Operating conditions ranked by highest RMSE
        </p>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-700 text-slate-400">
              <tr>
                <th className="px-3 py-3">Rank</th>
                <th className="px-3 py-3">Temperature</th>
                <th className="px-3 py-3">Pressure</th>
                <th className="px-3 py-3">Samples</th>
                <th className="px-3 py-3">Mean Residual</th>
                <th className="px-3 py-3">MAE</th>
                <th className="px-3 py-3">RMSE</th>
                <th className="px-3 py-3">Error Direction</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800 text-slate-200">
              {conditions.map((item) => (
                <tr key={`${item.temperatureRange}-${item.pressureRange}`}>
                  <td className="px-3 py-3 font-semibold">
                    #{item.rank}
                  </td>

                  <td className="px-3 py-3">{item.temperatureRange}</td>
                  <td className="px-3 py-3">{item.pressureRange}</td>
                  <td className="px-3 py-3">{item.count}</td>

                  <td className="px-3 py-3">
                    {item.meanResidual?.toFixed(6) ?? "N/A"}
                  </td>

                  <td className="px-3 py-3">
                    {item.mae?.toFixed(6) ?? "N/A"}
                  </td>

                  <td className="px-3 py-3 font-semibold text-rose-400">
                    {item.rmse?.toFixed(6) ?? "N/A"}
                  </td>

                  <td
                    className={`px-3 py-3 font-medium ${
                      item.errorDirection === "Overprediction"
                        ? "text-rose-400"
                        : item.errorDirection === "Underprediction"
                          ? "text-cyan-400"
                          : "text-slate-400"
                    }`}
                  >
                    {item.errorDirection}
                  </td>
                </tr>
              ))}

              {conditions.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-3 py-6 text-center text-slate-400"
                  >
                    No operating conditions meet the minimumsample requirement.
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
