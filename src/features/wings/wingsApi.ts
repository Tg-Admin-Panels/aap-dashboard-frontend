import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import axiosFormInstance from '../../utils/axiosFormInstance';


// Create Wing
export const createWing= createAsyncThunk(
  'wings/createWing',
  async (wingData:any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/wings", wingData);
      console.log("wing data from api",response.data)
      return response.data;
    } catch (error: any) {
      console.log(error.response?.data?.message)
      return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);

export const addLeaderToWing = createAsyncThunk(
  `wings/wingId/leader`,
  async (
    { wingId, data }: { wingId: string; data: any },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();

      // Append each field from data
      for (const key in data) {
        if (data[key]) {
          formData.append(key, data[key]);
        }
      }

      const response = await axiosFormInstance.post(
        `/wings/${wingId}/leader`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("wing data from api", response.data);
      return response.data;
    } catch (error: any) {
      console.log(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "An error occurred"
      );
    }
  }
);

// Get All Medicines
export const getAllWings = createAsyncThunk(
  'wings/getAllWings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/wings");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);


// Get all leaders
export const getAllWingMembers = createAsyncThunk(
  "wings/getAllWingMembers",
  async (_, {rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/wings/wingmembers`);
      console.log("wingmember data from api",response.data)
      return response.data;
    } catch (error: any) {
      console.log(error.response?.data?.message)
      return rejectWithValue(error.response?.data?.message || "An error occurred");
    }
  }
)


// Get All Medicines
export const getAllMedicines = createAsyncThunk(
  'wings/getAllWings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/wings");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);

// Get Medicine By ID
export const getMedicineById = createAsyncThunk(
  'medicine/getMedicineById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/medicines/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);

// Update Medicine By ID
export const updateMedicineById = createAsyncThunk(
  'medicine/updateMedicineById',
  async ({ id, medicineData }: { id: string; medicineData: any }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/medicines/${id}`, medicineData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);

// Delete Medicine By ID
export const deleteMedicineById = createAsyncThunk(
  'medicine/deleteMedicineById',
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/medicines/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);

// Delete Medicine By ID
export const activeMedicines = createAsyncThunk(
  'medicine/active list',
  async (_, { rejectWithValue }) => {
    try {
      const response=await axiosInstance.get(`/medicines/active`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);
