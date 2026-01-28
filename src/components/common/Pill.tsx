import React from "react";
import { cx } from "../../utils/cx";

export default function Pill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs",
        className
      )}
    >
      {children}
    </span>
  );
}
