import {
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

import type {
  QQPoint,
  ResidualHistogramPoint,
} from "../../types/dashboard";

type ResidualDistributionProps = {
  residualInterpretation: string;
  residualHistogram: ResidualHistogramPoint[];
  qqPlot: QQPoint[];
};

export function ResidualDistribution({
  residualInterpretation,
  residualHistogram,
  qqPlot,
}: ResidualDistributionProps) {
  return (
    <>
      <div className="mt-4 rounded-xl border border-gray-700 bg-gray-900 p-5">
        <h3 className="text-lg font-semibold text-white">
          Residual Interpretation
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-gray-300">
          {residualInterpretation}
        </p>
        <p className="mt-3 text-xs text-gray-500">
          Interpretation is based on the mean residual of the
          currently filtered dataset.
        </p>
      </div>

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
    </>
  );
}
