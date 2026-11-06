import type { ResidualPoint } from "../../types/dashboard";

type TopResidualsTableProps = {
  residuals: ResidualPoint[];
  selectedResidual: ResidualPoint | null;
  onSelect: (point: ResidualPoint) => void;
};

export function TopResidualsTable({
  residuals,
  selectedResidual,
  onSelect,
}: TopResidualsTableProps) {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-190 border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400">
              <th className="px-3 py-3">Rank</th>
              <th className="px-3 py-3">Temperature</th>
              <th className="px-3 py-3">Pressure (MPa)</th>
              <th className="px-3 py-3">Actual Z</th>
              <th className="px-3 py-3">Predicted Z</th>
              <th className="px-3 py-3">Residual</th>
              <th className="px-3 py-3">Prediction Error Type</th>
              <th className="px-3 py-3">Absolute Error</th>
            </tr>
          </thead>

          <tbody>
            {residuals.map((point, index) => (
              <tr
                key={`${point.temperature_K}-${point.pressure_Pa}`}
                onClick={() => onSelect(point)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(point);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`View residual details for ${point.temperature_K} K and ${(point.pressure_Pa / 1_000_000).toFixed(3)} MPa`}
                className={`cursor-pointer border-b border-slate-700/70 text-slate-200 transition hover:bg-slate-700/50 focus:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-400 ${
                  selectedResidual?.temperature_K === point.temperature_K &&
                  selectedResidual?.pressure_Pa === point.pressure_Pa
                    ? "bg-slate-700/70"
                    : ""
                }`}
                title="Click to view residual details"
              >
                <td className="px-3 py-3 font-semibold text-cyan-400">
                  {index + 1}
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
                  className={`px-3 py-3 ${
                    point.residual < 0 ? "text-rose-400" : "text-cyan-400"
                  }`}
                >
                  {point.residual.toFixed(6)}
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
                  {point.residual < 0
                    ? "Overprediction"
                    : point.residual > 0
                      ? "Underprediction"
                      : "Exact Prediction"}
                </td>
                <td className="px-3 py-3 font-semibold">
                  {point.absolute_error.toFixed(6)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
