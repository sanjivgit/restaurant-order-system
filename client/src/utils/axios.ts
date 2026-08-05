import axios, { AxiosRequestConfig } from "axios";
import { Storage } from "./storage";
import ENV from "./config";
import APIs from "./apis";
import { logoutUser } from "./helper";
import type { AuthUser } from "../redux/authSlice";

const instance = axios.create({
  baseURL: ENV.API_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

const getAuthToken = async (): Promise<string | null> => {
  const user = await Storage.get<AuthUser>("auth_user");
  if (user?.token) return user.token;

  const guest = await Storage.get<{ guestToken: string }>("guest_token");
  return guest?.guestToken ?? null;
};

let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const user = await Storage.get<AuthUser>("auth_user");
    if (!user?.refreshToken) return null;

    try {
      const { data } = await axios.post(`${ENV.API_URL}/${APIs.AUTH.REFRESH}`, {
        refreshToken: user.refreshToken,
      });
      const auth = data?.data;
      if (!auth?.accessToken) return null;

      const updated: AuthUser = {
        ...user,
        token: auth.accessToken,
        refreshToken: auth.refreshToken ?? user.refreshToken,
      };
      await Storage.set("auth_user", updated);
      return auth.accessToken;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

instance.interceptors.request.use(
  async function (config) {
    const token = await getAuthToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
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
  async function (error) {
    const original = error?.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;
    const status = error?.response?.status;

    if (status === 401 && original && !original._retry) {
      original._retry = true;
      const token = await refreshAccessToken();
      if (token) {
        original.headers = { ...original.headers, Authorization: `Bearer ${token}` };
        return instance(original);
      }
    }

    if (status === 401) {
      await logoutUser();
    }
    return Promise.reject(error);
  }
);

export default instance;
