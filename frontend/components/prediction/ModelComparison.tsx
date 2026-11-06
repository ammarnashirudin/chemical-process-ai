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

type ModelComparisonProps = {
  evaluation: EvaluationResult | null;
  modelComparisonData: ModelComparisonPoint[];
};

export function ModelComparison({
  evaluation,
  modelComparisonData,
}: ModelComparisonProps) {
  const getModelColor = (model: string) =>
    model === "Random Forest (Tuned)"
      ? "#22d3ee"
      : model === "Random Forest (Standard)"
        ? "#64748b"
        : "#475569";

  const tooltipStyle = {
    backgroundColor: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "12px",
  };

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
          <div>
            <h4 className="mb-3 font-medium">MAE Comparison</h4>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={modelComparisonData} margin={{ bottom: 45 }}>
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
                  <YAxis />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => [
                      Number(value).toFixed(6),
                      "MAE",
                    ]}
                  />
                  <Bar dataKey="mae" name="MAE">
                    {modelComparisonData.map((entry) => (
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

          <div>
            <h4 className="mb-3 font-medium">RMSE Comparison</h4>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={modelComparisonData} margin={{ bottom: 45 }}>
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
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => [
                      Number(value).toFixed(6),
                      "RMSE",
                    ]}
                  />
                  <Bar dataKey="rmse" name="RMSE">
                    {modelComparisonData.map((entry) => (
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

          <div className="lg:col-span-2">
            <h4 className="mb-3 font-medium">R2 Comparison</h4>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={modelComparisonData} margin={{ bottom: 45 }}>
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
                  <YAxis domain={[0, 1]} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => [
                      Number(value).toFixed(6),
                      "R2",
                    ]}
                  />
                  <Bar dataKey="r2" name="R2">
                    {modelComparisonData.map((entry) => (
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
        </div>
      ) : (
        <p className="mt-6 rounded-xl border border-slate-700 p-6 text-center text-sm text-slate-500">
          Muat evaluasi terlebih dahulu untuk melihat perbandingan model.
        </p>
      )}
    </section>
  );
}
