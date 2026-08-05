import { useQuery } from "@tanstack/react-query";
import axios from "@/utils/axios";
import APIs from "@/utils/apis";
import useAppMutation from "@/react-query-config/hooks/useAppMutation";
import type { Order, OrderItem, OrderStatus } from "@/types";

interface CreateOrderPayload {
  branchId: string;
  tableNumber: string;
  items: OrderItem[];
}

export const useCreateOrder = () =>
  useAppMutation<Order, CreateOrderPayload>({
    mutationFn: async (payload) => {
      const { data } = await axios.post(APIs.ORDER.CREATE, payload);
      return data.data;
    },
    successMsg: "Order placed",
    invalidateQueryKeys: [APIs.ORDER.GET],
  });

interface GetOrdersParams {
  branchId?: string;
  status?: OrderStatus;
  search?: string;
}

export const useGetOrders = (params: GetOrdersParams, options?: { refetchInterval?: number }) => {
  return useQuery({
    queryKey: [APIs.ORDER.GET, params],
    queryFn: async () => {
      const { data } = await axios.get(APIs.ORDER.GET, { params });
      return data.data as Order[];
    },
    refetchInterval: options?.refetchInterval,
  });
};

export const useGetOrderDetail = (orderId?: string, options?: { refetchInterval?: number }) => {
  return useQuery({
    queryKey: [APIs.ORDER.GET__id, orderId],
    queryFn: async () => {
      const { data } = await axios.get(`${APIs.ORDER.GET__id}${orderId}`);
      return data.data as Order;
    },
    enabled: Boolean(orderId),
    refetchInterval: options?.refetchInterval,
  });
};

export const useGetBill = (orderId?: string) => {
  return useQuery({
    queryKey: [APIs.ORDER.BILL__id, orderId],
    queryFn: async () => {
      const { data } = await axios.get(`${APIs.ORDER.BILL__id}${orderId}`);
      return data.data as Order;
    },
    enabled: Boolean(orderId),
  });
};

export const useUpdateOrderStatus = () =>
  useAppMutation<Order, { id: string; status: OrderStatus }>({
    mutationFn: async ({ id, status }) => {
      const { data } = await axios.post(`${APIs.ORDER.UPDATE_STATUS__id}${id}`, { status });
      return data.data;
    },
    successMsg: "Order status updated",
    invalidateQueryKeys: [APIs.ORDER.GET, APIs.ORDER.GET__id],
    succssMsgVisibility: false,
  });
