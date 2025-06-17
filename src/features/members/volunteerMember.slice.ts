// src/features/members/volunteerMembersSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { getMembersByVolunteer } from "./membersApi";
import { Member } from "./members.slice";

interface VolunteerMembersState {
  members: Member[];
  loading: boolean;
  error: string | null;
}

const initialState: VolunteerMembersState = {
  members: [],
  loading: false,
  error: null,
};

const volunteerMembersSlice = createSlice({
  name: "volunteerMembers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
        state.error = action.payload as string;
      });
  },
});

export default volunteerMembersSlice.reducer;
