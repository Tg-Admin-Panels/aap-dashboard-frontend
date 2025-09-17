import { createSlice } from "@reduxjs/toolkit";
import { checkAuth, loginUser, logoutUser } from "./authApi";

interface User {
  _id: string;
  name: string;
  email: string;
  mobileNumber: string;
  role: string;
  volunteer: string
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean | null;
  loading: boolean;
  status: 'idle' | 'loading' | 'succeeded';
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: null,
  loading: false,
  status: 'idle',
};

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },

    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.isAuthenticated = true;
        state.loading = false;

      })
      .addCase(loginUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.status = 'idle';
      })
      .addCase(checkAuth.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.data;
        state.loading = false;
        state.status = 'succeeded';
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.loading = false;
        state.status = 'succeeded';
      });
  },
});


export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;