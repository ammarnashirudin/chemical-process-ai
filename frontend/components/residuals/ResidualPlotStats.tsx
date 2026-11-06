type ResidualStats = {
  count: number;
  meanResidual: number;
  mae: number;
  standardDeviation: number;
  overPrediction: number;
  underPrediction: number;
  overPredictionPercent: number;
  underPredictionPercent: number;
};

type ResidualPlotStatsProps = {
  residualStats: ResidualStats;
};

export function ResidualPlotStats({
  residualStats,
}: ResidualPlotStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-4">
      <div className="rounded-xl border border-gray-700 bg-gray-900 p-4">
        <p className="text-sm text-gray-400">Filtered Samples</p>
        <p className="mt-2 text-2xl font-bold">
          {residualStats.count}
        </p>
      </div>

      <div className="rounded-xl border border-gray-700 bg-gray-900 p-4">
        <p className="text-sm text-gray-400">Mean residual</p>
        <p className="mt-2 text-2xl font-bold">
          {residualStats.meanResidual.toFixed(5)}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Actual Z - Predicted Z
        </p>
      </div>

      <div className="rounded-xl border border-gray-700 bg-gray-900 p-4">
        <p className="text-sm text-gray-400">Mean Absolute Error</p>
        <p className="mt-2 text-2xl font-bold">
          {residualStats.mae.toFixed(5)}
        </p>
      </div>

      <div className="rounded-xl border border-gray-700 bg-gray-900 p-4">
        <p className="text-sm text-gray-400">
          Residual Standard Deviation
        </p>
        <p className="mt-2 text-2xl font-bold">
          {residualStats.standardDeviation.toFixed(5)}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Residual spread (ÃÆ’)
        </p>
      </div>

      <div className="rounded-xl border border-gray-700 bg-gray-900 p-4">
        <p className="text-sm text-gray-400">Prediction Direction</p>
        <div className="mt-3 space-y-3">
          <div>
            <p className="text-sm text-gray-300">Overprediction</p>
            <p className="text-xl font-bold text-red-400">
              {residualStats.overPrediction}
              <span className="ml-2 text-sm">
                ({residualStats.overPredictionPercent.toFixed(2)}%)
              </span>
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-300">Underprediction</p>
            <p className="text-xl font-bold text-cyan-400">
              {residualStats.underPrediction}
              <span className="ml-2 text-sm">
                ({residualStats.underPredictionPercent.toFixed(2)}%)
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
