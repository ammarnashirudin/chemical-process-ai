import type {
  PredictionResult,
  ComparisonResult,
  EvaluationResult,
  ResidualResponse,
  PressureCurveResult,
} from "../types/dashboard";

const API_URL = "http://127.0.0.1:8000";

export type PredictionPayload = {
  temperature_K: number;
  pressure_Pa: number;
};

export type PressureCurvePayload = {
  temperature_K: number;
  pressure_min_Pa: number;
  pressure_max_Pa: number;
  points: number;
};

export async function checkApiStatus(): Promise<boolean> {
  const response = await fetch(`${API_URL}/health`);

  if (!response.ok) {
    throw new Error("Backend tidak merespons");
  }

  const data = await response.json();

  return data.status === "healthy" && data.model_loaded;
}

export async function fetchEvaluation(): Promise<EvaluationResult> {
  const response = await fetch(`${API_URL}/evaluation`);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export async function fetchResiduals(): Promise<ResidualResponse> {
  const response = await fetch(`${API_URL}/residuals`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export async function fetchPrediction(
  payload: PredictionPayload
): Promise<PredictionResult> {
  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      "API menolak input. Periksa nilai temperatur dan tekanan."
    );
  }

  return response.json();
}

export async function fetchComparison(
  payload: PredictionPayload
): Promise<ComparisonResult> {
  const response = await fetch(`${API_URL}/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      "API menolak input. Periksa nilai temperatur dan tekanan."
    );
  }

  return response.json();
}

export async function fetchPressureCurve(
  payload: PressureCurvePayload
): Promise<PressureCurveResult> {
  const response = await fetch(`${API_URL}/pressure-curve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}
