import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import axiosFormInstance from "../../utils/axiosFormInstance";

export const getAllCountries = createAsyncThunk(
  "locations/getAllCountries",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/countries");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch countries"
      );
    }
  }
);

export const getAllStates = createAsyncThunk(
  "locations/getAllStates",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/states");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch states"
      );
    }
  }
);

export const getStatesByCountry = createAsyncThunk(
  "locations/getStatesByCountry",
  async (countryId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/states?countryId=${countryId}`);
      return response.data.data;
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

export const bulkUploadStates = createAsyncThunk(
  "locations/bulkUploadStates",
  async (formData: FormData) => {
    const response = await axiosFormInstance.post(`/states/bulk-upload`, formData);
    return response.data;
  }
);

export const getAllDistricts = createAsyncThunk(
  "locations/getAllDistricts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/districts");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all districts"
      );
    }
  }
);

export const getDistrictsByState = createAsyncThunk(
  "locations/getDistrictsByState",
  async (stateId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/districts?parentId=${stateId}`);
      return response.data.data;
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
      return response.data.data;
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
      return response.data.data;
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

// Bulk upload Districts
export const bulkUploadDistricts = createAsyncThunk(
  "locations/bulkUploadDistricts",
  async ({ fd, parentId }: { fd: FormData, parentId: string }) => {
    const response = await axiosFormInstance.post(`/districts/bulk-upload?parentId=${parentId}`, fd,);
    return response.data;
  }
);

// Bulk upload Legislative Assemblies
export const bulkUploadLegislativeAssemblies = createAsyncThunk(
  "locations/bulkUploadLegislativeAssemblies",
  async ({ fd, parentId }: { fd: FormData, parentId: string }) => {
    const response = await axiosFormInstance.post(`/legislative-assemblies/bulk-upload?parentId=${parentId}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
);

// Bulk upload Booths
export const bulkUploadBooths = createAsyncThunk(
  "locations/bulkUploadBooths",
  async ({ fd, parentId }: { fd: FormData, parentId: string }) => {
    const response = await axiosFormInstance.post(`/booths/bulk-upload?parentId=${parentId}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
);

export const getAllLegislativeAssemblies_ = createAsyncThunk(
  "locations/getAllLegislativeAssemblies_",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/legislative-assemblies");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all legislative assemblies"
      );
    }
  }
);

export const getAllBooths_ = createAsyncThunk(
  "locations/getAllBooths_",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/booths");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all booths"
      );
    }
  }
);
