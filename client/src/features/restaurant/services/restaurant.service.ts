import { useQuery } from "@tanstack/react-query";
import axios from "@/utils/axios";
import APIs from "@/utils/apis";
import type { Restaurant } from "@/types";

export const useGetRestaurants = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: [APIs.RESTAURANT.GET],
    queryFn: async () => {
      const { data } = await axios.get(APIs.RESTAURANT.GET);
      return data.data as Restaurant[];
    },
    enabled: options?.enabled,
  });
};
