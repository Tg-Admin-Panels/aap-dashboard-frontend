// src/features/wings/wingMemberSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { getWingLeader } from "./wingsApi";

interface Leader {
  _id: string;
  name: string;
  phone: string;
  image: string;
  role: "leader" | "member";
  post?: string;
  fbLink?: string;
  instafbLink?: string;
  xLink?: string;
  wing?: string;
}

interface WingMemberState {
  leaderDetail: Leader | null;
  loading: boolean;
  error: string | null;
}

const initialState: WingMemberState = {
  leaderDetail: null,
  loading: false,
  error: null,
};

const wingMemberSlice = createSlice({
  name: "wingMembers",
  initialState,
  reducers: {
    setErrorToNull: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWingLeader.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWingLeader.fulfilled, (state, action) => {
        state.loading = false;
        state.leaderDetail = action.payload; // ✅ Correct field
      })
      .addCase(getWingLeader.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setErrorToNull } = wingMemberSlice.actions;

export default wingMemberSlice.reducer;
