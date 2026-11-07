import {
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

import type { ResidualPoint } from "../../types/dashboard";

type ResidualScatterChartProps = {
  title: string;
  description: string;
  xDataKey: "z_predicted" | "temperature_K" | "pressure_Pa";
  xName: string;
  xLabel: string;
  data: ResidualPoint[];
  onPointClick?: (point: ResidualPoint) => void;
  fill?: string;
  pointName?: string;
  pointSize?: number;
};

export function ResidualScatterChart({
  title,
  description,
  xDataKey,
  xName,
  xLabel,
  data,
  onPointClick,
  fill = "#22d3ee",
  pointName = "Test residuals",
  pointSize = 45,
}: ResidualScatterChartProps) {
  const isPressure = xDataKey === "pressure_Pa";

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
      <h3 className="text-lg font-semibold text-white">{title}</h3>

      <p className="mt-1 text-sm text-slate-400">{description}</p>

      <div className="mt-5 h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

            <XAxis
              type="number"
              dataKey={xDataKey}
              name={xName}
              domain={["auto", "auto"]}
              stroke="#94a3b8"
              tickFormatter={
                isPressure
                  ? (value) => (Number(value) / 1_000_000).toFixed(1)
                  : undefined
              }
              label={{
                value: xLabel,
                position: "insideBottom",
                offset: -10,
                fill: "#94a3b8",
              }}
            />

            <YAxis
              type="number"
              dataKey="residual"
              name="Residual"
              domain={["auto", "auto"]}
              stroke="#94a3b8"
              label={{
                value: "Residual",
                angle: -90,
                position: "insideLeft",
                fill: "#94a3b8",
              }}
            />

            <ZAxis range={[pointSize, pointSize]} />

            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              formatter={(value, name) => [
                isPressure && name === "Pressure"
                  ? `${(Number(value) / 1_000_000).toFixed(3)} MPa`
                  : Number(value).toFixed(6),
                String(name),
              ]}
              labelFormatter={
                xDataKey === "z_predicted"
                  ? () => "Test sample"
                  : undefined
              }
            />

            <ReferenceLine
              y={0}
              stroke="#f87171"
              strokeDasharray="5 5"
            />

            <Scatter
              name={pointName}
              data={data}
              fill={fill}
              fillOpacity={0.85}
              cursor={onPointClick ? "pointer" : undefined}
              onClick={
                onPointClick
                  ? (point) => {
                      const payload = point?.payload as
                        | ResidualPoint
                        | undefined;

                      if (payload) {
                        onPointClick(payload);
                      }
                    }
                  : undefined
              }
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
