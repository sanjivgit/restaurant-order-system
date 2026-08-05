"use client";

import { useMemo, useState } from "react";
import { ClipboardList } from "lucide-react";
import SearchBar from "@/components/ui/SearchBar";
import Select from "@/components/ui/Select";
import Pagination from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/Spinner";
import Skeleton from "@/components/ui/Skeleton";
import OrderCard from "@/features/order/components/OrderCard";
import { useGetOrders } from "@/features/order/services/order.service";
import { useAppSelector } from "@/redux/hooks";
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABEL } from "@/utils/constants";
import type { OrderStatus } from "@/types";

const PAGE_SIZE = 6;

export default function AdminOrdersPage() {
  const activeBranch = useAppSelector((s) => s.context.activeBranch);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [page, setPage] = useState(1);

  const {
    data: orders,
    isLoading,
    isError,
    refetch,
  } = useGetOrders(
    { branchId: activeBranch?.id, status: status || undefined, search: search || undefined },
    { refetchInterval: 10000 }
  );

  const totalPages = Math.max(1, Math.ceil((orders?.length ?? 0) / PAGE_SIZE));
  const paginated = useMemo(
    () => orders?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) ?? [],
    [orders, page]
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold">Orders</h1>
        <p className="text-sm text-base-content/50">
          {activeBranch ? `All orders for ${activeBranch.name}` : "All orders"}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search by order # or table…"
          className="sm:max-w-xs"
        />
        <Select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as OrderStatus | "");
            setPage(1);
          }}
          options={ORDER_STATUS_FLOW.map((s) => ({ label: ORDER_STATUS_LABEL[s], value: s }))}
          placeholder="All statuses"
          className="sm:max-w-[200px]"
        />
      </div>

      {isLoading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56" />
          ))}
        </div>
      )}

      {isError && <ErrorState title="Couldn't load orders" onRetry={refetch} />}

      {!isLoading && !isError && paginated.length === 0 && (
        <EmptyState
          title="No orders found"
          description="Try adjusting your search or filters."
          icon={<ClipboardList className="size-6" />}
        />
      )}

      {!isLoading && paginated.length > 0 && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map((order) => (
              <OrderCard key={order.id} order={order} canAdvance={order.status !== "COMPLETED"} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
