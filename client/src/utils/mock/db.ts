// In-memory mock database. Swap out for real API calls by setting
// NEXT_PUBLIC_USE_MOCK_API=false once a backend exists — no other code changes needed.

export type OrderStatus = "PENDING" | "PREPARING" | "READY" | "SERVED" | "COMPLETED";

export interface MenuCategory {
  id: string;
  name: string;
  branchId: string;
  sortOrder: number;
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
  isActive: boolean;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  branchId: string;
  role: "WAITER" | "CHEF" | "CASHIER";
  isActive: boolean;
  password?: string;
}

export interface OrderItem {
  itemId: string;
  name: string;
  price: number;
  qty: number;
  note?: string;
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

const RESTAURANT = { id: "rst_1", name: "Spice Route Kitchen" };

const BRANCHES: Branch[] = [
  { id: "br_1", restaurantId: "rst_1", name: "Koramangala", address: "80 Ft Rd, Koramangala, Bengaluru", isActive: true },
  { id: "br_2", restaurantId: "rst_1", name: "Indiranagar", address: "100 Ft Rd, Indiranagar, Bengaluru", isActive: true },
];

const CATEGORIES: MenuCategory[] = [
  { id: "cat_1", name: "Starters", branchId: "br_1", sortOrder: 1 },
  { id: "cat_2", name: "Main Course", branchId: "br_1", sortOrder: 2 },
  { id: "cat_3", name: "Breads", branchId: "br_1", sortOrder: 3 },
  { id: "cat_4", name: "Desserts", branchId: "br_1", sortOrder: 4 },
  { id: "cat_5", name: "Beverages", branchId: "br_1", sortOrder: 5 },
];

const ITEMS: MenuItem[] = [
  { id: "itm_1", categoryId: "cat_1", branchId: "br_1", name: "Paneer Tikka", description: "Chargrilled cottage cheese marinated in smoked spices.", price: 249, image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400", isVeg: true, isAvailable: true },
  { id: "itm_2", categoryId: "cat_1", branchId: "br_1", name: "Chicken 65", description: "Deep-fried chicken tossed in curry leaves and red chilli.", price: 289, image: "https://images.unsplash.com/photo-1610057099431-d73a1c9d8151?w=400", isVeg: false, isAvailable: true },
  { id: "itm_3", categoryId: "cat_1", branchId: "br_1", name: "Veg Seekh Kebab", description: "Skewered mixed vegetable kebabs, tandoor roasted.", price: 219, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400", isVeg: true, isAvailable: true },
  { id: "itm_4", categoryId: "cat_2", branchId: "br_1", name: "Butter Chicken", description: "Tandoori chicken simmered in a velvety tomato gravy.", price: 349, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400", isVeg: false, isAvailable: true },
  { id: "itm_5", categoryId: "cat_2", branchId: "br_1", name: "Paneer Butter Masala", description: "Cottage cheese cubes in a rich cashew tomato gravy.", price: 299, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400", isVeg: true, isAvailable: true },
  { id: "itm_6", categoryId: "cat_2", branchId: "br_1", name: "Dal Makhani", description: "Slow-cooked black lentils finished with cream.", price: 259, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400", isVeg: true, isAvailable: true },
  { id: "itm_7", categoryId: "cat_2", branchId: "br_1", name: "Hyderabadi Biryani", description: "Fragrant basmati rice layered with spiced mutton.", price: 379, image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400", isVeg: false, isAvailable: false },
  { id: "itm_8", categoryId: "cat_3", branchId: "br_1", name: "Butter Naan", description: "Leavened flatbread brushed with butter.", price: 59, image: "https://images.unsplash.com/photo-1633504581786-316c8002b1b9?w=400", isVeg: true, isAvailable: true },
  { id: "itm_9", categoryId: "cat_3", branchId: "br_1", name: "Garlic Roti", description: "Whole wheat flatbread topped with garlic.", price: 65, image: "https://images.unsplash.com/photo-1619221882161-90c07de5c7d3?w=400", isVeg: true, isAvailable: true },
  { id: "itm_10", categoryId: "cat_4", branchId: "br_1", name: "Gulab Jamun", description: "Warm milk dumplings soaked in rose-cardamom syrup.", price: 129, image: "https://images.unsplash.com/photo-1601050690597-9d0d4e64e5e5?w=400", isVeg: true, isAvailable: true },
  { id: "itm_11", categoryId: "cat_5", branchId: "br_1", name: "Masala Chaas", description: "Spiced buttermilk with roasted cumin.", price: 79, image: "https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=400", isVeg: true, isAvailable: true },
  { id: "itm_12", categoryId: "cat_5", branchId: "br_1", name: "Fresh Lime Soda", description: "Sweet, salted or plain — your call.", price: 89, image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400", isVeg: true, isAvailable: true },
];

const EMPLOYEES: Employee[] = [
  { id: "emp_1", name: "Ravi Kumar", email: "ravi@tableserve.app", phone: "9876500001", branchId: "br_1", role: "WAITER", isActive: true, password: "password" },
  { id: "emp_2", name: "Ananya Rao", email: "ananya@tableserve.app", phone: "9876500002", branchId: "br_1", role: "CHEF", isActive: true, password: "password" },
  { id: "emp_3", name: "Suresh Iyer", email: "suresh@tableserve.app", phone: "9876500003", branchId: "br_2", role: "CASHIER", isActive: false, password: "password" },
];

const ADMIN = { id: "adm_1", name: "Meera Nair", email: "admin@tableserve.app", password: "password" };

const now = () => new Date().toISOString();

const ORDERS: Order[] = [
  {
    id: "ord_1", orderNumber: "#0308-4821", branchId: "br_1", tableNumber: "T-04",
    items: [
      { itemId: "itm_4", name: "Butter Chicken", price: 349, qty: 1 },
      { itemId: "itm_8", name: "Butter Naan", price: 59, qty: 3 },
    ],
    status: "PREPARING", totalAmount: 526, tax: 26.3, grandTotal: 552.3,
    createdAt: now(), updatedAt: now(),
  },
  {
    id: "ord_2", orderNumber: "#0308-4822", branchId: "br_1", tableNumber: "T-07",
    items: [
      { itemId: "itm_1", name: "Paneer Tikka", price: 249, qty: 1 },
      { itemId: "itm_5", name: "Paneer Butter Masala", price: 299, qty: 1 },
      { itemId: "itm_9", name: "Garlic Roti", price: 65, qty: 2 },
    ],
    status: "PENDING", totalAmount: 678, tax: 33.9, grandTotal: 711.9,
    createdAt: now(), updatedAt: now(),
  },
  {
    id: "ord_3", orderNumber: "#0308-4815", branchId: "br_1", tableNumber: "T-02",
    items: [{ itemId: "itm_10", name: "Gulab Jamun", price: 129, qty: 2 }],
    status: "COMPLETED", totalAmount: 258, tax: 12.9, grandTotal: 270.9,
    createdAt: now(), updatedAt: now(),
  },
];

export const db = {
  restaurant: RESTAURANT,
  branches: BRANCHES,
  categories: CATEGORIES,
  items: ITEMS,
  employees: EMPLOYEES,
  admin: ADMIN,
  orders: ORDERS,
};
