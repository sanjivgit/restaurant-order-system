import React from "react";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";

const StatCard: React.FC<{
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  isLoading?: boolean;
  accent?: "primary" | "success" | "warning" | "info" | "accent";
}> = ({ label, value, icon, isLoading, accent = "primary" }) => {
  const accentClass = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    info: "bg-info/10 text-info",
    accent: "bg-accent/10 text-accent",
  }[accent];

  return (
    <Card className="p-4 flex items-center gap-3">
      <div className={cn("size-10 rounded-field flex items-center justify-center shrink-0", accentClass)}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-base-content/50">{label}</p>
        {isLoading ? (
          <Skeleton className="h-6 w-16 mt-1" />
        ) : (
          <p className="font-mono text-xl font-semibold leading-tight">{value}</p>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
