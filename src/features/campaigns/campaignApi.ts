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

export interface FeedbackForm {
    _id: string;
    name: string;
    mobile: string;
    state: string;
    district: string;
    vidhansabha: string;
    support: boolean;
    campaign: string; // Campaign ID
    createdAt: string;
    updatedAt: string;
}

// Campaign Thunks
export const createCampaign = createAsyncThunk(
    "campaigns/createCampaign",
    async (campaignData: { title: string; description: string; bannerImage?: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/campaigns", campaignData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "An error occurred");
        }
    }
);

export const getAllCampaigns = createAsyncThunk(
    "campaigns/getAllCampaigns",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/campaigns");
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "An error occurred");
        }
    }
);

export const getCampaignById = createAsyncThunk(
    "campaigns/getCampaignById",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/campaigns/${id}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "An error occurred");
        }
    }
);

export const updateCampaign = createAsyncThunk(
    "campaigns/updateCampaign",
    async ({ id, campaignData }: { id: string; campaignData: { title: string; description: string; bannerImage?: string } }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/campaigns/${id}`, campaignData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "An error occurred");
        }
    }
);

export const deleteCampaign = createAsyncThunk(
    "campaigns/deleteCampaign",
    async (id: string, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/campaigns/${id}`);
            return id; // Return the ID of the deleted campaign
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "An error occurred");
        }
    }
);

// Feedback Form Thunks
export const addFeedbackForm = createAsyncThunk(
    "campaigns/addFeedbackForm",
    async ({ campaignId, formData }: { campaignId: string; formData: Omit<FeedbackForm, "_id" | "createdAt" | "updatedAt" | "campaign"> }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/campaigns/${campaignId}/feedback-forms`, formData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "An error occurred");
        }
    }
);

export const getFeedbackForms = createAsyncThunk(
    "campaigns/getFeedbackForms",
    async (campaignId: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/campaigns/${campaignId}/feedback-forms`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "An error occurred");
        }
    }
);

export const getFeedbackFormById = createAsyncThunk(
    "campaigns/getFeedbackFormById",
    async ({ campaignId, feedbackFormId }: { campaignId: string; feedbackFormId: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/campaigns/${campaignId}/feedback-forms/${feedbackFormId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "An error occurred");
        }
    }
);

export const deleteFeedbackForm = createAsyncThunk(
    "campaigns/deleteFeedbackForm",
    async ({ campaignId, feedbackFormId }: { campaignId: string; feedbackFormId: string }, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/campaigns/${campaignId}/feedback-forms/${feedbackFormId}`);
            return feedbackFormId; // Return the ID of the deleted feedback form
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "An error occurred");
        }
    }
);
