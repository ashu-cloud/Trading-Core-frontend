import React from "react";
import AppShell from "../components/layout/AppShell";
import Card from "../components/ui/Card";
import OrderHistoryTable from "../components/features/orders/OrderHistoryTable";
import Button from "../components/ui/Button";
import { useOrders } from "../hooks/useOrders";

export default function Orders() {
  const { refetch } = useOrders();

  return (
    <AppShell>
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-50">
            Orders
          </h1>
          <p className="text-xs text-slate-400">
            Full audit trail of your order intent and execution state.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          className="text-xs"
          onClick={() => refetch()}
        >
          Reload
        </Button>
      </div>
      <Card title="Order history">
        <OrderHistoryTable />
      </Card>
    </AppShell>
  );
}

