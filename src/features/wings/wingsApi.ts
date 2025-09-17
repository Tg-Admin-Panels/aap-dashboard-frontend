import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';


// Create Wing
export const createWing = createAsyncThunk(
  'wings/createWing',
  async (wingData: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/wings", wingData);
      console.log("wing data from api", response.data)
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


      const response = await axiosInstance.post(
        `/wings/${wingId}/leader`,
        data,
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



export const addMemberToWing = createAsyncThunk(
  `wings/wingId/member`,
  async (
    { wingId, data }: { wingId?: string; data: any },
    { rejectWithValue }
  ) => {
    try {


      const response = await axiosInstance.post(
        `/wings/${wingId}/member`,
        data,
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
      console.log(data)


      const response = await axiosInstance.put(
        `/wings/${wingId}/leader-change`,
        data,
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



      const response = await axiosInstance.put(
        `/wings/members/update/${memberId}`,
        data,
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

