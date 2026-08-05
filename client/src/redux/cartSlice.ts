import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  itemId: string;
  name: string;
  price: number;
  image?: string;
  isVeg: boolean;
  qty: number;
  note?: string;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Omit<CartItem, "qty">>) => {
      const existing = state.items.find((i) => i.itemId === action.payload.itemId);
      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({ ...action.payload, qty: 1 });
      }
    },
    increaseQty: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.itemId === action.payload);
      if (item) item.qty += 1;
    },
    decreaseQty: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.itemId === action.payload);
      if (item) {
        item.qty -= 1;
        if (item.qty <= 0) {
          state.items = state.items.filter((i) => i.itemId !== action.payload);
        }
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.itemId !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, increaseQty, decreaseQty, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
