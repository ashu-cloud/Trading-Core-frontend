import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import { REFRESH_RATES } from "../lib/constants";

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    staleTime: 0,
    refetchInterval: REFRESH_RATES.ordersMs,
    queryFn: async () => {
      const res = await api.get("/order/my");
      return res.data ?? [];
    },
  });
}

export function useOrderActions() {
  const queryClient = useQueryClient();

  const cancelMutation = useMutation({
    mutationFn: async (orderId) => {
      await api.delete(`/order/${orderId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const executeMutation = useMutation({
    mutationFn: async (orderId) => {
      await api.post(`/order/execute/${orderId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return { cancelMutation, executeMutation };
}

