import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Thunk to create a new form definition
export const createFormDefinition = createAsyncThunk(
    'forms/createDefinition',
    async (formData: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/api/v1/forms', formData);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Thunk to fetch all form definitions
export const fetchAllForms = createAsyncThunk(
    'forms/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/v1/forms');
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Thunk to fetch a single form definition by ID
export const fetchFormDefinition = createAsyncThunk(
    'forms/fetchDefinition',
    async (formId: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/v1/forms/${formId}`);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Thunk to fetch all submissions for a specific form
export const fetchSubmissionsForForm = createAsyncThunk(
    'forms/fetchSubmissions',
    async ({ formId, page = 1, limit = 10 }: { formId: string, page?: number, limit?: number }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/v1/forms/${formId}/submissions?page=${page}&limit=${limit}`);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Thunk to submit data to a form
export const submitFormData = createAsyncThunk(
    'forms/submitData',
    async ({ formId, data }: { formId: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/api/v1/forms/${formId}/submissions`, data);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Thunk to fetch a single submission by its ID
export const fetchSubmissionDetails = createAsyncThunk(
    'forms/fetchSubmissionDetails',
    async (submissionId: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/v1/forms/submissions/${submissionId}`);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Thunk to delete a form definition by ID
export const deleteForm = createAsyncThunk(
    'forms/delete',
    async ({ formId, keepSubmissions }: { formId: string, keepSubmissions: boolean }, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/api/v1/forms/${formId}?keepSubmissions=${keepSubmissions}`);
            return formId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Thunk to upload submissions from a CSV file
export const uploadSubmissionsFromCSV = createAsyncThunk(
    'forms/uploadCSV',
    async ({ formId, submissions }: { formId: string, submissions: any[] }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/api/v1/forms/${formId}/submissions/bulk`, { submissions });
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Thunk to delete a submission by ID
export const deleteSubmission = createAsyncThunk(
    'forms/deleteSubmission',
    async (submissionId: string, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/api/v1/forms/submissions/${submissionId}`);
            return submissionId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);