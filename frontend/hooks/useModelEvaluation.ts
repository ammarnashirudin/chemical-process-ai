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
    setEvaluationError("");
    setEvaluation(null);
    setEvaluationLoading(true);

    try {
      const data = await fetchEvaluation();

      setEvaluation(data);
      setApiOnline(true);
    } catch (err) {
      if (err instanceof TypeError) {
        setApiOnline(false);
        setEvaluationError(
          "Tidak dapat terhubung ke API. Pastikan FastAPI berjalan di port 8000."
        );
      } else {
        setEvaluationError(
          err instanceof Error
            ? err.message
            : "Gagal memuat evaluasi model."
        );
      }
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
