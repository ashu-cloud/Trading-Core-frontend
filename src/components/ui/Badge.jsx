import React from "react";
import { cn } from "../../lib/utils";

export default function Badge({ children, variant = "default", className }) {
  const base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium tabular-nums";

  const variants = {
    default: "bg-slate-800 text-slate-100",
    success: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/40",
    danger: "bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/40",
    info: "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/40",
    warning: "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/40",
    subtle: "bg-slate-800 text-slate-300",
  };

  return (
    <span className={cn(base, variants[variant], className)}>{children}</span>
  );
}

