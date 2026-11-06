"use client";

import type { PressureCurveResult } from "../../types/dashboard";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type PressureCurveChartProps = {
  curve: PressureCurveResult | null;
  curveLoading: boolean;
  curveError: string;
  loadPressureCurve: () => Promise<void>;
};

export function PressureCurveChart({
  curve,
  curveLoading,
  curveError,
  loadPressureCurve,
}: PressureCurveChartProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">
            Pressure vs Compressibility factor
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Random forest prediction Tuned compared with peng-robinson EOS.
          </p>
        </div>

        <button
          onClick={() => void loadPressureCurve()}
          disabled={curveLoading}
          className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-50"
        >
          {curveLoading ? "Loading curve..." : "Generate pressure curve"}
        </button>
      </div>

      {curveError && (
        <p role="alert" className="mt-4 text-sm text-red-400">
          {curveError}
        </p>
      )}

      {curve && (
        <>
          <p className="mt-4 text-sm text-slate-400">
            Temperature: {curve.temperature_K} K.
            {" "}{curve.points.length} pressure points
          </p>

          <div className="mt-5 h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={curve.points}
                margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="pressure_MPa"
                  type="number"
                  domain={["dataMin", "dataMax"]}
                  stroke="#94a3b8"
                  tickFormatter={(value: number) => value.toFixed(1)}
                  label={{
                    value: "Pressure (MPa)",
                    position: "insideBottom",
                    offset: -5,
                    fill: "#94a3b8",
                  }}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  stroke="#94a3b8"
                  tickFormatter={(value: number) => value.toFixed(3)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                  }}
                  labelFormatter={(value) =>
                    `Pressure: ${Number(value).toFixed(3)} MPa`
                  }
                  formatter={(value, name) => [
                    Number(value).toFixed(6),
                    name === "ml_Z" ? "Random Forest Tuned" : "PR-EOS",
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ml_Z"
                  name="Random Forest Tuned"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="pr_eos_Z"
                  name="PR-EOS"
                  stroke="#a78bfa"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {!curve && !curveLoading && !curveError && (
        <p className="mt-8 text-center text-sm text-slate-500">
          Click generate pressure curve to load data from FastAPI
        </p>
      )}
    </section>
  );
}
