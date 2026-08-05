const ENV = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || "https://api.example-restaurant.com/api/v1",
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "TableServe",
  USE_MOCK_API: process.env.NEXT_PUBLIC_USE_MOCK_API !== "false", // defaults to true until a real backend exists
  DEBUG: process.env.NODE_ENV !== "production",
};

export default ENV;
