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
export const getWingMembers = createAsyncThunk(
  "wings/getWingMembers",
  async (wingId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/wings/${wingId}/members`);
      console.log("wingmember data from api", response.data);
      return response.data;
    } catch (error: any) {
      console.log(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "An error occurred"
      );
    }
  }
);


