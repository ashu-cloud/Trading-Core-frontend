import React, { useMemo, useState } from "react";
import Button from "../../ui/Button";
import { usePortfolio } from "../../../hooks/usePortfolio";
import { formatCurrency, formatPercent } from "../../../lib/utils";
import QuickSellModal from "./QuickSellModal";

export default function PortfolioTable({ priceMap = {}, priceLoading = false }) {
  const { data, isLoading, isError, refetch } = usePortfolio();
  const [quickSellSymbol, setQuickSellSymbol] = useState(null);

  const holdings = data?.holdings ?? [];

  const rows = useMemo(
    () =>
      // ... inside useMemo ...
      holdings.map((h) => {
        const symbol = (h.stockSymbol ?? h.symbol ?? "").toUpperCase();
        const qty = h.quantity ?? 0;
        // FIXED: avgPrice is the key from backend
        const avg = h.avgPrice ?? h.averagePrice ?? 0; 
        const current = priceMap[symbol];
        // ...
        const pnlValue = current !== undefined ? (current - avg) * qty : null;
        const pnlPct = current !== undefined && avg > 0 ? ((current - avg) / avg) * 100 : 0;
        return {
          ...h,
          symbol,
          qty,
          avg,
          current,
          pnlValue,
          pnlPct,
        };
      }),
    [holdings, priceMap]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10 text-sm text-slate-400">
        Loading portfolio…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-3 py-8 text-sm text-slate-300">
        <p>Unable to load portfolio right now.</p>
        <Button type="button" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="max-h-[480px] overflow-auto text-xs">
        <table className="min-w-full border-separate border-spacing-y-1">
          <thead className="sticky top-0 bg-slate-900 text-[11px] text-slate-400">
            <tr>
              <th className="px-2 py-1 text-left font-medium">Symbol</th>
              <th className="px-2 py-1 text-right font-medium">Qty</th>
              <th className="px-2 py-1 text-right font-medium">Avg price</th>
              <th className="px-2 py-1 text-right font-medium">
                Current price
              </th>
              <th className="px-2 py-1 text-right font-medium">Unrealized PnL</th>
              <th className="px-2 py-1 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.symbol}
                className="rounded-md bg-slate-900/70 hover:bg-slate-800/60"
              >
                <td className="px-2 py-1 text-sm font-semibold text-slate-100">
                  {row.symbol}
                </td>
                <td className="px-2 py-1 text-right tabular-nums text-slate-200">
                  {row.qty}
                </td>
                <td className="px-2 py-1 text-right tabular-nums text-slate-200">
                  {formatCurrency(row.avg)}
                </td>
                <td className="px-2 py-1 text-right tabular-nums text-slate-200">
                  {row.current !== undefined ? (
                    formatCurrency(row.current)
                  ) : (
                    priceLoading ? (
                      <span className="text-slate-400">Loading…</span>
                    ) : (
                      "--"
                    )
                  )}
                </td>
                <td className="px-2 py-1 text-right tabular-nums">
                  {row.pnlValue === null ? (
                    priceLoading ? (
                      <span className="text-slate-400">Loading…</span>
                    ) : (
                      "--"
                    )
                  ) : (
                    <span
                      className={
                        row.pnlValue >= 0 ? "text-emerald-400" : "text-rose-400"
                      }
                    >
                      {formatCurrency(row.pnlValue)}{" "}
                      <span className="text-[11px] text-slate-400">
                        ({formatPercent(row.pnlPct)})
                      </span>
                    </span>
                  )}
                </td>
                <td className="px-2 py-1 text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    className="px-2 py-1 text-[11px]"
                    onClick={() =>
                      setQuickSellSymbol({
                        symbol: row.symbol,
                        quantity: row.qty,
                      })
                    }
                  >
                    Quick sell
                  </Button>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td
                  colSpan={6}
                  className="px-2 py-6 text-center text-slate-500"
                >
                  No holdings yet. Executed BUY orders will appear as positions
                  here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {quickSellSymbol && (
        <QuickSellModal
          symbol={quickSellSymbol.symbol}
          quantity={quickSellSymbol.quantity}
          onClose={() => setQuickSellSymbol(null)}
        />
      )}
    </>
  );
}

