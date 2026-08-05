import React from "react";
import { cn } from "@/lib/cn";

const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("animate-pulse rounded-field bg-base-300/70", className)} {...props} />
);

export const MenuCardSkeleton: React.FC = () => (
  <div className="rounded-box border border-base-300 overflow-hidden">
    <Skeleton className="h-32 w-full rounded-none" />
    <div className="p-3 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  </div>
);

export default Skeleton;
