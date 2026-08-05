"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/Spinner";
import Skeleton from "@/components/ui/Skeleton";
import OrderCard from "@/features/order/components/OrderCard";
import { useGetOrders } from "@/features/order/services/order.service";
import { useAppSelector } from "@/redux/hooks";
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABEL } from "@/utils/constants";
import type { OrderStatus } from "@/types";
import { cn } from "@/lib/cn";

export default function EmployeeDashboardPage() {
  const user = useAppSelector((s) => s.auth.user);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | null>(null);

  const {
    data: orders,
    isLoading,
    isError,
    refetch,
  } = useGetOrders(
    { branchId: user?.branchId, status: statusFilter ?? undefined },
    { refetchInterval: 8000 }
  );

  const activeStatuses = ORDER_STATUS_FLOW.filter((s) => s !== "COMPLETED");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold">Live orders</h1>
        <p className="text-sm text-base-content/50">Auto-refreshes every few seconds.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setStatusFilter(null)}
          className={cn(
            "shrink-0 px-4 py-1.5 rounded-field text-sm font-medium border",
            statusFilter === null ? "bg-primary text-primary-content border-primary" : "border-base-300 hover:bg-base-100"
          )}
        >
          All active
        </button>
        {activeStatuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={cn(
              "shrink-0 px-4 py-1.5 rounded-field text-sm font-medium border",
              statusFilter === s ? "bg-primary text-primary-content border-primary" : "border-base-300 hover:bg-base-100"
            )}
          >
            {ORDER_STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-56" />
          ))}
        </div>
      )}

      {isError && <ErrorState title="Couldn't load orders" onRetry={refetch} />}

      {!isLoading && !isError && (orders?.length ?? 0) === 0 && (
        <EmptyState
          title="No orders right now"
          description="New orders from tables will show up here."
          icon={<ClipboardList className="size-6" />}
        />
      )}

      {!isLoading && orders && orders.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders
            .filter((o) => statusFilter || o.status !== "COMPLETED")
            .map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
        </div>
      )}
    </div>
  );
}
