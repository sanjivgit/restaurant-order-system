"use client";

import { use } from "react";
import { useEffect } from "react";
import CustomerHeader from "@/components/layout/CustomerHeader";
import Spinner from "@/components/ui/Spinner";
import { ErrorState } from "@/components/ui/Spinner";
import { useResolveDiningContext } from "@/features/menu/services/context.service";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setDiningContext } from "@/redux/contextSlice";

export default function CustomerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ branchId: string; tableId: string }>;
}) {
  const { branchId, tableId } = use(params);
  const dispatch = useAppDispatch();
  const dining = useAppSelector((s) => s.context.dining);

  const { data, isLoading, isError, refetch } = useResolveDiningContext({
    restaurantSlug: "spice-route",
    branchSlug: branchId,
    tableId,
  });

  useEffect(() => {
    if (data) dispatch(setDiningContext(data));
  }, [data, dispatch]);

  if (isLoading || !dining) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner label="Setting your table…" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorState
          title="Couldn't load this table"
          description="Please re-scan the QR code on your table, or try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <CustomerHeader
        baseHref={`/r/${branchId}/${tableId}`}
        branchName={dining.branchName}
        tableNumber={dining.tableNumber}
      />
      <div className="flex-1">{children}</div>
    </div>
  );
}
