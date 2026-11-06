"use client";

import type { ComparisonResult } from "../../types/dashboard";
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

type ModelReferenceChartProps = {
  comparison: ComparisonResult | null;
};

export function ModelReferenceChart({
  comparison,
}: ModelReferenceChartProps) {
  const chartData = comparison
    ? [
        { name: "PR-EOS", z: comparison.pr_eos_Z },
        { name: "Machine Learning", z: comparison.predicted_Z },
      ]
    : [];

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">
            Model vs Thermodynamic Reference
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Comparison at the selected operating condition.
          </p>
        </div>
        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">
          Dimensionless Z
        </span>
      </div>

      {comparison ? (
        <div className="mt-6 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis
                domain={["auto", "auto"]}
                stroke="#94a3b8"
                tickFormatter={(value: number) => value.toFixed(4)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                }}
                formatter={(value) => [
                  Number(value).toFixed(6),
                  "Z-factor",
                ]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="z"
                name="Z-factor"
                stroke="#22d3ee"
                strokeWidth={3}
                dot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="mt-6 flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-700 text-sm text-slate-500">
          Grafik akan tampil setelah prediksi pertama.
        </div>
      )}
    </section>
  );
}
