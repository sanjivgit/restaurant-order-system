import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import contextReducer from "./contextSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    context: contextReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
