"use client";

import { use } from "react";
import Link from "next/link";
import { ChevronRight, ShoppingBag } from "lucide-react";
import Spinner, { ErrorState } from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import { PriceTag } from "@/components/common/Logo";
import { ORDER_STATUS_BADGE, ORDER_STATUS_LABEL } from "@/utils/constants";
import { useGetMyOrders } from "@/features/order/services/order.service";
import { cn } from "@/lib/cn";

const formatTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export default function MyOrdersPage({
  params,
}: {
  params: Promise<{ branchId: string; tableId: string }>;
}) {
  const { branchId, tableId } = use(params);
  const { data: orders, isLoading, isError, refetch } = useGetMyOrders(tableId, {
    refetchInterval: 5000,
  });

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-16 space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold">My orders</h1>
        <p className="text-sm text-base-content/50">This page refreshes automatically.</p>
      </div>

      {isLoading && (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Spinner label="Fetching your orders…" />
        </div>
      )}

      {isError && (
        <ErrorState
          title="Orders didn't load"
          description="Something went wrong fetching your orders."
          onRetry={refetch}
        />
      )}

      {!isLoading && !isError && orders?.length === 0 && (
        <EmptyState
          title="No orders yet"
          description="Hungry? Browse the menu and place your first order."
          icon={<ShoppingBag className="size-6" />}
          action={
            <Link href={`/r/${branchId}/${tableId}/menu`} className="btn btn-primary btn-sm rounded-field">
              Browse menu
            </Link>
          }
        />
      )}

      {!isLoading && !isError && (orders?.length ?? 0) > 0 && (
        <ul className="space-y-3">
          {orders?.map((order) => (
            <li key={order.id}>
              <Link
                href={`/r/${branchId}/${tableId}/order/${order.id}`}
                className="block rounded-box border border-base-300 p-4 hover:border-primary/60 hover:shadow-sm transition"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-semibold">{order.orderNumber}</p>
                      <span
                        className={cn(
                          "badge badge-sm",
                          ORDER_STATUS_BADGE[order.status]
                        )}
                      >
                        {ORDER_STATUS_LABEL[order.status]}
                      </span>
                    </div>
                    <p className="text-xs text-base-content/50 mt-1">
                      {order.items.reduce((sum, i) => sum + i.qty, 0)} item
                      {order.items.reduce((sum, i) => sum + i.qty, 0) > 1 ? "s" : ""} · {formatTime(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <PriceTag amount={order.grandTotal} className="font-semibold text-sm" />
                    <ChevronRight className="size-4 text-base-content/40" />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
