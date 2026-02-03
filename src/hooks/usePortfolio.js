import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

export function useWalletBalance() {
  return useQuery({
    queryKey: ["wallet"],
    queryFn: async () => {
      // FIXED: Backend route is mounted at /api/user/wallet
      const res = await api.get("/user/wallet");
      return res.data ?? { balance: 0, wallet_balance: 0 };
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

