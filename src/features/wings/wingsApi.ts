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
    { wingId, data }: { wingId?: string; data: any },
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



export const addMemberToWing   = createAsyncThunk(
  `wings/wingId/member`,
  async (
    { wingId, data }: { wingId?: string; data: any },
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
        `/wings/${wingId}/member`,
        formData,
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



export const changeLeader = createAsyncThunk(
  "wings/changeLeader",
  async (
    { wingId, data }: { wingId?: string; data: any },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();

      for (const key in data) {
        if (data[key]) {
          formData.append(key, data[key]);
        }
      }

      const response = await axiosFormInstance.put(
        `/wings/${wingId}/leader-change`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to change leader"
      );
    }
  }
);

export const updateMember = createAsyncThunk(
  "/wings/members/update/memberId",
  async (
    { memberId, data }: { memberId?: string; data: any },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      console.log("data", data);
      for (const key in data) {
        if (data[key]) {
          formData.append(key, data[key]);
        }
      }

      console.log("before api call", formData);
      const response = await axiosFormInstance.put(
        `/wings/members/update/${memberId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("member data from api", response.data);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update member"
      );
    }
  }
);


export const deleteWingMember = createAsyncThunk(
  "wings/deleteWingMember",
  async (memberId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/wings/members/${memberId}`);
      return { memberId, ...response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete member"
      );
    }
  }
);

