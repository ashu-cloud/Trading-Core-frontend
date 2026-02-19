import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import api from "../lib/axios";

export default function AllStocks() {
  const [stocks, setStocks] = useState([]); // Combined list of all loaded stocks
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 1. Logic to fetch a specific page and append to the list
  const fetchStocks = async (pageNum) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/market/stocks?page=${pageNum}&limit=20`);
      
      // Handle the different backend formats we discussed
      let newStocks = [];
      if (Array.isArray(response.data.stocks)) {
        newStocks = response.data.stocks;
      } else if (Array.isArray(response.data)) {
        newStocks = response.data;
      }

      // Append only if we actually got new data
      setStocks((prev) => (pageNum === 1 ? newStocks : [...prev, ...newStocks]));
    } catch (err) {
      console.error("Failed to fetch stocks:", err);
      setError("Failed to load market data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Initial load on mount
  useEffect(() => {
    fetchStocks(1);
  }, []);

  // 3. Filter logic for the search bar (searches through what is already loaded)
  const filteredStocks = stocks.filter((stock) =>
    stock.symbol?.toLowerCase().includes(search.toLowerCase()) ||
    stock.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-6xl p-4 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
          <div>
            <h1 className="text-2xl font-bold">Market Overview</h1>
            <p className="text-slate-400">Live prices for all available assets.</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <div className="absolute left-3 top-2.5 text-slate-500">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search loaded stocks..."
              className="w-full h-10 rounded-md border border-slate-800 bg-slate-900 pl-9 pr-4 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="p-8 text-center text-rose-500 border border-rose-500/20 bg-rose-500/10 rounded-xl">
            {error}
          </div>
        )}

        {/* Data Table */}
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">Symbol</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredStocks.map((stock) => (
                <tr key={`${stock.symbol}-${Math.random()}`} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs text-center uppercase">
                        {stock.symbol?.[0]}
                      </div>
                      <div>
                        <div className="font-bold uppercase">{stock.symbol}</div>
                        <div className="text-xs text-slate-500 truncate max-w-[200px]">
                          {stock.description || stock.name || "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {/* The fallback to 0 handles the missing price issue while loading */}
                    ₹{Number(stock.price || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => navigate(`/market?symbol=${stock.symbol}`)}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-md transition-colors"
                    >
                      Trade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {loading && (
            <div className="flex items-center justify-center py-10 text-slate-400">
              <Loader2 className="animate-spin mr-2" size={20} />
              Loading {page === 1 ? "market data" : "more stocks"}...
            </div>
          )}

          {!loading && filteredStocks.length === 0 && (
            <div className="p-10 text-center text-slate-500">
              No stocks found. Click "Load More" to search further in the market.
            </div>
          )}
        </div>

        {/* LOAD MORE BUTTON */}
        {!loading && stocks.length > 0 && (
          <div className="flex justify-center pb-10">
            <button
              onClick={() => {
                const next = page + 1;
                setPage(next);
                fetchStocks(next);
              }}
              className="flex items-center gap-2 rounded-md bg-slate-800 px-8 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-all active:scale-95"
            >
              Load More Stocks
            </button>
          </div>
        )}
      </main>
    </div>
  );
}