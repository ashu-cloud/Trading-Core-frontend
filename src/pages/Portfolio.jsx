import React, { useMemo } from "react";
import AppShell from "../components/layout/AppShell";
import Card from "../components/ui/Card";
import PortfolioTable from "../components/features/portfolio/PortfolioTable";
import AllocationChart from "../components/features/portfolio/AllocationChart";
import { usePortfolio } from "../hooks/usePortfolio";
import { formatCurrency } from "../lib/utils";
import { useQueries } from "@tanstack/react-query";
import api from "../lib/axios";

export default function Portfolio() {
  const { data } = usePortfolio();
  const holdings = data?.holdings ?? [];
  const realizedPnl = data?.realizedPnl ?? 0;

  // Fetch current market prices for each holding and compute unrealized PnL locally
  const symbols = useMemo(() => {
    return Array.from(new Set(holdings.map((h) => (h.stockSymbol ?? h.symbol ?? "").toUpperCase()).filter(Boolean)));
  }, [holdings]);

  const priceQueries = useQueries({
    queries: symbols.map((sym) => ({
      queryKey: ["stock", sym],
      queryFn: async () => {
        // FIXED: Changed endpoint to match backend
        const res = await api.get(`/market/price/${encodeURIComponent(sym)}`);
        return res.data;
      },
      staleTime: 0,
      enabled: !!sym,
    })),
  });

  const priceMap = useMemo(() => {
    const map = {};
    priceQueries.forEach((q, i) => {
      if (q?.data) map[symbols[i]] = q.data.price;
    });
    return map;
  }, [priceQueries, symbols]);

  const anyLoading = priceQueries.some((q) => q.isLoading);

  const totalUnrealized = useMemo(() => {
    return holdings.reduce((sum, h) => {
      const qty = h.quantity ?? 0;
      const avg = h.averagePrice ?? 0;
      const sym = (h.stockSymbol ?? h.symbol ?? "").toUpperCase();
      const current = priceMap[sym];
      // If price is not yet available, skip this holding (show skeletons instead in UI)
      if (current === undefined) return sum;
      return sum + (current - avg) * qty;
    }, 0);
  }, [holdings, priceMap]);

  return (
    <AppShell>
      <div className="mb-4">
        <h1 className="text-lg font-semibold tracking-tight text-slate-50">
          Portfolio
        </h1>
        <p className="text-xs text-slate-400">
          View your holdings, allocation, and realized vs unrealized PnL.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Unrealized PnL">
          <p className="text-xs text-slate-400">Open positions only</p>
          <p
            className={`mt-2 text-2xl font-semibold tabular-nums ${
              totalUnrealized >= 0 ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {anyLoading ? (
              <span className="text-slate-400">Loading…</span>
            ) : (
              formatCurrency(totalUnrealized)
            )}
          </p>
        </Card>
        <Card title="Realized PnL">
          <p className="text-xs text-slate-400">Closed positions</p>
          <p
            className={`mt-2 text-2xl font-semibold tabular-nums ${
              realizedPnl >= 0 ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {formatCurrency(realizedPnl)}
          </p>
        </Card>
        <Card title="Allocation">
          <AllocationChart />
        </Card>
      </div>

      <div className="mt-4">
        <Card title="Holdings">
          <PortfolioTable priceMap={priceMap} priceLoading={anyLoading} />
        </Card>
      </div>
    </AppShell>
  );
}

