import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

export const useAllStocks = () => {
  return useQuery({
    queryKey: ["allStocks"],
    queryFn: async () => {
      // Matches your backend route: router.get("/all", getAllStocks);
      const { data } = await api.get("/market/stocks");
      return data;
    },
    refetchInterval: 10000, 
  });
};