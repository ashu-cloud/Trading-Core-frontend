import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

export function useWalletBalance() {
  return useQuery({
    queryKey: ["wallet"],
    queryFn: async () => {
      const res = await api.get("/wallet/balance");
      return res.data ?? { balance: 0 };
    },
    // Poll wallet every 10s as the backend is the source of truth
    refetchInterval: 10000,
  });
}

export function usePortfolio() {
  return useQuery({
    queryKey: ["portfolio"],
    queryFn: async () => {
      const res = await api.get("/portfolio");
      return res.data ?? { holdings: [], realizedPnl: 0 };
    },
  });
}

