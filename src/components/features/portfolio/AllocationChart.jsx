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

const COLORS = ["#6366f1", "#22c55e"];

export default function AllocationChart() {
  const { data: wallet } = useWalletBalance();
  const { data: portfolio } = usePortfolio();

  const walletBalance = wallet?.balance ?? 0;
  const holdings = portfolio?.holdings ?? [];

  const portfolioValue = useMemo(
    () =>
      holdings.reduce(
        // FIXED: averagePrice -> avgPrice
        (sum, h) => sum + ((h.avgPrice ?? 0) * (h.quantity ?? 0)),
        0
      ),
    [holdings]
  );

  const data = [
    { name: "Cash", value: walletBalance },
    { name: "Stocks", value: portfolioValue },
  ];

  return (
    <div className="h-52">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={40}
            outerRadius={65}
            paddingAngle={4}
          >
            {data.map((entry, index) => (
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
            }}
            formatter={(value, name) => [formatCurrency(value), name]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

