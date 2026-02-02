import React from "react";
import { cn } from "../../lib/utils";

export default function Input({ label, error, className, ...props }) {
  return (
    <label className="flex w-full flex-col gap-1 text-sm">
      {label && <span className="text-xs font-medium text-slate-300">{label}</span>}
      <input
        className={cn(
          "w-full rounded-md border bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition-colors placeholder:text-slate-500",
          error
            ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500"
            : "border-slate-700 focus:border-indigo-500 focus:ring-indigo-500",
          className
        )}
        {...props}
      />
      {error && (
        <span className="text-xs font-medium text-rose-400">{error}</span>
      )}
    </label>
  );
}

