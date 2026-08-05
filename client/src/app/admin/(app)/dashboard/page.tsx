"use client";

import { ClipboardList, Clock, ChefHat, BellRing, CheckCircle2, IndianRupee, Users } from "lucide-react";
import StatCard from "@/features/dashboard/components/StatCard";
import { useGetDashboardSummary } from "@/features/dashboard/services/dashboard.service";
import { useAppSelector } from "@/redux/hooks";
import { formatCurrency } from "@/utils/helper";

export default function AdminDashboardPage() {
  const activeBranch = useAppSelector((s) => s.context.activeBranch);
  const { data, isLoading } = useGetDashboardSummary(activeBranch?.id);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-base-content/50">
          {activeBranch ? `Live overview for ${activeBranch.name}` : "Live overview across your restaurant"}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total orders" value={data?.totalOrders ?? "—"} icon={<ClipboardList className="size-5" />} isLoading={isLoading} />
        <StatCard label="Pending" value={data?.pendingOrders ?? "—"} icon={<Clock className="size-5" />} isLoading={isLoading} accent="warning" />
        <StatCard label="Preparing" value={data?.preparingOrders ?? "—"} icon={<ChefHat className="size-5" />} isLoading={isLoading} accent="info" />
        <StatCard label="Ready" value={data?.readyOrders ?? "—"} icon={<BellRing className="size-5" />} isLoading={isLoading} accent="accent" />
        <StatCard label="Completed" value={data?.completedOrders ?? "—"} icon={<CheckCircle2 className="size-5" />} isLoading={isLoading} accent="success" />
        <StatCard
          label="Today's sales"
          value={data ? formatCurrency(data.todaysSales) : "—"}
          icon={<IndianRupee className="size-5" />}
          isLoading={isLoading}
        />
        <StatCard label="Active employees" value={data?.activeEmployees ?? "—"} icon={<Users className="size-5" />} isLoading={isLoading} />
      </div>
    </div>
  );
}
