import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export interface Campaign {
    _id: string;
    title: string;
    description: string;
    bannerImage?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Comment {
    _id: string;
    campaign: string;
    text: string;
    createdAt: string;
    updatedAt: string;
}

// API Calls for Campaigns
export const createCampaign = createAsyncThunk(
    "campaigns/create",
    async (campaignData: Omit<Campaign, "_id" | "createdAt" | "updatedAt">, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/campaigns", campaignData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const getAllCampaigns = createAsyncThunk(
    "campaigns/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/campaigns");
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const getCampaignById = createAsyncThunk(
    "campaigns/getById",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/campaigns/${id}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const updateCampaign = createAsyncThunk(
    "campaigns/update",
    async ({ id, campaignData }: { id: string, campaignData: Partial<Campaign> }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/campaigns/${id}`, campaignData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const deleteCampaign = createAsyncThunk(
    "campaigns/delete",
    async (id: string, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/campaigns/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// API Calls for Comments
export const addComment = createAsyncThunk(
    "campaigns/addComment",
    async ({ campaignId, text }: { campaignId: string, text: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/campaigns/${campaignId}/comments`, { text });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const getComments = createAsyncThunk(
    "campaigns/getComments",
    async (campaignId: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/campaigns/${campaignId}/comments`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const deleteComment = createAsyncThunk(
    "campaigns/deleteComment",
    async ({ campaignId, commentId }: { campaignId: string, commentId: string }, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/campaigns/${campaignId}/comments/${commentId}`);
            return commentId;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);
