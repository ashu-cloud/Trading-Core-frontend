import React, { useState } from "react";
import { Search, AlertCircle } from "lucide-react"; // Added AlertCircle for better UI
import AppShell from "../components/layout/AppShell";
import Card from "../components/ui/Card";
import { useDebounce } from "../hooks/useDebounce";
import { useMarketPrice } from "../hooks/useMarket";
import PriceDisplay from "../components/features/market/PriceDisplay";
import OrderForm from "../components/features/market/OrderForm";
import Button from "../components/ui/Button";

export default function Market() {
  // inputSymbol tracks exactly what the user types (UI state)
  const [inputSymbol, setInputSymbol] = useState("AAPL");
  const [activeTab, setActiveTab] = useState("BUY");

  // FIX 1: Search Logic - Extract Ticker
  // This function isolates the ticker from strings like "JPM (JPMORGAN CHASE & CO.)"
  const extractTicker = (raw) => {
    if (!raw) return "";
    // 1. Split by space or open parenthesis to separate Ticker from Company Name
    // 2. Remove any non-ticker characters (allow letters, numbers, and '.' for suffixes)
    const clean = raw.split(/[\s(]/)[0].replace(/[^A-Z0-9.]/gi, "");
    return clean.toUpperCase();
  };

  // We debounce the CLEANED symbol for the API call
  // This prevents "JPM (..." from ever hitting the backend
  const debouncedSymbol = useDebounce(extractTicker(inputSymbol), 500);

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
              placeholder="Search symbol (e.g. AAPL, TATAMOTORS)"
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
          {/* PriceDisplay handles the data or loading states */}
          <PriceDisplay symbol={debouncedSymbol} data={data} isLoading={isLoading} />
          
          {/* FIX 2: Enhanced Error Handling for Indian/Missing Stocks */}
          {isError && (
            <div className="mt-4 flex items-start gap-3 rounded-md border border-rose-500/30 bg-rose-500/10 p-3">
              <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
              <div>
                <p className="text-xs font-medium text-rose-300">
                  Symbol "{debouncedSymbol}" not found.
                </p>
                <p className="mt-1 text-[11px] text-rose-400/80 leading-relaxed">
                  The backend could not retrieve data for this ticker. 
                  <br />
                  <span className="text-rose-200 block mt-1">
                    • Check for typos.
                    <br />
                    • For <strong>Indian Stocks (NSE)</strong>, append <code className="bg-rose-950/50 px-1 rounded">.NS</code> (e.g., {debouncedSymbol || "TATA"}.NS).
                  </span>
                </p>
              </div>
            </div>
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
          {/* Pass the CLEANED symbol to OrderForm so it doesn't fail either */}
          <OrderForm side={activeTab} symbol={debouncedSymbol} />
        </Card>
      </div>
    </AppShell>
  );
}