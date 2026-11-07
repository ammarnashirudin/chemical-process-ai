import { MetricCard } from "../common/MetricCard";
import { EvaluationSummary } from "../prediction/EvaluationSummary";
import { ModelComparison } from "../prediction/ModelComparison";
import { ResidualAnalysisSummary } from "../residuals/ResidualAnalysisSummary";

import type {
  EvaluationResult,
  ModelComparisonPoint,
} from "../../types/dashboard";

type DashboardOverviewProps = {
  evaluation: EvaluationResult | null;
  evaluationLoading: boolean;
  evaluationError: string | null;
  loadEvaluation: () => void;
};

export function DashboardOverview({
  evaluation,
  evaluationLoading,
  evaluationError,
  loadEvaluation,
}: DashboardOverviewProps) {
  const modelComparisonData: ModelComparisonPoint[] = evaluation
    ? [
        {
          model: "Linear Regression",
          ...evaluation.validation_results.linear_regression,
        },
        {
          model: "Random Forest (Standard)",
          ...evaluation.validation_results.random_forest,
        },
        {
          model: "Random Forest (Tuned)",
          ...evaluation.validation_results.random_forest_tuned,
        },
        {
          model: "Gradient Boosting",
          ...evaluation.validation_results.gradient_boosting,
        },
      ]
    : [];

  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Fluid"
          value="Methane (CH₄)"
          detail="Pure component"
        />
        <MetricCard
          label="ML Model"
          value="Random Forest Tuned"
          detail="Supervised regression"
        />
        <MetricCard
          label="Reference"
          value="PR-EOS"
          detail="Peng–Robinson equation"
        />
        <MetricCard
          label="Target Property"
          value="Z-factor"
          detail="Dimensionless"
        />
      </section>

      <EvaluationSummary
        evaluation={evaluation}
        evaluationLoading={evaluationLoading}
        evaluationError={evaluationError}
        loadEvaluation={loadEvaluation}
      />

      <ModelComparison
        evaluation={evaluation}
        modelComparisonData={modelComparisonData}
      />

      <ResidualAnalysisSummary evaluation={evaluation} />
    </>
  );
}
