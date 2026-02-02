import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";
import { REFRESH_RATES } from "../lib/constants";

export function useMarketPrice(symbol) {
  return useQuery({
    queryKey: ["market", "price", symbol],
    enabled: !!symbol,
    staleTime: 0,
    refetchInterval: REFRESH_RATES.marketPriceMs,
    queryFn: async () => {
      const res = await api.get(`/stock/${encodeURIComponent(symbol)}`);
      return res.data;
    },
  });
}

