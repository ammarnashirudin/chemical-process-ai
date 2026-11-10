import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type { ResidualHistogramPoint } from "../../types/dashboard";

type ResidualHistogramProps = {
  residualHistogram: ResidualHistogramPoint[];
};

export function ResidualHistogram({
  residualHistogram,
}: ResidualHistogramProps) {
  return (
    <div className="mt-6 rounded-xl border border-gray-700 bg-gray-900 p-5">
      <h3 className="text-lg font-semibold text-white">
        Residual Distribution Histogram
      </h3>

      <p className="mt-1 text-sm text-gray-400">
        Distribution of residual values from the filtered dataset
      </p>

      <div className="mt-5 h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={residualHistogram}
            margin={{ top: 10, right: 20, left: 10, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />

            <XAxis
              dataKey="residualRange"
              angle={-45}
              textAnchor="end"
              interval={0}
              tick={{ fill: "#9CA3AF", fontSize: 10 }}
              label={{
                value: "Residual Range",
                position: "insideBottom",
                offset: -45,
                fill: "#9CA3AF",
              }}
            />

            <YAxis
              allowDecimals={false}
              tick={{ fill: "#9CA3AF" }}
              label={{
                value: "Frequency",
                angle: -90,
                position: "insideLeft",
                fill: "#9CA3AF",
              }}
            />

            <Tooltip />

            <Bar
              dataKey="frequency"
              name="Frequency"
              fill="#38BDF8"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
