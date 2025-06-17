import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { checkAuth, loginUser } from "./authApi";
import { SerializedError } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

// interface Volunteer {
//   _id: string;
//   fullName: string;
//   dateOfBirth: string;
//   age: number;
//   gender: string;
//   mobileNumber: string;
//   religion?: string;
//   profilePicture?: string;
//   zone: string;
//   district: string;
//   block: string;
//   wardNumber?: string;
//   boothNumber?: string;
//   pinCode?: string;
//   postOffice?: string;
//   cityName?: string;
//   streetOrLocality?: string;
//   panchayat?: string;
//   villageName?: string;
//   status: string;
// }

interface UserData {
  name: string;
  mobileNumber: string;
  role: string;
  volunteer: string | null;
  token: string;
}

interface User {
  data: UserData;
  token: string | null;
}

interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload.data;
      state.isAuthenticated = true;
      if (action.payload.token) {
        console.log("token", action.payload.token);
        Cookies.set("token", action.payload.data.token, { expires: 7 }); // Store token for 7 days
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      Cookies.remove("token"); // Remove token on logout
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload.data;
        state.isAuthenticated = true;
        console.log("isAuthenticated", state.isAuthenticated);
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload.data;
        console.log("payload data", action.payload.data);
        if (action.payload.data.token) {
          Cookies.set("token", action.payload.data.token, { expires: 7 }); // Store token
          state.isAuthenticated = true;
          console.log("isAuth after login", state.isAuthenticated)
        }
      })
      .addCase(
        loginUser.rejected,
        (
          state,
          action: PayloadAction<unknown, string, any, SerializedError>
        ) => {
          state.loading = false;
          state.error = action.error?.message || "Failed to login";
        }
      );
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
