import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import { REFRESH_RATES } from "../lib/constants";

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    staleTime: 0,
    refetchInterval: REFRESH_RATES.ordersMs,
   queryFn: async () => {
      // FIXED: Correct endpoint
      const res = await api.get("/order/my");
      return res.data?.orders ?? [];
    },
  });
}

export function useOrderActions() {
  const queryClient = useQueryClient();

  const cancelMutation = useMutation({
   mutationFn: async (orderId) => {
      // FIXED: Use DELETE method
      await api.delete(`/order/${orderId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  // Keep executeMutation available if admin test helpers exist, but ensure invalidation
  const executeMutation = useMutation({
    mutationFn: async (orderId) => {
      await api.post(`/order/execute/${orderId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
  });

  return { cancelMutation, executeMutation };
}

