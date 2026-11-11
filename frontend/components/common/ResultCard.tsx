type ResultCardProps = {
  label: string;
  value: string;
};

export function ResultCard({
  label,
  value,
}: ResultCardProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-2 text-xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
