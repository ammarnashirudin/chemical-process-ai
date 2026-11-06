import { useState } from "react";
import { fetchResiduals } from "../lib/api";
import type { ResidualResponse } from "../types/dashboard";

export function useResidualData(
  setApiOnline: (online: boolean) => void
) {
  const [residualData, setResidualData] =
    useState<ResidualResponse | null>(null);
  const [residualLoading, setResidualLoading] = useState(false);
  const [residualError, setResidualError] = useState("");

  async function loadResiduals() {
    setResidualLoading(true);
    setResidualError("");

    try {
      const data = await fetchResiduals();
      setResidualData(data);
      setApiOnline(true);
    } catch (err) {
      setResidualError(
        err instanceof Error
          ? err.message
          : "Gagal memuat data residual."
      );
    } finally {
      setResidualLoading(false);
    }
  }

  return {
    residualData,
    residualLoading,
    residualError,
    loadResiduals,
  };
}
