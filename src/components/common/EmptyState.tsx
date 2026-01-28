import React from "react";

export default function EmptyState({
  icon: Icon,
  title,
  subtitle,
  action,
}: {
  icon: any;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-10 text-center">
      <Icon className="mx-auto h-6 w-6 text-zinc-600" />
      <div className="mt-3 text-sm font-semibold text-zinc-900">{title}</div>
      <div className="mt-1 text-sm text-zinc-600">{subtitle}</div>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}
