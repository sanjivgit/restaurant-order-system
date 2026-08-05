import { useQuery } from "@tanstack/react-query";
import axios from "@/utils/axios";
import APIs from "@/utils/apis";
import useAppMutation from "@/react-query-config/hooks/useAppMutation";
import type { Order, OrderItem, OrderStatus } from "@/types";

interface ApiOrderItem {
  id: string;
  menuItemId: string;
  quantity: number;
  price: number | string;
  subtotal: number | string;
  menuItem?: {
    id: string;
    name: string;
  };
}

interface ApiOrder {
  id: string;
  orderNumber: string;
  branchId: string;
  tableId: string;
  status: OrderStatus;
  subtotal: number | string;
  tax: number | string;
  grandTotal: number | string;
  createdAt: string;
  updatedAt: string;
  items: ApiOrderItem[];
  table?: {
    tableNumber: string;
  };
}

const mapOrder = (o: ApiOrder): Order => ({
  id: o.id,
  orderNumber: o.orderNumber,
  branchId: o.branchId,
  tableNumber: o.table?.tableNumber ?? "",
  items: (o.items ?? []).map((oi) => ({
    itemId: oi.menuItemId,
    name: oi.menuItem?.name ?? "Item",
    price: Number(oi.price),
    qty: oi.quantity,
  })),
  status: o.status,
  totalAmount: Number(o.subtotal),
  tax: Number(o.tax),
  grandTotal: Number(o.grandTotal),
  createdAt: o.createdAt,
  updatedAt: o.updatedAt,
});

interface CreateOrderPayload {
  branchId: string;
  tableNumber: string;
  items: OrderItem[];
}

export const useCreateOrder = () =>
  useAppMutation<Order, CreateOrderPayload>({
    mutationFn: async (payload) => {
      const { data } = await axios.post(APIs.ORDER.CREATE, {
        items: payload.items.map((i) => ({ menuItemId: i.itemId, quantity: i.qty })),
      });
      return mapOrder(data.data as ApiOrder);
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
      const { data } = await axios.get(APIs.ORDER.GET, {
        params: { branchId: params.branchId, status: params.status, limit: 100 },
      });

      let orders = (data.data?.items ?? data.data ?? []).map(mapOrder) as Order[];

      if (params.search) {
        const s = params.search.toLowerCase();
        orders = orders.filter(
          (o) =>
            o.orderNumber.toLowerCase().includes(s) ||
            o.tableNumber.toLowerCase().includes(s)
        );
      }

      return orders;
    },
    refetchInterval: options?.refetchInterval,
  });
};

export const useGetOrderDetail = (orderId?: string, options?: { refetchInterval?: number }) => {
  return useQuery({
    queryKey: [APIs.ORDER.GET__id, orderId],
    queryFn: async () => {
      const { data } = await axios.get(`${APIs.ORDER.GET__id}${orderId}`);
      return mapOrder(data.data as ApiOrder);
    },
    enabled: Boolean(orderId),
    refetchInterval: options?.refetchInterval,
  });
};

export const useGetBill = (orderId?: string) => {
  return useQuery({
    queryKey: [APIs.ORDER.GET__id, "bill", orderId],
    queryFn: async () => {
      const { data } = await axios.get(`${APIs.ORDER.GET__id}${orderId}`);
      return mapOrder(data.data as ApiOrder);
    },
    enabled: Boolean(orderId),
  });
};

export const useUpdateOrderStatus = () =>
  useAppMutation<Order, { id: string; status: OrderStatus }>({
    mutationFn: async ({ id, status }) => {
      const { data } = await axios.patch(`${APIs.ORDER.UPDATE_STATUS__id}${id}/status`, { status });
      return mapOrder(data.data as ApiOrder);
    },
    successMsg: "Order status updated",
    invalidateQueryKeys: [APIs.ORDER.GET, APIs.ORDER.GET__id],
    succssMsgVisibility: false,
  });
