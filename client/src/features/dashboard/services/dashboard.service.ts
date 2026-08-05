import { useQuery } from "@tanstack/react-query";
import axios from "@/utils/axios";
import APIs from "@/utils/apis";

export interface DashboardSummary {
  totalOrders: number;
  pendingOrders: number;
  preparingOrders: number;
  readyOrders: number;
  completedOrders: number;
  todaysSales: number;
  activeEmployees: number;
}

export const useGetDashboardSummary = (branchId?: string) => {
  return useQuery({
    queryKey: [APIs.DASHBOARD.ADMIN, branchId],
    queryFn: async () => {
      const { data } = await axios.get(APIs.DASHBOARD.ADMIN, { params: { branchId } });
      return data.data as DashboardSummary;
    },
    refetchInterval: 15000,
  });
};
