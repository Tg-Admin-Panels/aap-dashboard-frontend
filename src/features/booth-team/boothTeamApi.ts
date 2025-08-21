import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

// Get All Booth Team Members
export const getAllBoothTeamMembers = createAsyncThunk(
  "boothTeam/getAllBoothTeamMembers",
  async (filters: { boothName?: string; post?: string; padnaam?: string; page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const { boothName, post, padnaam, page, limit } = filters;
      let url = "/booth-team";
      const params = new URLSearchParams();
      if (boothName) {
        params.append("boothName", boothName);
      }
      if (post) {
        params.append("post", post);
      }
      if (padnaam) {
        params.append("padnaam", padnaam);
      }
      if (page) {
        params.append("page", page.toString());
      }
      if (limit) {
        params.append("limit", limit.toString());
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch booth team members"
      );
    }
  }
);

// Create Booth Team Member
export const createBoothTeamMember = createAsyncThunk(
  "boothTeam/createBoothTeamMember",
  async (memberData: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/booth-team", memberData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create booth team member"
      );
    }
  }
);

// Delete Booth Team Member
export const deleteBoothTeamMember = createAsyncThunk(
  "boothTeam/deleteBoothTeamMember",
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/booth-team/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete booth team member"
      );
    }
  }
);
