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
    setError("");
    setResult(null);
    setComparison(null);

    const temperatureValue = Number(temperature);
    const pressureValue = Number(pressure);

    if (
      !Number.isFinite(temperatureValue) ||
      !Number.isFinite(pressureValue) ||
      temperatureValue <= 0 ||
      pressureValue <= 0
    ) {
      setError("Temperatur dan tekanan harus berupa angka positif yang valid.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        temperature_K: temperatureValue,
        pressure_Pa: pressureValue,
      };

      const [predictionData, comparisonData] = await Promise.all([
        fetchPrediction(payload),
        fetchComparison(payload),
      ]);

      setResult(predictionData);
      setComparison(comparisonData);
      setApiOnline(true);
    } catch (err) {
      if (err instanceof TypeError) {
        setApiOnline(false);
        setError(
          "Tidak dapat terhubung ke API. Pastikan FastAPI berjalan di port 8000."
        );
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat memproses prediksi."
        );
      }
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
