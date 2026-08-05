import React from "react";
import { UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatCurrency } from "@/utils/helper";

export const Logo: React.FC<{ className?: string; showName?: boolean }> = ({ className, showName = true }) => (
  <div className={cn("flex items-center gap-2", className)}>
    <span className="flex items-center justify-center size-8 rounded-field bg-primary text-primary-content">
      <UtensilsCrossed className="size-4" />
    </span>
    {showName && <span className="font-display font-semibold text-lg tracking-tight">TableServe</span>}
  </div>
);

export const PriceTag: React.FC<{ amount: number; className?: string }> = ({ amount, className }) => (
  <span className={cn("font-mono tabular-nums", className)}>{formatCurrency(amount)}</span>
);
