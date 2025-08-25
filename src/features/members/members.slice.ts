// src/features/members/membersSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getAllMembers, getMembersByVolunteer } from "./membersApi";

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
        state.error = String(action.payload) || "Failed to get members";
        toast.error(state.error);
      })
      .addCase(getMembersByVolunteer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMembersByVolunteer.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload.data;
      })
      .addCase(getMembersByVolunteer.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload) || "Failed to get members for this volunteer";
        toast.error(state.error);
      });

  },
});

export default membersSlice.reducer;
export const { resetMemberError } = membersSlice.actions;
