import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

// Create Volunteer
export const createVolunteer = createAsyncThunk(
  "volunteers/createVolunteer",
  async (volunteerData: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/volunteers",
        volunteerData
      );
      console.log("Created volunteer", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create volunteer"
      );
    }
  }
);

// Get All Volunteers
export const getAllVolunteers = createAsyncThunk(
  "volunteers/getAllVolunteers",
  async (search: string | undefined, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/volunteers?search=${search || ""}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch volunteers"
      );
    }
  }
);

// Get Volunteer By ID
export const getVolunteerById = createAsyncThunk(
  "volunteers/getVolunteerById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/volunteers/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch volunteer"
      );
    }
  }
);

// Update Volunteer
export const updateVolunteer = createAsyncThunk(
  "volunteers/updateVolunteer",
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/volunteers/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update volunteer"
      );
    }
  }
);

// Delete Volunteer
export const deleteVolunteer = createAsyncThunk(
  "volunteers/deleteVolunteer",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/volunteers/${id}`);
      return { id, ...response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete volunteer"
      );
    }
  }
);

export const updateVolunteerStatus = createAsyncThunk(
  "volunteers/updateVolunteerStatus",
  async (
    { id, status }: { id: string; status: "active" | "blocked" },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.patch(`/volunteers/${id}/status`, {
        status,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update status"
      );
    }
  }
);