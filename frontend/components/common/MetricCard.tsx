type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
};

export function MetricCard({
  label,
  value,
  detail,
}: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 text-xl font-semibold">{value}</p>
      <p className="mt-2 text-xs text-slate-500">{detail}</p>
    </div>
  );
}
