import { ICartItem } from "@/interfaces/cart.interface";
import { IProduct } from "@/interfaces/product.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartState {
  items: ICartItem[];
}

export const SLICE_NAME = "cart";

export const initialState: CartState = {
  items: [],
};

export const cartSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ product: IProduct; quantity?: number }>
    ) => {
      const { product, quantity: qty = 1 } = action.payload;
      const existingItem = state.items.find(
        (item) => item.product._id === product._id
      );

      if (existingItem) {
        existingItem.qty += qty;
      } else {
        state.items.push({ product, qty });
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.product._id !== action.payload
      );
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item.product._id === productId);

      if (item) {
        item.qty = quantity > 0 ? quantity : 1;
      }
    },

    incrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(
        (item) => item.product._id === action.payload
      );
      if (item) {
        item.qty += 1;
      }
    },

    decrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(
        (item) => item.product._id === action.payload
      );
      if (item) {
        item.qty = Math.max(1, item.qty - 1);
      }
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
