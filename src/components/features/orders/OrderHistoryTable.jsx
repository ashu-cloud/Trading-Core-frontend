import React from "react";
import { X, Play } from "lucide-react";
import Badge from "../../ui/Badge";
import Button from "../../ui/Button";
import { useOrders, useOrderActions } from "../../../hooks/useOrders";
import { formatCurrency, formatDateTime } from "../../../lib/utils";

export default function OrderHistoryTable() {
  const { data: orders, isLoading, isError, refetch } = useOrders();
  const { cancelMutation, executeMutation } = useOrderActions();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10 text-sm text-slate-400">
        Loading orders…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-3 py-8 text-sm text-slate-300">
        <p>Unable to load orders at the moment.</p>
        <Button type="button" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const rows = orders ?? [];

  const renderStatusBadge = (status) => {
    const s = (status ?? "OPEN").toUpperCase();
    if (s === "OPEN") {
      return (
        <Badge variant="info" className="animate-pulse-slow">
          OPEN
        </Badge>
      );
    }
    if (s === "FILLED") {
      return <Badge variant="success">FILLED</Badge>;
    }
    if (s === "CANCELLED") {
      return (
        <Badge variant="subtle" className="line-through opacity-70">
          CANCELLED
        </Badge>
      );
    }
    return <Badge variant="subtle">{s}</Badge>;
  };

  return (
    <div className="max-h-[480px] overflow-auto text-xs">
      <table className="min-w-full border-separate border-spacing-y-1">
        <thead className="sticky top-0 bg-slate-900 text-[11px] text-slate-400">
          <tr>
            <th className="px-2 py-1 text-left font-medium">Time</th>
            <th className="px-2 py-1 text-left font-medium">Symbol</th>
            <th className="px-2 py-1 text-left font-medium">Side</th>
            <th className="px-2 py-1 text-right font-medium">Qty</th>
            <th className="px-2 py-1 text-right font-medium">Price</th>
            <th className="px-2 py-1 text-left font-medium">Status</th>
            <th className="px-2 py-1 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((order) => {
            const side = (order.type ?? order.side ?? "").toUpperCase();
            const isOpen = (order.status ?? "OPEN").toUpperCase() === "OPEN";
            return (
              <tr
                key={order._id}
                className="rounded-md bg-slate-900/70 hover:bg-slate-800/60"
              >
                <td className="px-2 py-1 text-slate-300">
                  {formatDateTime(order.createdAt ?? order.date)}
                </td>
                <td className="px-2 py-1 text-sm font-semibold text-slate-100">
                  {order.stockSymbol ?? order.symbol}
                </td>
                <td className="px-2 py-1">
                  <Badge
                    variant={side === "BUY" ? "success" : "danger"}
                  >
                    {side || "--"}
                  </Badge>
                </td>
                <td className="px-2 py-1 text-right tabular-nums text-slate-200">
                  {order.quantity ?? 0}
                </td>
                <td className="px-2 py-1 text-right tabular-nums text-slate-200">
                  {formatCurrency(order.price ?? 0)}
                </td>
                <td className="px-2 py-1">{renderStatusBadge(order.status)}</td>
                <td className="px-2 py-1">
                  {isOpen ? (
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
                        onClick={() =>
                          cancelMutation.mutate(order._id ?? order.id)
                        }
                        aria-label="Cancel order"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
                        onClick={() =>
                          executeMutation.mutate(order._id ?? order.id)
                        }
                        aria-label="Force execute order"
                      >
                        <Play className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-right text-slate-500">--</div>
                  )}
                </td>
              </tr>
            );
          })}
          {!rows.length && (
            <tr>
              <td
                colSpan={7}
                className="px-2 py-6 text-center text-slate-500"
              >
                No orders yet. Orders you place from the Market page will show
                up here.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

