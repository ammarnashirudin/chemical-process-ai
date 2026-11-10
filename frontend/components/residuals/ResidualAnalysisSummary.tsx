import { MetricCard } from "../common/MetricCard";
import { ResidualPredictionFractions } from "./ResidualPredictionFractions";

import type { EvaluationResult } from "../../types/dashboard";

type ResidualAnalysisSummaryProps = {
  evaluation: EvaluationResult | null;
};

export function ResidualAnalysisSummary({
  evaluation,
}: ResidualAnalysisSummaryProps) {
  return (
    <section className="space-y-5 rounded-2xl border border-slate-700 bg-slate-800/60 p-6">
      <div>
        <h2 className="text-xl font-bold text-white">
          Residual Analysis
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Analysis of prediction errors on the test dataset
        </p>
      </div>

      {evaluation ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              label="Mean Residual"
              value={evaluation.residual_metrics.mean_residual.toFixed(6)}
              detail="Mean signed residual"
            />

            <MetricCard
              label="Mean Absolute Residual"
              value={evaluation.residual_metrics.mean_absolute_residual.toFixed(6)}
              detail="Average magnitude of error"
            />

            <MetricCard
              label="Residual Standard Deviation"
              value={evaluation.residual_metrics.residual_std.toFixed(6)}
              detail="Residual distribution"
            />
          </div>

          <ResidualPredictionFractions
            fractionOverpredicted={
              evaluation.residual_metrics.fraction_overpredicted
            }
            fractionUnderpredicted={
              evaluation.residual_metrics.fraction_underpredicted
            }
          />

          <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
            <p className="font-semibold text-white">
              Interpretation
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              The residual is defined as the Z-value from the PR-EOS minus the Z-value
              predicted by machine learning. A mean residual close to zero indicates that
              the signed residuals are, on average, relatively small. The mean absolute
              residual represents the magnitude of the error regardless of direction,
              while the residual standard deviation describes its dispersion.
            </p>
          </div>
        </>
      ) : (
        <p className="text-sm text-slate-400">
          Click the Load Evaluation button to display the residual analysis
        </p>
      )}
    </section>
  );
}
