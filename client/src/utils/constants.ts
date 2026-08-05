import type { OrderStatus } from "../types";

export const ORDER_STATUS_FLOW: OrderStatus[] = ["PENDING", "PREPARING", "READY", "SERVED", "COMPLETED"];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Pending",
  PREPARING: "Preparing",
  READY: "Ready",
  SERVED: "Served",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const ORDER_STATUS_BADGE: Record<OrderStatus, string> = {
  PENDING: "badge-warning",
  PREPARING: "badge-info",
  READY: "badge-accent",
  SERVED: "badge-success",
  COMPLETED: "badge-neutral",
  CANCELLED: "badge-error",
};

export const TAX_RATE = 0.05;

export const EMPLOYEE_ROLES = ["EMPLOYEE", "ADMIN"] as const;
