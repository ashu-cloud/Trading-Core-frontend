import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useWalletBalance, usePortfolio } from "../../../hooks/usePortfolio";
import { formatCurrency } from "../../../lib/utils";

// Expanded color palette for multiple stocks
const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ec4899", "#06b6d4", "#8b5cf6"];

export default function AllocationChart() {
  const { data: wallet } = useWalletBalance();
  const { data: portfolio } = usePortfolio();

  const walletBalance = wallet?.balance ?? 0;
  const holdings = portfolio?.holdings ?? [];

  const chartData = useMemo(() => {
    // 1. Add Cash entry
    const data = [{ name: "Cash", value: walletBalance }];

    // 2. Add individual stock entries based on Market Value
    holdings.forEach((h) => {
      const symbol = (h.stockSymbol ?? h.symbol ?? "").toUpperCase();
      // Use currentPrice if available, fallback to avgPrice
      const price = h.currentPrice && h.currentPrice > 0 ? h.currentPrice : (h.avgPrice ?? 0);
      const value = price * (h.quantity ?? 0);

      if (value > 0) {
        data.push({ name: symbol, value });
      }
    });

    return data;
  }, [walletBalance, holdings]);

  return (
    <div className="h-52">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={40}
            outerRadius={65}
            paddingAngle={4}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              border: "1px solid #1e293b",
              borderRadius: "0.5rem",
              fontSize: "11px",
              color: "#f8fafc",
            }}
            itemStyle={{ color: "#f8fafc" }}
            formatter={(value, name) => [formatCurrency(value), name]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}