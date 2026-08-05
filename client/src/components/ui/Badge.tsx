import React from "react";
import { cn } from "@/lib/cn";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "primary" | "success" | "warning" | "error" | "info" | "accent" | "outline";
}

const variantClass: Record<NonNullable<BadgeProps["variant"]>, string> = {
  neutral: "badge-neutral",
  primary: "badge-primary",
  success: "badge-success",
  warning: "badge-warning",
  error: "badge-error",
  info: "badge-info",
  accent: "badge-accent",
  outline: "badge-outline",
};

const Badge: React.FC<BadgeProps> = ({ variant = "neutral", className, children, ...props }) => (
  <span className={cn("badge font-medium", variantClass[variant], className)} {...props}>
    {children}
  </span>
);

export default Badge;
