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
    setCurveLoading(true);
    setCurveError("");

    try {
      const data = await fetchPressureCurve({
        temperature_K: Number(temperature),
        pressure_min_Pa: 100000,
        pressure_max_Pa: 8000000,
        points: 50,
      });

      setCurve(data);
      setApiOnline(true);
    } catch (err) {
      setCurveError(
        err instanceof Error
          ? err.message
          : "Gagal memuat kurva tekanan."
      );
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
