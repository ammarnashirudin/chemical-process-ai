type ResidualPredictionFractionsProps = {
  fractionOverpredicted: number;
  fractionUnderpredicted: number;
};

export function ResidualPredictionFractions({
  fractionOverpredicted,
  fractionUnderpredicted,
}: ResidualPredictionFractionsProps) {
  const overpredictedPercent = fractionOverpredicted * 100;
  const underpredictedPercent = fractionUnderpredicted * 100;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-xl bg-slate-900 p-4">
        <p className="text-sm text-slate-400">
          Fraction Overpredicted
        </p>
        <p className="mt-2 text-2xl font-bold text-cyan-400">
          {overpredictedPercent.toFixed(1)}%
        </p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-700">
          <div
            className="h-full rounded-full bg-cyan-400"
            style={{ width: `${overpredictedPercent}%` }}
          />
        </div>
      </div>

      <div className="rounded-xl bg-slate-900 p-4">
        <p className="text-sm text-slate-400">
          Fraction Underpredicted
        </p>
        <p className="mt-2 text-2xl font-bold text-violet-400">
          {underpredictedPercent.toFixed(1)}%
        </p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-700">
          <div
            className="h-full rounded-full bg-violet-400"
            style={{ width: `${underpredictedPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
