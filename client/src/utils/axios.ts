import axios, { AxiosRequestConfig } from "axios";
import { Storage } from "./storage";
import ENV from "./config";
import APIs from "./apis";
import { logoutUser } from "./helper";
import type { AuthUser } from "../redux/authSlice";

type AppAxiosConfig = AxiosRequestConfig & { _retry?: boolean; _guestAuth?: boolean };

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

const getStoredGuestToken = async (): Promise<string | null> => {
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
    // Guest-scoped requests always use the guest token (never a staff auth_user token).
    if ((config as AppAxiosConfig)._guestAuth) {
      const guestToken = await getStoredGuestToken();
      if (guestToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${guestToken}`;
      }
      return config;
    }

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
    const original = error?.config as AppAxiosConfig | undefined;
    const status = error?.response?.status;
    const isGuest = original?._guestAuth === true;

    // Guest requests manage their own short-lived token; staff refresh doesn't apply.
    if (status === 401 && original && !original._retry && !isGuest) {
      original._retry = true;
      const token = await refreshAccessToken();
      if (token) {
        original.headers = { ...original.headers, Authorization: `Bearer ${token}` };
        return instance(original);
      }
    }

    if (status === 401 && !isGuest) {
      // Only sign out staff sessions. Guest sessions rely on the stored guest
      // token, which is re-validated/re-issued via the guest token API before
      // each guest request, so we must not wipe it here.
      const user = await Storage.get<AuthUser>("auth_user");
      if (user?.token) {
        await logoutUser();
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
