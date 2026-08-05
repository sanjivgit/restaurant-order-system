const ENV = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1",
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "TableServe",
  DEBUG: process.env.NODE_ENV !== "production",
};

export default ENV;
