import dayjs from "dayjs";
import { logout } from "../redux/authSlice";
import { store } from "../redux/store";
import { Storage } from "./storage";

export const logoutUser = async () => {
  try {
    await Storage.clear();
    store.dispatch(logout());
  } catch (e) {
    console.log("Logout error:", e);
  }
};

export const formatSmartDate = (date: string | Date) => {
  const d = dayjs(date);

  if (d.isSame(dayjs(), "day")) return `Today, ${d.format("h:mm A")}`;
  if (d.isSame(dayjs().subtract(1, "day"), "day")) return `Yesterday, ${d.format("h:mm A")}`;

  return d.format("DD MMM, h:mm A");
};

export const formatCurrency = (amount: number, currency = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

export const removeEmptyFields = (obj: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== "" && value !== null && value !== undefined
    )
  );
};

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export const generateOrderNumber = () => {
  const now = dayjs();
  return `#${now.format("DDMM")}-${Math.floor(1000 + Math.random() * 9000)}`;
};
