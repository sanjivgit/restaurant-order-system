import type { AxiosRequestConfig } from "axios";
import axios from "@/utils/axios";
import APIs from "@/utils/apis";
import { Storage } from "@/utils/storage";

export interface GuestTokenData {
  guestToken: string;
  expiresIn: string;
  branchId: string;
  tableId: string;
}

export interface GuestAuthConfig extends AxiosRequestConfig {
  /** Marks the request as guest-scoped so the axios layer uses the guest token. */
  _guestAuth?: boolean;
}

export const GUEST_TOKEN_KEY = "guest_token";

export const getStoredGuestToken = async (): Promise<string | null> => {
  const guest = await Storage.get<{ guestToken: string }>(GUEST_TOKEN_KEY);
  return guest?.guestToken ?? null;
};

/**
 * Ensures a valid short-lived guest token exists for the given table and
 * stores it in localStorage.
 *
 * - No token yet -> the backend issues a new one.
 * - Stored token still valid for this table -> the backend returns the SAME
 *   token (no new session), which we store back and reuse.
 * - Stored token expired/invalid/for a different table -> the backend issues
 *   a fresh token, which we store and use.
 */
export const getGuestTokenData = async (tableId?: string): Promise<GuestTokenData | null> => {
  if (!tableId) return null;

  const existing = await getStoredGuestToken();
  const config: GuestAuthConfig = { _guestAuth: true };
  const { data } = await axios.post(
    APIs.AUTH.GUEST_TOKEN,
    {
      tableId,
      token: existing ?? undefined,
    },
    config
  );

  const tokenData = data.data as GuestTokenData;
  await Storage.set(GUEST_TOKEN_KEY, { guestToken: tokenData.guestToken });
  return tokenData;
};

/**
 * Returns axios config that forces the guest token (not any staff auth_user
 * token) to be used for the request. The token is validated/re-issued first.
 */
export const getGuestAuthConfig = async (tableId?: string): Promise<GuestAuthConfig> => {
  const tokenData = await getGuestTokenData(tableId);
  if (!tokenData?.guestToken) return {};

  return {
    _guestAuth: true,
    headers: { Authorization: `Bearer ${tokenData.guestToken}` },
  };
};
