import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import axiosFormInstance from "../../utils/axiosFormInstance";

// ================= Countries =================
export const getAllCountries = createAsyncThunk(
  "locations/getAllCountries",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/countries");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch countries"
      );
    }
  }
);

// ================= States =================
export const getAllStates = createAsyncThunk(
  "locations/getAllStates",
  async (
    { parentId }: { parentId?: string },
    { rejectWithValue }
  ) => {
    try {
      const url = parentId ? `/states?parentId=${parentId}` : `/states`;
      const response = await axiosInstance.get(url);
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
  async (stateData: { name: string; code: string; parentId: string }, { rejectWithValue }) => {
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

export const bulkUploadStates = createAsyncThunk(
  "locations/bulkUploadStates",
  async (formData: FormData) => {
    const response = await axiosFormInstance.post(`/states/bulk-upload`, formData);
    return response.data;
  }
);

// ================= Districts =================
export const getAllDistricts = createAsyncThunk(
  "locations/getAllDistricts",
  async (
    { parentId }: { parentId?: string },
    { rejectWithValue }
  ) => {
    try {
      const url = parentId ? `/districts?parentId=${parentId}` : `/districts`;
      const response = await axiosInstance.get(url);
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

export const bulkUploadDistricts = createAsyncThunk(
  "locations/bulkUploadDistricts",
  async ({ fd, parentId }: { fd: FormData; parentId: string }) => {
    const response = await axiosFormInstance.post(
      `/districts/bulk-upload?parentId=${parentId}`,
      fd
    );
    return response.data;
  }
);

// ================= Legislative Assemblies =================
export const getAllLegislativeAssemblies = createAsyncThunk(
  "locations/getAllLegislativeAssemblies",
  async (
    { parentId }: { parentId?: string },
    { rejectWithValue }
  ) => {
    try {
      const url = parentId
        ? `/legislative-assemblies?parentId=${parentId}`
        : `/legislative-assemblies`;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to fetch legislative assemblies"
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
        error.response?.data?.message ||
        "Failed to create legislative assembly"
      );
    }
  }
);

export const bulkUploadLegislativeAssemblies = createAsyncThunk(
  "locations/bulkUploadLegislativeAssemblies",
  async ({ fd, parentId }: { fd: FormData; parentId: string }) => {
    const response = await axiosFormInstance.post(
      `/legislative-assemblies/bulk-upload?parentId=${parentId}`,
      fd,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  }
);

// ================= Booths =================
export const getAllBooths = createAsyncThunk(
  "locations/getAllBooths",
  async (
    { parentId }: { parentId?: string },
    { rejectWithValue }
  ) => {
    try {
      const url = parentId ? `/booths?parentId=${parentId}` : `/booths`;
      const response = await axiosInstance.get(url);
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

export const bulkUploadBooths = createAsyncThunk(
  "locations/bulkUploadBooths",
  async ({ fd, parentId }: { fd: FormData; parentId: string }) => {
    const response = await axiosFormInstance.post(
      `/booths/bulk-upload?parentId=${parentId}`,
      fd,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  }
);
