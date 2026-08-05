import { useQuery } from "@tanstack/react-query";
import axios from "@/utils/axios";
import APIs from "@/utils/apis";
import { Storage } from "@/utils/storage";
import type { DiningContext } from "@/redux/contextSlice";

interface GuestTokenResponse {
  guestToken: string;
  expiresIn: string;
  branchId: string;
  tableId: string;
}

export const useResolveDiningContext = (params: {
  restaurantSlug: string;
  branchSlug: string;
  tableId: string;
}) => {
  return useQuery({
    queryKey: [APIs.AUTH.GUEST_TOKEN, params.tableId],
    queryFn: async () => {
      const { data } = await axios.post(APIs.AUTH.GUEST_TOKEN, { tableId: params.tableId });
      const tokenData = data.data as GuestTokenResponse;

      await Storage.set("guest_token", { guestToken: tokenData.guestToken });

      return {
        restaurantId: tokenData.branchId,
        restaurantName: "",
        branchId: tokenData.branchId ?? params.branchSlug,
        branchName: params.branchSlug,
        tableId: tokenData.tableId ?? params.tableId,
        tableNumber: params.tableId,
      } as DiningContext;
    },
    enabled: Boolean(params.restaurantSlug && params.branchSlug && params.tableId),
    staleTime: Infinity,
  });
};
