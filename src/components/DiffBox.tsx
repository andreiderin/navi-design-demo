import React from "react";

export default function DiffBox({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-4">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-2 space-y-2">
        {items.length === 0 ? (
          <div className="text-sm text-zinc-600">None</div>
        ) : (
          items.map((x) => (
            <div
              key={x}
              className="rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm"
            >
              {x}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
