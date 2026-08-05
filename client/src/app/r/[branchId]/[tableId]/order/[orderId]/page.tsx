"use client";

import { use } from "react";
import Link from "next/link";
import { Receipt } from "lucide-react";
import Spinner, { ErrorState } from "@/components/ui/Spinner";
import { PriceTag } from "@/components/common/Logo";
import OrderStatusTicket from "@/features/order/components/OrderStatusTicket";
import { useGetOrderDetail } from "@/features/order/services/order.service";

export default function OrderStatusPage({
  params,
}: {
  params: Promise<{ branchId: string; tableId: string; orderId: string }>;
}) {
  const { branchId, tableId, orderId } = use(params);
  const { data: order, isLoading, isError, refetch } = useGetOrderDetail(orderId, { refetchInterval: 5000 });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner label="Fetching your order…" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <ErrorState title="Order not found" description="We couldn't find that order." onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pt-4 pb-16 space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold">Order status</h1>
        <p className="text-sm text-base-content/50">This page refreshes automatically.</p>
      </div>

      <OrderStatusTicket orderNumber={order.orderNumber} tableNumber={order.tableNumber} status={order.status} />

      <div className="rounded-box border border-base-300 p-4 space-y-2">
        <p className="text-sm font-medium mb-1">Items ordered</p>
        {order.items.map((item) => (
          <div key={item.itemId} className="flex items-center justify-between text-sm">
            <span className="text-base-content/70">
              {item.qty} × {item.name}
            </span>
            <PriceTag amount={item.price * item.qty} className="text-base-content/70" />
          </div>
        ))}
        <div className="dashed-divider pt-2 flex items-center justify-between">
          <span className="font-medium">Total</span>
          <PriceTag amount={order.grandTotal} className="font-semibold" />
        </div>
      </div>

      <Link
        href={`/r/${branchId}/${tableId}/bill/${orderId}`}
        className="btn btn-outline w-full rounded-field gap-2"
      >
        <Receipt className="size-4" /> View bill
      </Link>
    </div>
  );
}
