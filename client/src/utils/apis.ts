const APIs = {
  AUTH: {
    GUEST_TOKEN: "auth/guest/token", // POST { tableId, token? } — returns same token if valid, else issues a new one
    LOGIN: "auth/login", // POST { email, password }
    REFRESH: "auth/refresh", // POST { refreshToken }
  },
  RESTAURANT: {
    GET: "restaurants", // GET
    GET__id: "restaurants/", // GET /{restaurantId}
    CREATE: "restaurants", // POST { name, logo?, phone?, email?, gstNumber? }
    UPDATE__id: "restaurants/", // PATCH /{restaurantId}
    DELETE__id: "restaurants/", // DELETE /{restaurantId}
  },
  BRANCH: {
    GET: "branches", // GET ?restaurantId
    GET__id: "branches/", // GET /{branchId}
    CREATE: "branches", // POST { restaurantId, name, address?, phone?, status? }
    UPDATE__id: "branches/", // PATCH /{branchId}
    DELETE__id: "branches/", // DELETE /{branchId}
  },
  CATEGORY: {
    GET: "categories", // GET ?branchId (public)
    GET__id: "categories/", // GET /{categoryId}
    CREATE: "categories", // POST { branchId, name, isActive? }
    UPDATE__id: "categories/", // PATCH /{categoryId}
    DELETE__id: "categories/", // DELETE /{categoryId}
  },
  MENU: {
    GET: "menu-items", // GET ?branchId&categoryId&isVeg&isAvailable&search&page&limit (public)
    GET__id: "menu-items/", // GET /{itemId} (public)
    CREATE: "menu-items", // POST { branchId, categoryId, name, description?, image?, price, isVeg?, isAvailable? }
    UPDATE__id: "menu-items/", // PATCH /{itemId}
    DELETE__id: "menu-items/", // DELETE /{itemId}
  },
  TABLE: {
    GET: "tables", // GET ?branchId
    GET__id: "tables/", // GET /{tableId}
    CREATE: "tables", // POST { branchId, tableNumber, isActive? }
    UPDATE__id: "tables/", // PATCH /{tableId}
    DELETE__id: "tables/", // DELETE /{tableId}
  },
  ORDER: {
    CREATE: "orders", // POST (guest) { items: [{ menuItemId, quantity }] }
    GET: "orders", // GET ?branchId&tableId&status&page&limit (staff)
    MY: "orders/my", // GET (guest) — current guest's orders for their table
    GET__id: "orders/", // GET /{orderId} (guest/staff)
    UPDATE_STATUS__id: "orders/", // PATCH /{orderId}/status { status }
  },
  BILL: {
    GET__orderId: "bills/order/", // GET /{orderId}
  },
  EMPLOYEE: {
    ME: "employees/me", // GET (staff)
    GET: "employees", // GET ?branchId&page&limit&search (admin)
    GET__id: "employees/", // GET /{employeeId}
    CREATE: "employees", // POST { name, email, phone?, password, role, branchId?, status? }
    UPDATE__id: "employees/", // PATCH /{employeeId}
    DELETE__id: "employees/", // DELETE /{employeeId}
  },
  DASHBOARD: {
    ADMIN: "dashboard/admin", // GET ?branchId
    EMPLOYEE: "dashboard/employee", // GET ?branchId
  },
  HEALTH: {
    GET: "health",
  },
};

export default APIs;
