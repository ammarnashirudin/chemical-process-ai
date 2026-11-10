import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

import type { QQPoint } from "../../types/dashboard";

type ResidualQQPlotProps = {
  qqPlot: QQPoint[];
};

export function ResidualQQPlot({
  qqPlot,
}: ResidualQQPlotProps) {
  return (
    <div className="mt-6 rounded-xl border border-gray-700 bg-gray-900 p-5">
      <h3 className="text-lg font-semibold text-white">
        Normal Q-Q Plot
      </h3>

      <p className="mt-1 text-sm text-gray-400">
        Comparison between theoretical normal quantiles and sample residual quantiles.
      </p>

      <div className="mt-5 h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 25, bottom: 35, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />

            <XAxis
              type="number"
              dataKey="theoretical_quantile"
              name="Theoretical Quantile"
              tick={{ fill: "#9CA3AF", fontSize: 11 }}
              label={{
                value: "Theoretical Quantiles",
                position: "insideBottom",
                offset: -20,
                fill: "#9CA3AF",
              }}
            />

            <YAxis
              type="number"
              dataKey="sample_quantile"
              name="Sample Quantile"
              tick={{ fill: "#9CA3AF", fontSize: 11 }}
              label={{
                value: "Sample Quantiles",
                angle: -99,
                position: "insideLeft",
                fill: "#9CA3AF",
              }}
            />

            <Tooltip cursor={{ strokeDasharray: "3 3" }} />

            <ReferenceLine
              segment={[
                { x: -3, y: -3 },
                { x: 3, y: 3 },
              ]}
              stroke="#F87171"
              strokeWidth={2}
              strokeDasharray="6 4"
            />

            <Scatter
              name="Residual Quantiles"
              data={qqPlot}
              fill="#388DF8"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
