import React from "react";
import AppShell from "../components/layout/AppShell";
import Card from "../components/ui/Card";
import PortfolioTable from "../components/features/portfolio/PortfolioTable";
import AllocationChart from "../components/features/portfolio/AllocationChart";
import { usePortfolio } from "../hooks/usePortfolio";
import { formatCurrency } from "../lib/utils";

export default function Portfolio() {
  // 1. Catch both 'data' (React Query default) and 'portfolio' (if custom mapped)
  const { data, portfolio: hookPortfolio, isLoading, isError, refetch } = usePortfolio();

  if (isLoading) return <div className="p-10 text-slate-400">Loading...</div>;
  if (isError) return <div className="p-10 text-rose-500">Error loading portfolio</div>;

  // 2. Safely unwrap the object, wherever it's hiding
  const portfolioData = hookPortfolio || data?.portfolio || data || {};

  // 3. Catch BOTH "holding" (backend schema) and "holdings" (frontend expectation)
  const holdings = portfolioData.holding || portfolioData.holdings || [];
  
  // 4. Extract PnL safely
  const realizedPnl = portfolioData.totalRealizedPnl || portfolioData.realizedPnl || 0;
  const totalUnrealized = portfolioData.totalUnrealizedPnl || portfolioData.unrealizedPnl || 0;

  return (
    <AppShell>
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-50">
            Portfolio
          </h1>
          <p className="text-xs text-slate-400">
            View your holdings, allocation, and realized vs unrealized PnL.
          </p>
        </div>
        {(isError || (!isLoading && !holdings.length)) && (
          <button
            onClick={() => refetch()}
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300"
          >
            Refresh
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Unrealized PnL">
          <p className="text-xs text-slate-400">Open positions</p>
          <p
            className={`mt-2 text-2xl font-semibold tabular-nums ${
              totalUnrealized >= 0 ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {isLoading ? (
              <span className="text-slate-500 text-lg">Loading...</span>
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
          {/* AllocationChart fetches its own data internally */}
          <AllocationChart />
        </Card>
      </div>

      <div className="mt-4">
        <Card title="Holdings">
          <PortfolioTable 
            holdings={holdings} 
            isLoading={isLoading} 
            isError={isError}
          />
        </Card>
      </div>
    </AppShell>
  );
}