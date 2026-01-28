import React from "react";
import { cx } from "../../utils/cx";

export default function Button({
  children,
  onClick,
  variant = "primary",
  disabled,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  className?: string;
}) {
  const base =
    "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition shadow-sm";
  const styles =
    variant === "primary"
      ? "bg-zinc-900 text-white hover:bg-zinc-800"
      : variant === "secondary"
      ? "bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-50"
      : variant === "danger"
      ? "bg-black text-white hover:bg-zinc-800"
      : "bg-transparent text-zinc-900 hover:bg-zinc-100";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cx(
        base,
        styles,
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
}
