import React from "react";
import { formatCurrency } from "../../../lib/utils";

export default function PriceDisplay({ symbol, data, isLoading }) {
  // Backend returns { symbol, price }
  const price = data?.price;
  const changePct = 0; // backend does not provide, keep neutral or extend later

  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-2">
        <h2 className="text-lg font-semibold tracking-tight text-slate-50">
          {symbol || "Select a symbol"}
        </h2>
        {symbol && (
          <span className="text-xs text-slate-500 uppercase tracking-[0.18em]">
            EQUITY
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-4">
        <p className="text-3xl font-semibold tabular-nums">
          {symbol ? (isLoading ? "Loading…" : formatCurrency(price ?? 0)) : "--"}
        </p>
        {symbol && (
          <p className="text-xs text-slate-400">
            24h change:{" "}
            <span className="font-medium text-slate-300">
              {changePct.toFixed(2)}%
            </span>
          </p>
        )}
      </div>
      {isLoading && (
        <p className="text-[11px] text-slate-500">
          Updating price from market data feed…
        </p>
      )}
    </div>
  );
}

