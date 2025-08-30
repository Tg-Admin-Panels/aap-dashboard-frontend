// src/features/members/membersSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { createMember, deleteMember, getAllMembers, getMemberById, getMembersByVolunteer, updateMember } from "./membersApi";

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
  member: Member | null;
  loading: boolean;
  error: string | null;
}

const initialState: MemberState = {
  members: [],
  member: null,
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
    resetMembers: (state) => {
      state.members = [];
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
      })
      .addCase(getMemberById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMemberById.fulfilled, (state, action) => {
        state.loading = false;
        state.member = action.payload.data;
      })
      .addCase(getMemberById.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload) || "Failed to get member";
        toast.error(state.error);
      })
      .addCase(createMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMember.fulfilled, (state, action) => {
        state.loading = false;
        state.members.push(action.payload.data);
        toast.success("Member created successfully");
      })
      .addCase(createMember.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload) || "Failed to create member";
        toast.error(state.error);
      })
      .addCase(updateMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMember.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.members.findIndex(member => member._id === action.payload.data._id);
        if (index !== -1) {
          state.members[index] = action.payload.data;
        }
        toast.success("Member updated successfully");
      })
      .addCase(updateMember.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload) || "Failed to update member";
        toast.error(state.error);
      })
      .addCase(deleteMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMember.fulfilled, (state, action) => {
        state.loading = false;
        state.members = state.members.filter(member => member._id !== action.meta.arg);
        toast.success("Member deleted successfully");
      })
      .addCase(deleteMember.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload) || "Failed to delete member";
        toast.error(state.error);
      });
  },
});

export default membersSlice.reducer;
export const { resetMemberError, resetMembers } = membersSlice.actions;
