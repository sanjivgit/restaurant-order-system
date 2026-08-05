import MockAdapter from "axios-mock-adapter";
import type { AxiosInstance } from "axios";
import { db, Order, OrderStatus, MenuCategory, MenuItem, Branch, Employee } from "./db";

// Simulates a real backend on top of the shared axios instance so every
// service hook (useQuery / useMutation) works exactly as it will once a
// real API is wired up — only ENV.USE_MOCK_API needs to flip later.

let uid = 100;
const nextId = (prefix: string) => `${prefix}_${uid++}`;

export function attachMockServer(instance: AxiosInstance) {
  const mock = new MockAdapter(instance, { delayResponse: 500 });

  // ---------- CONTEXT (QR resolve) ----------
  mock.onGet(/context\/resolve\//).reply((config) => {
    const { restaurantSlug, branchSlug, tableId } = config.params || {};
    const branch = db.branches.find((b) => b.id === branchSlug) || db.branches[0];
    return [
      200,
      {
        data: {
          restaurantId: db.restaurant.id,
          restaurantName: db.restaurant.name,
          branchId: branch.id,
          branchName: branch.name,
          tableId: tableId || "T-01",
          tableNumber: tableId || "T-01",
        },
      },
    ];
  });

  // ---------- AUTH ----------
  mock.onPost("auth/login/").reply((config) => {
    const body = JSON.parse(config.data);
    if (body.role === "ADMIN") {
      if (body.email === db.admin.email && body.password === db.admin.password) {
        return [200, { data: { id: db.admin.id, name: db.admin.name, email: db.admin.email, role: "ADMIN", token: "mock-admin-token" } }];
      }
    } else {
      const emp = db.employees.find((e) => e.email === body.email && e.password === body.password);
      if (emp) {
        return [200, { data: { id: emp.id, name: emp.name, email: emp.email, role: "EMPLOYEE", branchId: emp.branchId, token: `mock-emp-token-${emp.id}` } }];
      }
    }
    return [401, { message: "Invalid email or password" }];
  });

  // ---------- MENU CATEGORIES ----------
  mock.onGet("menu/categories/").reply((config) => {
    const branchId = config.params?.branchId;
    const list = branchId ? db.categories.filter((c) => c.branchId === branchId) : db.categories;
    return [200, { data: [...list].sort((a, b) => a.sortOrder - b.sortOrder) }];
  });

  mock.onPost("menu/categories/create/").reply((config) => {
    const body = JSON.parse(config.data);
    const category: MenuCategory = { id: nextId("cat"), sortOrder: db.categories.length + 1, ...body };
    db.categories.push(category);
    return [201, { data: category }];
  });

  mock.onPost(/menu\/categories\/update\/.+/).reply((config) => {
    const id = config.url!.split("/").pop()!;
    const body = JSON.parse(config.data);
    const idx = db.categories.findIndex((c) => c.id === id);
    if (idx === -1) return [404, { message: "Category not found" }];
    db.categories[idx] = { ...db.categories[idx], ...body };
    return [200, { data: db.categories[idx] }];
  });

  mock.onPost(/menu\/categories\/delete\/.+/).reply((config) => {
    const id = config.url!.split("/").pop()!;
    db.categories = db.categories.filter((c) => c.id !== id);
    db.items = db.items.filter((i) => i.categoryId !== id);
    return [200, { data: { id } }];
  });

  // ---------- MENU ITEMS ----------
  mock.onGet("menu/items/").reply((config) => {
    const { branchId, categoryId, search } = config.params || {};
    let list = db.items;
    if (branchId) list = list.filter((i) => i.branchId === branchId);
    if (categoryId) list = list.filter((i) => i.categoryId === categoryId);
    if (search) list = list.filter((i) => i.name.toLowerCase().includes(String(search).toLowerCase()));
    return [200, { data: list }];
  });

  mock.onPost("menu/items/create/").reply((config) => {
    const body = JSON.parse(config.data);
    const item: MenuItem = { id: nextId("itm"), isAvailable: true, ...body };
    db.items.push(item);
    return [201, { data: item }];
  });

  mock.onPost(/menu\/items\/update\/.+/).reply((config) => {
    const id = config.url!.split("/").pop()!;
    const body = JSON.parse(config.data);
    const idx = db.items.findIndex((i) => i.id === id);
    if (idx === -1) return [404, { message: "Item not found" }];
    db.items[idx] = { ...db.items[idx], ...body };
    return [200, { data: db.items[idx] }];
  });

  mock.onPost(/menu\/items\/delete\/.+/).reply((config) => {
    const id = config.url!.split("/").pop()!;
    db.items = db.items.filter((i) => i.id !== id);
    return [200, { data: { id } }];
  });

  mock.onPost(/menu\/items\/availability\/.+/).reply((config) => {
    const id = config.url!.split("/").pop()!;
    const body = JSON.parse(config.data);
    const idx = db.items.findIndex((i) => i.id === id);
    if (idx === -1) return [404, { message: "Item not found" }];
    db.items[idx].isAvailable = body.isAvailable;
    return [200, { data: db.items[idx] }];
  });

  // ---------- ORDERS ----------
  mock.onPost("orders/create/").reply((config) => {
    const body = JSON.parse(config.data);
    const totalAmount = body.items.reduce((sum: number, i: any) => sum + i.price * i.qty, 0);
    const tax = +(totalAmount * 0.05).toFixed(2);
    const order: Order = {
      id: nextId("ord"),
      orderNumber: `#${nextId("ORD")}`,
      branchId: body.branchId,
      tableNumber: body.tableNumber,
      items: body.items,
      status: "PENDING",
      totalAmount,
      tax,
      grandTotal: +(totalAmount + tax).toFixed(2),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.orders.unshift(order);
    return [201, { data: order }];
  });

  mock.onGet("orders/").reply((config) => {
    const { branchId, status, search } = config.params || {};
    let list = db.orders;
    if (branchId) list = list.filter((o) => o.branchId === branchId);
    if (status) list = list.filter((o) => o.status === status);
    if (search) {
      const s = String(search).toLowerCase();
      list = list.filter((o) => o.orderNumber.toLowerCase().includes(s) || o.tableNumber.toLowerCase().includes(s));
    }
    return [200, { data: [...list].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)) }];
  });

  mock.onGet(/orders\/(?!bill).+/).reply((config) => {
    const id = config.url!.split("/").pop()!;
    const order = db.orders.find((o) => o.id === id);
    if (!order) return [404, { message: "Order not found" }];
    return [200, { data: order }];
  });

  mock.onPost(/orders\/status\/.+/).reply((config) => {
    const id = config.url!.split("/").pop()!;
    const body = JSON.parse(config.data) as { status: OrderStatus };
    const idx = db.orders.findIndex((o) => o.id === id);
    if (idx === -1) return [404, { message: "Order not found" }];
    db.orders[idx].status = body.status;
    db.orders[idx].updatedAt = new Date().toISOString();
    return [200, { data: db.orders[idx] }];
  });

  mock.onGet(/orders\/bill\/.+/).reply((config) => {
    const id = config.url!.split("/").pop()!;
    const order = db.orders.find((o) => o.id === id);
    if (!order) return [404, { message: "Order not found" }];
    return [200, { data: order }];
  });

  // ---------- BRANCHES ----------
  mock.onGet("branches/").reply(() => [200, { data: db.branches }]);

  mock.onPost("branches/create/").reply((config) => {
    const body = JSON.parse(config.data);
    const branch: Branch = { id: nextId("br"), restaurantId: db.restaurant.id, isActive: true, ...body };
    db.branches.push(branch);
    return [201, { data: branch }];
  });

  mock.onPost(/branches\/update\/.+/).reply((config) => {
    const id = config.url!.split("/").pop()!;
    const body = JSON.parse(config.data);
    const idx = db.branches.findIndex((b) => b.id === id);
    if (idx === -1) return [404, { message: "Branch not found" }];
    db.branches[idx] = { ...db.branches[idx], ...body };
    return [200, { data: db.branches[idx] }];
  });

  mock.onPost(/branches\/delete\/.+/).reply((config) => {
    const id = config.url!.split("/").pop()!;
    db.branches = db.branches.filter((b) => b.id !== id);
    return [200, { data: { id } }];
  });

  // ---------- EMPLOYEES ----------
  mock.onGet("employees/").reply((config) => {
    const branchId = config.params?.branchId;
    const list = branchId ? db.employees.filter((e) => e.branchId === branchId) : db.employees;
    return [200, { data: list }];
  });

  mock.onPost("employees/create/").reply((config) => {
    const body = JSON.parse(config.data);
    const employee: Employee = { id: nextId("emp"), isActive: true, ...body };
    db.employees.push(employee);
    return [201, { data: employee }];
  });

  mock.onPost(/employees\/update\/.+/).reply((config) => {
    const id = config.url!.split("/").pop()!;
    const body = JSON.parse(config.data);
    const idx = db.employees.findIndex((e) => e.id === id);
    if (idx === -1) return [404, { message: "Employee not found" }];
    db.employees[idx] = { ...db.employees[idx], ...body };
    return [200, { data: db.employees[idx] }];
  });

  mock.onPost(/employees\/delete\/.+/).reply((config) => {
    const id = config.url!.split("/").pop()!;
    db.employees = db.employees.filter((e) => e.id !== id);
    return [200, { data: { id } }];
  });

  // ---------- DASHBOARD ----------
  mock.onGet("dashboard/summary/").reply((config) => {
    const branchId = config.params?.branchId;
    const orders = branchId ? db.orders.filter((o) => o.branchId === branchId) : db.orders;
    const employees = branchId ? db.employees.filter((e) => e.branchId === branchId) : db.employees;
    const today = new Date().toDateString();
    const todaysSales = orders
      .filter((o) => new Date(o.createdAt).toDateString() === today && o.status === "COMPLETED")
      .reduce((sum, o) => sum + o.grandTotal, 0);

    return [
      200,
      {
        data: {
          totalOrders: orders.length,
          pendingOrders: orders.filter((o) => o.status === "PENDING").length,
          preparingOrders: orders.filter((o) => o.status === "PREPARING").length,
          readyOrders: orders.filter((o) => o.status === "READY").length,
          completedOrders: orders.filter((o) => o.status === "COMPLETED").length,
          todaysSales,
          activeEmployees: employees.filter((e) => e.isActive).length,
        },
      },
    ];
  });

  return mock;
}
