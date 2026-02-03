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
      const res = await api.get(`/stock/${encodeURIComponent(sym)}`);
      return res.data;
    },
  });
}

