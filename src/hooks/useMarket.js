import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";
import { REFRESH_RATES } from "../lib/constants";

export function useMarketPrice(symbol) {
  return useQuery({
    queryKey: ["stock", symbol],
    enabled: !!symbol,
    staleTime: 0,
    refetchInterval: REFRESH_RATES.marketPriceMs,
    queryFn: async () => {
      const sym = String(symbol).toUpperCase();
      // FIXED: Changed endpoint to match backend market.router.js
      const res = await api.get(`/market/price/${encodeURIComponent(sym)}`);
      return res.data;
    },
  });
}