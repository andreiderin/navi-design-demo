import React from "react";
import { cx } from "../../utils/cx";

export default function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cx(
        "inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm",
        checked
          ? "bg-zinc-900 text-white border-zinc-900"
          : "bg-white border-zinc-200 text-zinc-900"
      )}
    >
      <span
        className={cx(
          "h-4 w-7 rounded-full relative",
          checked ? "bg-white/30" : "bg-zinc-200"
        )}
      >
        <span
          className={cx(
            "absolute top-0.5 h-3 w-3 rounded-full transition",
            checked ? "left-3.5 bg-white" : "left-0.5 bg-white"
          )}
        />
      </span>
      {label ? <span>{label}</span> : null}
    </button>
  );
}
