import React from "react";
import { cn } from "@/lib/cn";

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn("rounded-box border border-base-300 bg-base-100 shadow-sm", className)} {...props}>
    {children}
  </div>
);

export default Card;
