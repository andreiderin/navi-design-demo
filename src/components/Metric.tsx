
export default function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl bg-zinc-50 border border-zinc-200 p-4">
      <div className="text-xs text-zinc-600">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}
