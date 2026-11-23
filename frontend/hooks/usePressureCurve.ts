import { useState } from "react";
import { fetchPressureCurve } from "../lib/api";
import type { PressureCurveResult } from "../types/dashboard";

export function usePressureCurve(
  temperature: string,
  setApiOnline: (online: boolean) => void
) {
  const [curve, setCurve] = useState<PressureCurveResult | null>(null);
  const [curveLoading, setCurveLoading] = useState(false);
  const [curveError, setCurveError] = useState("");

  async function loadPressureCurve() {
    setCurveError("");
    setCurve(null);

    const temperatureValue = Number(temperature);

    if (
      !Number.isFinite(temperatureValue) ||
      temperatureValue <= 0
    ) {
      setCurveError("Temperatur harus berupa angka positif yang valid.");
      return;
    }

    setCurveLoading(true);

    try {
      const data = await fetchPressureCurve({
        temperature_K: temperatureValue,
        pressure_min_Pa: 100000,
        pressure_max_Pa: 8000000,
        points: 50,
      });

      setCurve(data);
      setApiOnline(true);
    } catch (err) {
      if (err instanceof TypeError) {
        setApiOnline(false);
        setCurveError(
          "Tidak dapat terhubung ke API. Pastikan FastAPI berjalan di port 8000."
        );
      } else {
        setApiOnline(true);
        setCurveError(
          err instanceof Error
            ? err.message
            : "Gagal memuat kurva tekanan."
        );
      }
    } finally {
      setCurveLoading(false);
    }
  }

  return {
    curve,
    curveLoading,
    curveError,
    loadPressureCurve,
  };
}
