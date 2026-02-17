import React, { useMemo } from "react";
import AppShell from "../components/layout/AppShell";
import Card from "../components/ui/Card";
import { useWalletBalance, usePortfolio } from "../hooks/usePortfolio";
import { useOrders } from "../hooks/useOrders";
import { formatCurrency } from "../lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Badge from "../components/ui/Badge";

const ALLOCATION_COLORS = ["#6366f1", "#22c55e"];

export default function Dashboard() {
  const { data: wallet } = useWalletBalance();
  const { data: portfolio } = usePortfolio();
  const { data: orders } = useOrders();

  const walletBalance = wallet?.balance ?? 0;
  const holdings = portfolio?.holdings ?? [];
  
  // FIXED: Access 'realizedPnL' (matching backend casing)
  const realizedPnl = portfolio?.realizedPnL ?? 0;

  const portfolioValue = useMemo(
    () =>
      holdings.reduce((sum, h) => {
        const price = h.currentPrice && h.currentPrice > 0 ? h.currentPrice : (h.avgPrice ?? 0);
        return sum + (price * (h.quantity ?? 0));
      }, 0),
    [holdings]
  );

  const accountValue = walletBalance + portfolioValue;

  const allocationData = useMemo(
    () => [
      { name: "Cash", value: walletBalance },
      { name: "Stocks", value: portfolioValue },
    ],
    [walletBalance, portfolioValue]
  );

  const recentOrders = (orders ?? []).slice(0, 5);

  return (
    <AppShell>
      <div className="mb-4">
        <h1 className="text-lg font-semibold tracking-tight text-slate-50">
          Morning dashboard
        </h1>
        <p className="text-xs text-slate-400">
          Snapshot of your cash, exposure, and recent trading activity.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Account value" className="md:col-span-2">
          <p className="text-xs text-slate-400">Cash + Portfolio (Market Value)</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums">
            {formatCurrency(accountValue)}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-slate-400">Cash balance</p>
              <p className="mt-1 text-base font-medium tabular-nums text-slate-50">
                {formatCurrency(walletBalance)}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Portfolio market value</p>
              <p className="mt-1 text-base font-medium tabular-nums text-slate-50">
                {formatCurrency(portfolioValue)}
              </p>
            </div>
          </div>
        </Card>

        <Card title="Realized PnL">
          <p className="text-xs text-slate-400">Closed positions only</p>
          <p
            className={`mt-2 text-2xl font-semibold tabular-nums ${
              realizedPnl >= 0 ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {formatCurrency(realizedPnl)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Unrealized PnL is computed per position on the Portfolio page.
          </p>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Card title="Allocation" className="md:col-span-1">
          <div className="h-40">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={allocationData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={4}
                >
                  {allocationData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={ALLOCATION_COLORS[index % ALLOCATION_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    border: "1px solid #1e293b",
                    borderRadius: "0.5rem",
                    fontSize: "11px",
                    color: "#f8fafc", // FIXED: Force white text
                  }}
                  itemStyle={{ color: "#f8fafc" }} // FIXED: Force item text to white
                  formatter={(value, name) => [formatCurrency(value), name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Recent activity" className="md:col-span-2">
          <div className="max-h-52 overflow-y-auto text-xs">
            {!recentOrders.length ? (
              <p className="text-slate-500">
                No orders yet. Place your first trade from the Market tab.
              </p>
            ) : (
              <table className="min-w-full border-separate border-spacing-y-1">
                <thead className="sticky top-0 bg-slate-900 text-[11px] text-slate-400">
                  <tr>
                    <th className="py-1 text-left font-medium">Time</th>
                    <th className="py-1 text-left font-medium">Symbol</th>
                    <th className="py-1 text-left font-medium">Side</th>
                    <th className="py-1 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="rounded-md bg-slate-900/60 hover:bg-slate-800/50"
                    >
                      <td className="py-1 pl-2 pr-1 text-slate-300">
                        {new Date(order.createdAt ?? order.date ?? "").toLocaleString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </td>
                      <td className="py-1 px-1 text-sm font-semibold text-slate-100">
                        {order.stockSymbol ?? order.symbol}
                      </td>
                      <td className="py-1 px-1">
                        <Badge
                          variant={
                            (order.type ?? order.side) === "BUY"
                              ? "success"
                              : "danger"
                          }
                        >
                          {(order.type ?? order.side) || "--"}
                        </Badge>
                      </td>
                      <td className="py-1 px-1">
                        <Badge variant="subtle">
                          {(order.status ?? "").toUpperCase() || "OPEN"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}