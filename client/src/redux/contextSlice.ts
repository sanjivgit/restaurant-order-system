import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DiningContext {
  restaurantId: string;
  restaurantName: string;
  branchId: string;
  branchName: string;
  tableId: string;
  tableNumber: string;
}

export interface AdminBranch {
  id: string;
  name: string;
}

interface ContextState {
  dining: DiningContext | null; // resolved from QR code, customer side
  activeBranch: AdminBranch | null; // admin's currently selected branch
}

const initialState: ContextState = {
  dining: null,
  activeBranch: null,
};

const contextSlice = createSlice({
  name: "context",
  initialState,
  reducers: {
    setDiningContext: (state, action: PayloadAction<DiningContext>) => {
      state.dining = action.payload;
    },
    setActiveBranch: (state, action: PayloadAction<AdminBranch>) => {
      state.activeBranch = action.payload;
    },
  },
});

export const { setDiningContext, setActiveBranch } = contextSlice.actions;
export default contextSlice.reducer;
