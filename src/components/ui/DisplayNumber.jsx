import React from "react";
import { formatCurrency, formatPercent } from "../../lib/utils";

export default function DisplayNumber({
  value,
  isPercent = false,
  className = "",
  showPnLColor = false,
}) {
  const formatted = isPercent ? formatPercent(value) : formatCurrency(value);
  const parts = formatted.split(".");
  const intPart = parts[0];
  const decimalPart = parts[1] ? `.${parts[1]}` : "";

  let colorClass = "text-text"; // default white
  if (showPnLColor) {
    colorClass = Number(value) >= 0 ? "text-positive" : "text-negative";
  }

  return (
    <span className={`font-mono tabular-nums tracking-tight ${colorClass} ${className}`}>
      {intPart}
      {decimalPart && (
        <span className="text-text-dim font-medium">{decimalPart}</span>
      )}
    </span>
  );
}
