import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import type {
  EvaluationResult,
  ModelComparisonPoint,
} from "../../types/dashboard";

type MetricKey = "mae" | "rmse" | "r2";

type ModelComparisonProps = {
  evaluation: EvaluationResult | null;
  modelComparisonData: ModelComparisonPoint[];
};

type MetricBarChartProps = {
  title: string;
  metric: MetricKey;
  data: ModelComparisonPoint[];
  yAxisDomain?: [number, number];
  showYAxisStroke?: boolean;
};

const tooltipStyle = {
  backgroundColor: "#0f172a",
  border: "1px solid #334155",
  borderRadius: "12px",
};

function getModelColor(model: string) {
  if (model === "Random Forest (Tuned)") return "#22d3ee";
  if (model === "Random Forest (Standard)") return "#64748b";

  return "#475569";
}

function MetricBarChart({
  title,
  metric,
  data,
  yAxisDomain,
  showYAxisStroke = false,
}: MetricBarChartProps) {
  return (
    <div>
      <h4 className="mb-3 font-medium">{title}</h4>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ bottom: 45 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

            <XAxis
              dataKey="model"
              angle={-20}
              textAnchor="end"
              interval={0}
              height={65}
              stroke="#94a3b8"
              tick={{ fontSize: 11 }}
            />

            <YAxis
              domain={yAxisDomain}
              stroke={showYAxisStroke ? "#94a3b8" : undefined}
            />

            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value) => [
                Number(value).toFixed(6),
                metric.toUpperCase(),
              ]}
            />

            <Bar dataKey={metric} name={metric.toUpperCase()}>
              {data.map((entry) => (
                <Cell
                  key={entry.model}
                  fill={getModelColor(entry.model)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ModelComparison({
  evaluation,
  modelComparisonData,
}: ModelComparisonProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div>
        <p className="text-sm text-cyan-400">MODEL COMPARISON / 03</p>

        <h3 className="mt-1 text-xl font-semibold">
          Validation Performance
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          Comparison of the performance of four machine learning models using validation metrics.
        </p>
      </div>

      {evaluation ? (
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <MetricBarChart
            title="MAE Comparison"
            metric="mae"
            data={modelComparisonData}
          />

          <MetricBarChart
            title="RMSE Comparison"
            metric="rmse"
            data={modelComparisonData}
            showYAxisStroke
          />

          <div className="lg:col-span-2">
            <MetricBarChart
              title="R2 Comparison"
              metric="r2"
              data={modelComparisonData}
              yAxisDomain={[0, 1]}
              showYAxisStroke
            />
          </div>
        </div>
      ) : (
        <p className="mt-6 rounded-xl border border-slate-700 p-6 text-center text-sm text-slate-500">
          Muat evaluasi terlebih dahulu untuk melihat perbandingan model.
        </p>
      )}
    </section>
  );
}
