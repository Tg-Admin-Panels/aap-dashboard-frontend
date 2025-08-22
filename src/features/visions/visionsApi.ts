import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

export const getAllVisions = createAsyncThunk(
  'visions/getAllVisions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/visions');
      console.log(response);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createVision = createAsyncThunk(
  'visions/createVision',
  async (visionData: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/visions', visionData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getVisionDetails = createAsyncThunk(
  'visions/getVisionDetails',
  async (visionId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/visions/${visionId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addPointToVision = createAsyncThunk(
  'visions/addPointToVision',
  async ({ visionId, point }: { visionId: string; point: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/visions/${visionId}/points`, { point });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removePointFromVision = createAsyncThunk(
  'visions/removePointFromVision',
  async ({ visionId, point }: { visionId: string; point: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/visions/${visionId}/points`, { data: { point } });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
