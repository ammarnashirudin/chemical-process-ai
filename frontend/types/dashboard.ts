export type PredictionResult = {
  predicted_Z: number;
  model: string;
  within_training_range: boolean;
  warning: string | null;
};

export type ComparisonResult = {
  pr_eos_Z: number;
  predicted_Z: number;
  absolute_error: number;
  model: string;
};

export type PressureCurvePoint = {
  pressure_Pa: number;
  pressure_MPa: number;
  ml_Z: number;
  pr_eos_Z: number;
  absolute_error: number;
};

export type PressureCurveResult = {
  temperature_K: number;
  points: PressureCurvePoint[];
  model: string;
  reference: string;
};

export type ModelScore = {
  mae: number;
  rmse: number;
  r2: number;
};

export type EvaluationResult = {
  best_model: string;
  dataset_rows: number;
  train_rows: number;
  validation_rows: number;
  test_rows: number;
  validation_results: {
    linear_regression: ModelScore;
    random_forest: ModelScore;
    random_forest_tuned: ModelScore;
    gradient_boosting: ModelScore;
  };
  final_test_results: ModelScore;
  residual_metrics: {
    test_rows: number;
    mean_residual: number;
    mean_absolute_residual: number;
    residual_std: number;
    fraction_overpredicted: number;
    fraction_underpredicted: number;
    note: string;
  };
  interpretation: string;
};

export type ModelComparisonPoint = {
  model: string;
  mae: number;
  rmse: number;
  r2: number;
};

export type ResidualPoint = {
  temperature_K: number;
  pressure_Pa: number;
  z_actual: number;
  z_predicted: number;
  residual: number;
  absolute_error: number;
};

export type QQPoint = {
  theoretical_quantile: number;
  sample_quantile: number;
};

export type ResidualResponse = {
  count: number;
  residuals: ResidualPoint[];
  qq_plot: QQPoint[];
  definition: string;
};

export type ResidualHistogramPoint = {
  residualRange: string;
  frequency: number;
};

export type TemperatureAnalysisRow = {
  temperatureRange: string;
  count: number;
  meanResidual: number | null;
  mae: number | null;
  rmse: number | null;
};

export type PressureAnalysisRow = {
  pressureRange: string;
  count: number;
  meanResidual: number | null;
  mae: number | null;
  rmse: number | null;
};
