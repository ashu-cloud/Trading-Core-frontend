import React, { useState } from "react";
import { Search } from "lucide-react";
import AppShell from "../components/layout/AppShell";
import Card from "../components/ui/Card";
import { useDebounce } from "../hooks/useDebounce";
import { useMarketPrice } from "../hooks/useMarket";
import PriceDisplay from "../components/features/market/PriceDisplay";
import OrderForm from "../components/features/market/OrderForm";
import Button from "../components/ui/Button";

export default function Market() {
  const [inputSymbol, setInputSymbol] = useState("AAPL");
  const debouncedSymbol = useDebounce(inputSymbol.trim().toUpperCase(), 400);
  const [activeTab, setActiveTab] = useState("BUY");

  const { data, isLoading, isError, refetch } = useMarketPrice(
    debouncedSymbol
  );

  return (
    <AppShell>
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-50">
            Trading terminal
          </h1>
          <p className="text-xs text-slate-400">
            Search a ticker, watch the price, and submit buy/sell orders.
          </p>
        </div>
        <div className="flex w-full max-w-xs items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              className="w-full rounded-md border border-slate-700 bg-slate-900 pl-7 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
              placeholder="Search symbol (e.g. AAPL, TSLA)"
              value={inputSymbol}
              onChange={(e) => setInputSymbol(e.target.value)}
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            className="px-2 py-1 text-xs"
            onClick={() => refetch()}
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Price action">
          <PriceDisplay symbol={debouncedSymbol} data={data} isLoading={isLoading} />
          {isError && (
            <p className="mt-3 text-[11px] text-rose-400">
              Unable to fetch market data for this symbol. Please verify the
              symbol or try again later.
            </p>
          )}
        </Card>
        <Card
          title="Order entry"
          headerRight={
            <div className="inline-flex rounded-full bg-slate-900 p-0.5 text-[11px]">
              {["BUY", "SELL"].map((side) => (
                <button
                  key={side}
                  type="button"
                  onClick={() => setActiveTab(side)}
                  className={`relative flex-1 rounded-full px-3 py-1 font-medium ${
                    activeTab === side ? "text-slate-50" : "text-slate-400"
                  }`}
                >
                  {activeTab === side && (
                    <span
                      className={`absolute inset-0 rounded-full ${
                        side === "BUY" ? "bg-emerald-600/30" : "bg-rose-600/30"
                      }`}
                    />
                  )}
                  <span className="relative z-10">{side}</span>
                </button>
              ))}
            </div>
          }
        >
          <OrderForm side={activeTab} symbol={debouncedSymbol} />
        </Card>
      </div>
    </AppShell>
  );
}

