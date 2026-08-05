import { useQuery } from "@tanstack/react-query";
import axios from "@/utils/axios";
import APIs from "@/utils/apis";
import type { DiningContext } from "@/redux/contextSlice";

export const useResolveDiningContext = (params: {
  restaurantSlug: string;
  branchSlug: string;
  tableId: string;
}) => {
  return useQuery({
    queryKey: [APIs.CONTEXT.RESOLVE_QR, params.restaurantSlug, params.branchSlug, params.tableId],
    queryFn: async () => {
      const { data } = await axios.get(APIs.CONTEXT.RESOLVE_QR, { params });
      return data.data as DiningContext;
    },
    enabled: Boolean(params.restaurantSlug && params.branchSlug && params.tableId),
    staleTime: Infinity,
  });
};
