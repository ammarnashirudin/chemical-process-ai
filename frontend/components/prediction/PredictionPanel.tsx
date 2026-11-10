import type {
  PredictionResult,
  ComparisonResult,
} from "../../types/dashboard";

import { PredictionParameters } from "./PredictionParameters";
import { PredictionResults } from "./PredictionResults";

type PredictionPanelProps = {
  temperature: string;
  setTemperature: (value: string) => void;
  pressure: string;
  setPressure: (value: string) => void;
  loading: boolean;
  error: string;
  predict: () => Promise<void>;
  result: PredictionResult | null;
  comparison: ComparisonResult | null;
};

export function PredictionPanel({
  temperature,
  setTemperature,
  pressure,
  setPressure,
  loading,
  error,
  predict,
  result,
  comparison,
}: PredictionPanelProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <PredictionParameters
        temperature={temperature}
        setTemperature={setTemperature}
        pressure={pressure}
        setPressure={setPressure}
        loading={loading}
        error={error}
        predict={predict}
      />

      <PredictionResults
        result={result}
        comparison={comparison}
      />
    </section>
  );
}
