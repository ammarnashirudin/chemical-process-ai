type ResidualInterpretationProps = {
  residualInterpretation: string;
};

export function ResidualInterpretation({
  residualInterpretation,
}: ResidualInterpretationProps) {
  return (
    <div className="mt-4 rounded-xl border border-gray-700 bg-gray-900 p-5">
      <h3 className="text-lg font-semibold text-white">
        Residual Interpretation
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-gray-300">
        {residualInterpretation}
      </p>

      <p className="mt-3 text-xs text-gray-500">
        Interpretation is based on the mean residual of the
        currently filtered dataset.
      </p>
    </div>
  );
}
