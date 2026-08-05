const APIs = {
  AUTH: {
    LOGIN: "auth/login/",
    LOGOUT: "auth/logout/",
    ME: "auth/me/",
  },
  CONTEXT: {
    RESOLVE_QR: "context/resolve/", // { restaurantSlug, branchSlug, tableId }
  },
  MENU: {
    CATEGORIES__GET: "menu/categories/",
    CATEGORIES__CREATE: "menu/categories/create/",
    CATEGORIES__UPDATE__id: "menu/categories/update/", // /{categoryId}
    CATEGORIES__DELETE__id: "menu/categories/delete/", // /{categoryId}

    ITEMS__GET: "menu/items/",
    ITEMS__CREATE: "menu/items/create/",
    ITEMS__UPDATE__id: "menu/items/update/", // /{itemId}
    ITEMS__DELETE__id: "menu/items/delete/", // /{itemId}
    ITEMS__AVAILABILITY__id: "menu/items/availability/", // /{itemId}
  },
  ORDER: {
    CREATE: "orders/create/",
    GET: "orders/",
    GET__id: "orders/", // /{orderId}
    UPDATE_STATUS__id: "orders/status/", // /{orderId}
    BILL__id: "orders/bill/", // /{orderId}
  },
  BRANCH: {
    GET: "branches/",
    CREATE: "branches/create/",
    UPDATE__id: "branches/update/", // /{branchId}
    DELETE__id: "branches/delete/", // /{branchId}
  },
  EMPLOYEE: {
    GET: "employees/",
    CREATE: "employees/create/",
    UPDATE__id: "employees/update/", // /{employeeId}
    DELETE__id: "employees/delete/", // /{employeeId}
  },
  DASHBOARD: {
    SUMMARY: "dashboard/summary/",
  },
};

export default APIs;
