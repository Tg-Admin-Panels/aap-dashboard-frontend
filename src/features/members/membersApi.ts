// src/features/members/membersApi.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const getAllMembers = createAsyncThunk(
  "members/getAllMembers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/members");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch members"
      );
    }
  }
);

export const getMemberById = createAsyncThunk(
  "members/getMemberById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/members/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch member"
      );
    }
  }
);

export const getMembersByVolunteer = createAsyncThunk(
  "members/getMembersByVolunteer",
  async (volunteerId: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/members/joined-by/${volunteerId}`);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch volunteer members"
      );
    }
  }
);