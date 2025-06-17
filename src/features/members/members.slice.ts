// src/features/members/membersSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { getAllMembers } from "./membersApi";

interface VolunteerInfo {
  _id: string;
  fullName: string;
  mobileNumber: string;
}

export interface Member {
  _id: string;
  name: string;
  state: string;
  mobileNumber: string;
  joinedBy: "self" | "volunteer";
  volunteerId?: VolunteerInfo | null;
}

interface MemberState {
  members: Member[];
  loading: boolean;
  error: string | null;
}

const initialState: MemberState = {
  members: [],
  loading: false,
  error: null,
};

const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    resetMemberError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload.data;
      })
      .addCase(getAllMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default membersSlice.reducer;
export const { resetMemberError } = membersSlice.actions;
