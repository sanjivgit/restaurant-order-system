import { useQuery } from "@tanstack/react-query";
import { getGuestTokenData } from "@/features/auth/services/guestToken.service";
import APIs from "@/utils/apis";
import type { DiningContext } from "@/redux/contextSlice";

export const useResolveDiningContext = (params: {
  restaurantSlug: string;
  branchSlug: string;
  tableId: string;
}) => {
  return useQuery({
    queryKey: [APIs.AUTH.GUEST_TOKEN, params.tableId],
    queryFn: async () => {
      const tokenData = await getGuestTokenData(params.tableId);

      return {
        restaurantId: tokenData?.branchId ?? "",
        restaurantName: "",
        branchId: tokenData?.branchId ?? params.branchSlug,
        branchName: params.branchSlug,
        tableId: tokenData?.tableId ?? params.tableId,
        tableNumber: params.tableId,
      } as DiningContext;
    },
    enabled: Boolean(params.restaurantSlug && params.branchSlug && params.tableId),
    staleTime: Infinity,
  });
};
