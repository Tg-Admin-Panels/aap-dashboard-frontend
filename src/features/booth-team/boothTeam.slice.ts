import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  getAllBoothTeamMembers,
  createBoothTeamMember,
  deleteBoothTeamMember,
} from "./boothTeamApi";

interface BoothTeamMember {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  boothName: string;
  post: string;
  padnaam?: string;
}

interface BoothTeamState {
  members: BoothTeamMember[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalMembers: number;
}

const initialState: BoothTeamState = {
  members: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalMembers: 0,
};

const boothTeamSlice = createSlice({
  name: "boothTeam",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllBoothTeamMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBoothTeamMembers.fulfilled, (state, action) => {
        state.members = action.payload.data;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalMembers = action.payload.totalMembers;
        state.loading = false;
      })
      .addCase(getAllBoothTeamMembers.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to get booth team members";
        state.loading = false;
        toast.error(state.error);
      })
      .addCase(createBoothTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBoothTeamMember.fulfilled, (state, action) => {
        state.members.push(action.payload.data);
        state.loading = false;
        toast.success("Member created successfully");
      })
      .addCase(createBoothTeamMember.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to create member";
        state.loading = false;
        toast.error(state.error);
      })
      .addCase(deleteBoothTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBoothTeamMember.fulfilled, (state, action) => {
        state.members = state.members.filter(
          (member) => member._id !== action.payload
        );
        state.loading = false;
        toast.success("Member deleted successfully");
      })
      .addCase(deleteBoothTeamMember.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to delete member";
        state.loading = false;
        toast.error(state.error);
      });
  },
});

export default boothTeamSlice.reducer;