import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const getAllStates = createAsyncThunk(
  "locations/getAllStates",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/states");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch states"
      );
    }
  }
);

export const createState = createAsyncThunk(
  "locations/createState",
  async (stateData: { name: string; code: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/states", stateData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create state"
      );
    }
  }
);

export const getAllDistricts = createAsyncThunk(
  "locations/getAllDistricts",
  async (stateId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/districts?parentId=${stateId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch districts"
      );
    }
  }
);

export const createDistrict = createAsyncThunk(
  "locations/createDistrict",
  async (districtData: { name: string; code: string; parentId: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/districts", districtData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create district"
      );
    }
  }
);

export const getAllLegislativeAssemblies = createAsyncThunk(
  "locations/getAllLegislativeAssemblies",
  async (districtId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/legislative-assemblies?parentId=${districtId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch legislative assemblies"
      );
    }
  }
);

export const createLegislativeAssembly = createAsyncThunk(
  "locations/createLegislativeAssembly",
  async (assemblyData: { name: string; code: string; parentId: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/legislative-assemblies", assemblyData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create legislative assembly"
      );
    }
  }
);

export const getAllBooths = createAsyncThunk(
  "locations/getAllBooths",
  async (legislativeAssemblyId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/booths?parentId=${legislativeAssemblyId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch booths"
      );
    }
  }
);

export const createBooth = createAsyncThunk(
  "locations/createBooth",
  async (boothData: { name: string; code: string; parentId: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/booths", boothData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create booth"
      );
    }
  }
);