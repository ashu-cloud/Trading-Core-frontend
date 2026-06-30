import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";

export function usePaymentHistory() {
    return useQuery({
        queryKey: ["paymentHistory"],
        queryFn: async () => {
            const res = await api.get("/user/payments/history");
            return res.data?.paymentHistory ?? [];
        },
        staleTime: 0,
    });
}

export function useInitiatePayment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ amount, idempotencyKey }) => {
            const res = await api.post(
                "/user/payments/initiate",
                { amount },
                {
                    headers: {
                        "Idempotency-Key": idempotencyKey,
                    },
                }
            );
            return res.data;
        },

        onSuccess: () => {
            // Refresh wallet balance card and the history table
            queryClient.invalidateQueries({ queryKey: ["wallet"] });
            queryClient.invalidateQueries({ queryKey: ["paymentHistory"] });
        },
    });
}
