"use client";

import { use } from "react";
import { Printer } from "lucide-react";
import Spinner, { ErrorState } from "@/components/ui/Spinner";
import { PriceTag } from "@/components/common/Logo";
import { formatSmartDate } from "@/utils/helper";
import { useGetBill } from "@/features/order/services/order.service";
import ENV from "@/utils/config";

export default function BillPage({
  params,
}: {
  params: Promise<{ branchId: string; tableId: string; orderId: string }>;
}) {
  const { branchId, tableId, orderId } = use(params);
  const { data: order, isLoading, isError, refetch } = useGetBill(orderId, tableId);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner label="Preparing your bill…" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <ErrorState title="Bill not found" onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-6 pb-16">
      <div className="ticket-edge rounded-box border border-base-300 bg-base-100 shadow-sm overflow-hidden">
        <div className="px-6 pt-6 pb-4 text-center">
          <p className="font-display font-semibold text-lg">{ENV.APP_NAME}</p>
          <p className="text-xs text-base-content/50">{formatSmartDate(order.createdAt)}</p>
        </div>

        <div className="ticket-perforation" />

        <div className="px-6 py-5">
          <div className="flex items-center justify-between text-xs font-mono text-base-content/60 mb-4">
            <span>{order.orderNumber}</span>
            <span>Table {order.tableNumber}</span>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_auto_auto] gap-2 text-xs uppercase tracking-wide text-base-content/40 pb-1 dashed-divider">
              <span className="pt-2">Item</span>
              <span className="pt-2">Qty</span>
              <span className="pt-2 text-right">Amount</span>
            </div>
            {order.items.map((item) => (
              <div key={item.itemId} className="grid grid-cols-[1fr_auto_auto] gap-2 text-sm">
                <span>{item.name}</span>
                <span className="font-mono text-center">{item.qty}</span>
                <PriceTag amount={item.price * item.qty} className="text-right" />
              </div>
            ))}
          </div>

          <div className="dashed-divider mt-4 pt-3 space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-base-content/60">Subtotal</span>
              <PriceTag amount={order.totalAmount} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-base-content/60">Tax</span>
              <PriceTag amount={order.tax} />
            </div>
            <div className="flex items-center justify-between font-semibold text-base pt-1">
              <span>Grand total</span>
              <PriceTag amount={order.grandTotal} />
            </div>
          </div>
        </div>

        <div className="ticket-perforation" />

        <div className="px-6 py-4 text-center">
          <p className="text-xs text-base-content/40">Thank you for dining with us</p>
        </div>
      </div>

      <button onClick={() => window.print()} className="btn btn-outline w-full rounded-field gap-2 mt-4 no-print">
        <Printer className="size-4" /> Print bill
      </button>
    </div>
  );
}
