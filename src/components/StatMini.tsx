
export default function StatMini({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white border border-zinc-200 px-2 py-2">
      <div className="text-[11px] text-zinc-600">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}
