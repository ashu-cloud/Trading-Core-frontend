import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

export function useWalletBalance() {
  return useQuery({
    queryKey: ["wallet", "balance"],
    queryFn: async () => {
      const res = await api.get("/wallet/balance");
      return res.data ?? { balance: 0 };
    },
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

