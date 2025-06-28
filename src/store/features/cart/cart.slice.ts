import {
  ICartItem,
  ICartItemProduct,
  ICartItemVariant,
} from "@/interfaces/cart.interface";
import { IProduct, ProductVariant } from "@/interfaces/product.interface";
import { isVariantItem } from "@/utils/helpers";
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
      action: PayloadAction<{
        product: IProduct;
        quantity?: number;
        selectedVariant?: ProductVariant;
      }>
    ) => {
      const { product, quantity = 1, selectedVariant } = action.payload;

      if (selectedVariant) {
        // Handle variant addition
        const existingIndex = state.items.findIndex(
          (item) =>
            isVariantItem(item) && item.variant.id === selectedVariant._id
        );

        if (existingIndex >= 0) {
          // Update existing variant item
          const existingItem = state.items[existingIndex] as ICartItemVariant;
          existingItem.qty += quantity;
          existingItem.variant.qty += quantity;
        } else {
          // Add new variant item
          const newItem: ICartItemVariant = {
            id: `${product._id}-${selectedVariant._id}`,
            product: {
              ...product,
              variants: [], // Clear variants to avoid duplication
            },
            variant: {
              id: selectedVariant._id,
              name: selectedVariant.name,
              price: selectedVariant.price,
              quantityInStock: selectedVariant.quantityInStock,
              images: selectedVariant.images,
              qty: quantity,
            },
            qty: quantity,
          };
          state.items.push(newItem);
        }
      } else {
        // Handle base product addition
        const existingIndex = state.items.findIndex(
          (item) => !isVariantItem(item) && item.product._id === product._id
        );

        if (existingIndex >= 0) {
          // Update existing product item
          const existingItem = state.items[existingIndex] as ICartItemProduct;
          existingItem.qty += quantity;
        } else {
          // Add new product item
          const newItem: ICartItemProduct = {
            id: product._id,
            product: {
              ...product,
              variants: [], // Clear variants to avoid duplication
            },
            qty: quantity,
          };
          state.items.push(newItem);
        }
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ itemId: string; quantity: number }>
    ) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find((item) => item.id === itemId);

      if (item) {
        const maxQuantity = isVariantItem(item)
          ? item.variant.quantityInStock
          : item.product.quantityInStock;

        const newQuantity = Math.max(1, Math.min(quantity, maxQuantity));

        item.qty = newQuantity;
        if (isVariantItem(item)) {
          item.variant.qty = newQuantity;
        }

        // Remove if quantity is zero (shouldn't happen due to Math.max(1))
        if (newQuantity <= 0) {
          state.items = state.items.filter((item) => item.id !== itemId);
        }
      }
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
