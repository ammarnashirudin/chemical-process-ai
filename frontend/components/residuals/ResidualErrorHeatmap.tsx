type RangeDefinition = {
  label: string;
  min: number;
  max: number;
};

type HeatmapCell = {
  temperatureRange: string;
  pressureRange: string;
  count: number;
  meanResidual: number | null;
  mae: number | null;
  rmse: number | null;
};

type ResidualErrorHeatmapProps = {
  temperatureRanges: RangeDefinition[];
  pressureRanges: RangeDefinition[];
  temperaturePressureMatrix: HeatmapCell[];
  maxMatrixRmse: number;
};

export function ResidualErrorHeatmap({
  temperatureRanges,
  pressureRanges,
  temperaturePressureMatrix,
  maxMatrixRmse,
}: ResidualErrorHeatmapProps) {
  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 space-y-5">
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
        <h3 className="text-lg font-semibold text-white">
          Temperature-Pressure Error Heatmap
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          RMSE distribution across combined operating temperature and pressure ranges
        </p>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-separate border-spacing-1 text-center text-sm">
            <thead>
              <tr>
                <th className="px-3 py-3 text-left text-slate-400">
                  Temperature / Pressure
                </th>

                {pressureRanges.map((range) => (
                  <th
                    key={range.label}
                    className="px-3 py-3 text-slate-400"
                  >
                    {range.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {temperatureRanges.map((temperatureRange) => (
                <tr key={temperatureRange.label}>
                  <td className="px-3 py-4 text-left font-medium text-slate-200">
                    {temperatureRange.label}
                  </td>

                  {pressureRanges.map((pressureRange) => {
                    const cell = temperaturePressureMatrix.find(
                      (item) =>
                        item.temperatureRange === temperatureRange.label &&
                        item.pressureRange === pressureRange.label
                    );

                    const intensity =
                      cell?.rmse !== null && cell?.rmse !== undefined &&
                      maxMatrixRmse > 0
                        ? cell.rmse / maxMatrixRmse
                        : 0;

                    const backgroundColor =
                      intensity >= 0.7
                        ? `rgba(239, 68, 68, ${0.2 + intensity * 0.5})`
                        : intensity >= 0.4
                          ? `rgba(245, 158, 11, ${0.2 + intensity * 0.4})`
                          : `rgba(34, 211, 238, ${0.08 + intensity * 0.4})`;

                    return (
                      <td
                        key={pressureRange.label}
                        className="rounded-lg border border-slate-700 px-3 py-4"
                        style={{
                          backgroundColor:
                            cell?.rmse !== null &&
                            cell?.rmse !== undefined
                              ? backgroundColor
                              : "transparent",
                        }}
                      >
                        {cell && cell.rmse !== null ? (
                          <div className="space-y-1">
                            <p className="font-bold text-white">
                              {cell.rmse.toFixed(6)}
                            </p>

                            <p className="text-xs text-slate-300">
                              n = {cell.count}
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-500">
                            N/A
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Heatmap Legend */}
        <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-cyan-400/40" />
            <span>Lower RMSE</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-amber-400/60" />
            <span>Moderate RMSE</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-red-500/80" />
            <span>Higher RMSE</span>
          </div>
        </div>
      </div>
    </section>
  );
}
