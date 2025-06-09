import { IUser } from "@/interfaces/user.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  user: IUser | null;
  error: string | null;
  loading: boolean;
}

export const SLICE_NAME = "auth";

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  error: null,
  loading: false,
};

const authSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    loginSuccess(state, action: PayloadAction<{ user: IUser }>) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.error = null;
      state.loading = false;
    },

    loginFailure(state, action: PayloadAction<string>) {
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
      state.loading = false;
    },

    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.loading = false;
    },

    clearError(state) {
      state.error = null;
    },

    updateUser(state, action: PayloadAction<Partial<IUser>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

// Export actions
export const {
  setLoading,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  updateUser,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;
