
import { createAsyncThunk } from "@reduxjs/toolkit";
import { CandidateApplication } from "./candidateApplication.slice";
import axiosInstance from "../../utils/axiosInstance";

export const createCandidateApplication = createAsyncThunk(
    "candidateApplications/create",
    async (applicationData: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/candidate-applications", applicationData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const getAllCandidateApplications = createAsyncThunk(
    "candidateApplications/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/candidate-applications");
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const getCandidateApplicationById = createAsyncThunk(
    "candidateApplications/getById",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/candidate-applications/${id}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const updateCandidateApplication = createAsyncThunk(
    "candidateApplications/update",
    async ({ id, applicationData }: { id: string, applicationData: Partial<CandidateApplication> }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/candidate-applications/${id}`, applicationData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const deleteCandidateApplication = createAsyncThunk(
    "candidateApplications/delete",
    async (id: string, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/candidate-applications/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const updateCandidateApplicationStatus = createAsyncThunk(
    "candidateApplications/updateStatus",
    async ({ id, status, notes }: { id: string, status: string, notes?: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(`/candidate-applications/${id}/status`, { status, notes });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);
