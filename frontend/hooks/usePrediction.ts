import { useState } from "react";
import {
  fetchPrediction,
  fetchComparison,
} from "../lib/api";
import type {
  PredictionResult,
  ComparisonResult,
} from "../types/dashboard";

export function usePrediction(setApiOnline: (online: boolean) => void) {
  const [temperature, setTemperature] = useState("300");
  const [pressure, setPressure] = useState("1000000");
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function predict() {
    setLoading(true);
    setError("");
    setResult(null);
    setComparison(null);

    try {
      const payload = {
        temperature_K: Number(temperature),
        pressure_Pa: Number(pressure),
      };

      const [predictionData, comparisonData] = await Promise.all([
        fetchPrediction(payload),
        fetchComparison(payload),
      ]);

      setResult(predictionData);
      setComparison(comparisonData);
      setApiOnline(true);
    } catch (err) {
      setApiOnline(false);
      setError(
        err instanceof Error
          ? `${err.message}. Pastikan FastAPI berjalan di port 8000.`
          : "Terjadi kesalahan saat menghubungi API."
      );
    } finally {
      setLoading(false);
    }
  }

  return {
    temperature,
    setTemperature,
    pressure,
    setPressure,
    result,
    comparison,
    loading,
    error,
    predict,
  };
}
