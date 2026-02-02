import React from "react";
import { cn } from "../../lib/utils";

export default function Card({ title, className, children, headerRight }) {
  return (
    <section
      className={cn(
        "flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm",
        className
      )}
    >
      {(title || headerRight) && (
        <header className="mb-3 flex items-center justify-between gap-2">
          {title && (
            <h2 className="text-sm font-semibold tracking-tight text-slate-100">
              {title}
            </h2>
          )}
          {headerRight}
        </header>
      )}
      {children}
    </section>
  );
}

