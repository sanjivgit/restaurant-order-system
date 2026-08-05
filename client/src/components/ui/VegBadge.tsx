import React from "react";
import { cn } from "@/lib/cn";

const VegBadge: React.FC<{ isVeg: boolean; className?: string }> = ({ isVeg, className }) => (
  <span
    className={cn(
      "inline-flex items-center justify-center size-4 border-2 rounded-[3px] shrink-0",
      isVeg ? "border-success" : "border-error",
      className
    )}
    title={isVeg ? "Vegetarian" : "Non-vegetarian"}
    aria-label={isVeg ? "Vegetarian" : "Non-vegetarian"}
  >
    <span className={cn("size-1.5 rounded-full", isVeg ? "bg-success" : "bg-error")} />
  </span>
);

export default VegBadge;
