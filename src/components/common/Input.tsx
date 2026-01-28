import React from "react";

export default function Input({
  value,
  onChange,
  placeholder,
  icon: Icon,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon?: any;
}) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-3 py-2">
      {Icon ? <Icon className="h-4 w-4 text-zinc-500" /> : null}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none text-sm"
      />
    </div>
  );
}
