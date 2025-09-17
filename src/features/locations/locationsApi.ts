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
    { parentId, page = 1, limit = 100 }: { parentId?: string, page?: number, limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const url = parentId ? `/states?parentId=${parentId}&page=${page}&limit=${limit}` : `/states?page=${page}&limit=${limit}`;
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
  async (stateData: { name: string; code: string; }, { rejectWithValue }) => {
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

export const updateState = createAsyncThunk(
  "locations/updateState",
  async ({ id, data }: { id: string; data: { name?: string; code?: string } }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/states/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update state"
      );
    }
  }
);

export const deleteState = createAsyncThunk(
  "locations/deleteState",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/states/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete state"
      );
    }
  }
);

// ================= Districts =================
export const getAllDistricts = createAsyncThunk(
  "locations/getAllDistricts",
  async (
    { parentId, page = 1, limit = 100 }: { parentId?: string, page?: number, limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const url = parentId ? `/districts?parentId=${parentId}&page=${page}&limit=${limit}` : `/districts?page=${page}&limit=${limit}`;
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

export const updateDistrict = createAsyncThunk(
  "locations/updateDistrict",
  async ({ id, data }: { id: string; data: { name?: string; code?: string } }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/districts/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update district"
      );
    }
  }
);

export const deleteDistrict = createAsyncThunk(
  "locations/deleteDistrict",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/districts/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete district"
      );
    }
  }
);

// ================= Legislative Assemblies =================
export const getAllLegislativeAssemblies = createAsyncThunk(
  "locations/getAllLegislativeAssemblies",
  async (
    { parentId, page = 1, limit = 100 }: { parentId?: string, page?: number, limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const url = parentId
        ? `/legislative-assemblies?parentId=${parentId}&page=${page}&limit=${limit}`
        : `/legislative-assemblies?page=${page}&limit=${limit}`;
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

export const updateLegislativeAssembly = createAsyncThunk(
  "locations/updateLegislativeAssembly",
  async ({ id, data }: { id: string; data: { name?: string; code?: string } }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/legislative-assemblies/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update legislative assembly"
      );
    }
  }
);

export const deleteLegislativeAssembly = createAsyncThunk(
  "locations/deleteLegislativeAssembly",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/legislative-assemblies/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete legislative assembly"
      );
    }
  }
);

// ================= Booths =================
export const getAllBooths = createAsyncThunk(
  "locations/getAllBooths",
  async (
    { parentId, page = 1, limit = 100 }: { parentId?: string, page?: number, limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const url = parentId ? `/booths?parentId=${parentId}&page=${page}&limit=${limit}` : `/booths?page=${page}&limit=${limit}`;
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

export const updateBooth = createAsyncThunk(
  "locations/updateBooth",
  async ({ id, data }: { id: string; data: { name?: string; code?: string } }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/booths/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update booth"
      );
    }
  }
);

export const deleteBooth = createAsyncThunk(
  "locations/deleteBooth",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/booths/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete booth"
      );
    }
  }
);
