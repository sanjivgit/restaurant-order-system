export type OrderStatus = "PENDING" | "ACCEPTED" | "PREPARING" | "READY" | "SERVED" | "COMPLETED" | "CANCELLED";

export interface MenuCategory {
  id: string;
  name: string;
  branchId: string;
  isActive: boolean;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  branchId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isVeg: boolean;
  isAvailable: boolean;
}

export interface Branch {
  id: string;
  restaurantId: string;
  name: string;
  address: string;
  phone?: string;
  status?: "ACTIVE" | "INACTIVE";
  isActive: boolean;
}

export interface Employee {
  id: string;
  employeeCode?: string;
  name: string;
  email: string;
  phone: string;
  branchId: string;
  role: "ADMIN" | "EMPLOYEE";
  status?: "ACTIVE" | "INACTIVE";
  isActive: boolean;
  password?: string;
}

export interface OrderItem {
  itemId: string;
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  branchId: string;
  tableNumber: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  tax: number;
  grandTotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface Table {
  id: string;
  branchId: string;
  tableNumber: string;
  qrCodeUrl?: string;
  isActive: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  logo?: string;
  phone?: string;
  email?: string;
  gstNumber?: string;
}

export interface Bill {
  id: string;
  orderId: string;
  subtotal: number;
  tax: number;
  discount: number;
  grandTotal: number;
  createdAt: string;
}
