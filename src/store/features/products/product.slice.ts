import { IProduct, ProductFilterInput } from "@/interfaces/product.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductState {
  loading: boolean;
  products: IProduct[];
  selectedProduct: IProduct | null;
  error: string | null;
  filter: ProductFilterInput;
  favourites: IProduct[];
  favouritesLoading: boolean;
  showAuthDialog: boolean;
  authDialogMessage: string;
}

export const SLICE_NAME = "product";

export const initialFilterState: ProductFilterInput = {
  page: 1,
  limit: 12,
  sort: "highestPrice",
};

const initialState: ProductState = {
  loading: false,
  products: [],
  selectedProduct: null,
  error: null,
  filter: initialFilterState,
  favourites: [],
  favouritesLoading: false,
  showAuthDialog: false,
  authDialogMessage: "",
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
    setSelectedProduct(state, action: PayloadAction<IProduct | null>) {
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
    // Favorites actions
    setFavouritesLoading(state, action: PayloadAction<boolean>) {
      state.favouritesLoading = action.payload;
    },
    setFavourites(state, action: PayloadAction<IProduct[]>) {
      state.favourites = action.payload;
      state.favouritesLoading = false;
    },
    addToFavorites(state, action: PayloadAction<IProduct>) {
      if (!state.favourites.some((fav) => fav._id === action.payload._id)) {
        state.favourites.push(action.payload);
      }
    },
    removeFromFavorites(state, action: PayloadAction<string>) {
      state.favourites = state.favourites.filter(
        (fav) => fav._id !== action.payload
      );
    },
    toggleFavorite(state, action: PayloadAction<IProduct>) {
      const index = state.favourites.findIndex(
        (fav) => fav._id === action.payload._id
      );
      if (index >= 0) {
        state.favourites.splice(index, 1);
      } else {
        state.favourites.push(action.payload);
      }
    },
    // Error handling
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    showAuthDialog(state, action: PayloadAction<string>) {
      state.showAuthDialog = true;
      state.authDialogMessage = action.payload;
    },
    hideAuthDialog(state) {
      state.showAuthDialog = false;
      state.authDialogMessage = "";
    },
  },
});

export const {
  resetFilter,
  setFilter,
  setLoading,
  setProducts,
  setSelectedProduct,
  setFavourites,
  setFavouritesLoading,
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
  showAuthDialog,
  hideAuthDialog,
} = productSlice.actions;

export default productSlice.reducer;
