import type { EvaluationResult } from "../../types/dashboard";
import { MetricCard } from "../common/MetricCard";

type EvaluationSummaryProps = {
  evaluation: EvaluationResult | null;
  evaluationLoading: boolean;
  evaluationError: string | null;
  loadEvaluation: () => void;
};

export function EvaluationSummary({
  evaluation,
  evaluationLoading,
  evaluationError,
  loadEvaluation,
}: EvaluationSummaryProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-cyan-400">Model Evaluation/ 02</p>
          <h3 className="mt-1 text-xl font-semibold">
            Tuned Random Forest Performance
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Evaluation on a test set that was not used for training.
          </p>
        </div>

        <button
          onClick={() => void loadEvaluation()}
          disabled={evaluationLoading}
          className="rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-50"
        >
          {evaluationLoading ? "loading..." : "Load Evaluation"}
        </button>
      </div>

      {evaluationError && (
        <p role="alert" className="mt-4 text-sm text-red-400">
          {evaluationError}
        </p>
      )}

      {evaluation && (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Test MAE"
              value={evaluation.final_test_results.mae.toFixed(6)}
              detail="Mean Absolute Error"
            />
            <MetricCard
              label="Test RMSE"
              value={evaluation.final_test_results.rmse.toFixed(6)}
              detail="Root Mean Squared Error"
            />
            <MetricCard
              label="Test R2"
              value={evaluation.final_test_results.r2.toFixed(6)}
              detail="Coefficient of determination"
            />
            <MetricCard
              label="Test Samples"
              value={String(evaluation.test_rows)}
              detail={`${evaluation.dataset_rows} total samples`}
            />
          </div>

          <div className="mt-5 rounded-xl border border-slate-700bg-slate-950 p-4">
            <p className="text-sm font-semibold text-slate-200">
              Evaluation note
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {evaluation.interpretation}
            </p>
          </div>
        </>
      )}

      {!evaluation && !evaluationLoading && !evaluationError && (
        <div className="mt-6 rounded-xl border border-dashed border-slate-700 p-6 text-center text-sm text-slate-500">
          Click &quot;Load Evaluation&quot; to retrieve model metrics from FastAPI
        </div>
      )}
    </section>
  );
}
