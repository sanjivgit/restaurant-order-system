import axios from "axios";
import { Storage } from "./storage";
import ENV from "./config";
import { logoutUser } from "./helper";
import type { AuthUser } from "../redux/authSlice";

const instance = axios.create({
  baseURL: ENV.API_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

instance.interceptors.request.use(
  async function (config) {
    const user = await Storage.get<AuthUser>("auth_user");

    if (user?.token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error?.response?.status === 401) {
      logoutUser();
    }
    return Promise.reject(error);
  }
);

if (ENV.USE_MOCK_API) {
  // Swap NEXT_PUBLIC_USE_MOCK_API=false once a real backend exists —
  // every service hook keeps working unchanged since they only talk to `instance`.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { attachMockServer } = require("./mock/mock-server");
  attachMockServer(instance);
}

export default instance;
