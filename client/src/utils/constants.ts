import type { OrderStatus, OrderTimeSlot } from "../types";

export const ORDER_STATUS_FLOW: OrderStatus[] = ["PENDING", "ACCEPTED", "PREPARING", "READY", "SERVED", "COMPLETED"];

export const ORDER_TIME_SLOT_FLOW: OrderTimeSlot[] = ["ALL", "MORNING", "EVENING"];

export const ORDER_TIME_SLOT_LABEL: Record<OrderTimeSlot, string> = {
  ALL: "All",
  MORNING: "6:00 AM - 2:00 PM",
  EVENING: "2:00 PM - 12:00 AM",
};

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  PREPARING: "Preparing",
  READY: "Ready",
  SERVED: "Served",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const ORDER_STATUS_BADGE: Record<OrderStatus, string> = {
  PENDING: "badge-warning",
  ACCEPTED: "badge-primary",
  PREPARING: "badge-info",
  READY: "badge-accent",
  SERVED: "badge-success",
  COMPLETED: "badge-neutral",
  CANCELLED: "badge-error",
};

export const TAX_RATE = 0.05;

export const EMPLOYEE_ROLES = ["EMPLOYEE", "ADMIN"] as const;
