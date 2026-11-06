import { useState } from "react";
import { fetchEvaluation } from "../lib/api";
import type { EvaluationResult } from "../types/dashboard";

export function useModelEvaluation(
  setApiOnline: (online: boolean) => void
) {
  const [evaluation, setEvaluation] =
    useState<EvaluationResult | null>(null);
  const [evaluationLoading, setEvaluationLoading] = useState(false);
  const [evaluationError, setEvaluationError] = useState("");

  async function loadEvaluation() {
    setEvaluationLoading(true);
    setEvaluationError("");

    try {
      const data = await fetchEvaluation();
      setEvaluation(data);
      setApiOnline(true);
    } catch (err) {
      setEvaluationError(
        err instanceof Error
          ? err.message
          : "Gagal memuat evaluasi model."
      );
    } finally {
      setEvaluationLoading(false);
    }
  }

  return {
    evaluation,
    evaluationLoading,
    evaluationError,
    loadEvaluation,
  };
}
