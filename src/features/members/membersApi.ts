// src/features/members/membersApi.ts


import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const getAllMembers = createAsyncThunk(
  "members/getAllMembers",
  async (search: string | undefined, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/members?search=${search || ""}`);
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
  async ({ volunteerId, search }: { volunteerId: string, search: string | undefined }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/members/joined-by/${volunteerId}/?search=${search || ""}`);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch volunteer members"
      );
    }
  }
);

export const createMember = createAsyncThunk(
  "members/createMember",
  async (memberData: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/members", memberData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create member"
      );
    }
  }
);

export const updateMember = createAsyncThunk(
  "members/updateMember",
  async ({ id, memberData }: { id: string; memberData: any }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/members/${id}`, memberData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update member"
      );
    }
  }
);

export const deleteMember = createAsyncThunk(
  "members/deleteMember",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/members/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete member"
      );
    }
  }
);
