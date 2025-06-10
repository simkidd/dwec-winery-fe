import { IProduct, ProductFilterInput } from "@/interfaces/product.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductState {
  loading: boolean;
  products: IProduct[];
  selectedProduct: IProduct | null;
  error: string | null;
  filter: ProductFilterInput;
}

export const SLICE_NAME = "product";

export const initialFilterState: ProductFilterInput = {
  page: 1,
  limit: 12,
  sort: 'highestPrice'
};

const initialState: ProductState = {
  loading: false,
  products: [],
  selectedProduct: null,
  error: null,
  filter: initialFilterState,
};

const productSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setProducts(state, action: PayloadAction<IProduct[]>) {
      state.products = action.payload;
      state.loading = false;
      state.error = null;
    },
    setselectedProduct(state, action: PayloadAction<IProduct | null>) {
      state.selectedProduct = action.payload;
    },
    setFilter(state, action: PayloadAction<Partial<ProductFilterInput>>) {
      state.filter = { ...state.filter, ...action.payload };
      // Reset to first page when filters change (except page/limit)
      if (action.payload.search !== undefined) {
        state.filter.page = 1;
      }
    },
    resetFilter(state) {
      state.filter = initialFilterState;
    },
  },
});

export const {
  resetFilter,
  setFilter,
  setLoading,
  setProducts,
  setselectedProduct,
} = productSlice.actions;

export default productSlice.reducer
