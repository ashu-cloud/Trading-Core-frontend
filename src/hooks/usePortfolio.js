import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

export function useWalletBalance() {
  return useQuery({
    queryKey: ["wallet"],
    queryFn: async () => {
      // FIXED: Correct endpoint matching backend mount point
      const res = await api.get("/user/wallet");
      return { balance: res.data?.wallet_balance ?? 0 };
    },
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

