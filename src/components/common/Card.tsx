
export default function Card({
  title,
  icon: Icon,
  right,
  children,
}: {
  title: string;
  icon?: any;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-white border border-zinc-200 shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          {Icon ? <Icon className="h-4 w-4 text-zinc-700" /> : null}
          <div className="text-sm font-semibold text-zinc-900">{title}</div>
        </div>
        {right}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
