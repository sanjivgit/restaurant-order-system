import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Storage } from "../utils/storage";

export type UserRole = "EMPLOYEE" | "ADMIN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
  refreshToken?: string;
  branchId?: string;
}

interface AuthState {
  user: AuthUser | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      Storage.set("auth_user", action.payload);
    },
    hydrateAuth: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      Storage.remove("auth_user");
    },
  },
});

export const { loginSuccess, hydrateAuth, logout } = authSlice.actions;
export default authSlice.reducer;
