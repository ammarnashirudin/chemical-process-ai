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
    setResidualError("");
    setResidualData(null);
    setResidualLoading(true);

    try {
      const data = await fetchResiduals();

      setResidualData(data);
      setApiOnline(true);
    } catch (err) {
      if (err instanceof TypeError) {
        setApiOnline(false);
        setResidualError(
          "Tidak dapat terhubung ke API. Pastikan FastAPI berjalan di port 8000."
        );
      } else {
        setResidualError(
          err instanceof Error
            ? err.message
            : "Gagal memuat data residual."
        );
      }
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
