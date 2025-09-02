import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
    Campaign,
    FeedbackForm,
    createCampaign,
    getAllCampaigns,
    getCampaignById,
    updateCampaign,
    deleteCampaign,
    addFeedbackForm,
    getFeedbackForms,
    deleteFeedbackForm,
    getFeedbackFormById,
} from "./campaignApi";

interface CampaignState {
    campaigns: Campaign[];
    selectedCampaign: Campaign | null;
    feedbackForms: FeedbackForm[];
    selectedFeedbackForm: FeedbackForm | null; // New state for single feedback form
    loading: boolean;
    error: string | null;
    showCreateModal: boolean;
    showEditModal: boolean;
    showStatusModal: boolean;
    showFeedbackFormModal: boolean;
}

const initialState: CampaignState = {
    campaigns: [],
    selectedCampaign: null,
    feedbackForms: [],
    selectedFeedbackForm: null, // Initialize new state
    loading: false,
    error: null,
    showCreateModal: false,
    showEditModal: false,
    showStatusModal: false,
    showFeedbackFormModal: false,
};

const campaignSlice = createSlice({
    name: "campaigns",
    initialState,
    reducers: {
        setSelectedCampaign: (state, action: PayloadAction<Campaign | null>) => {
            state.selectedCampaign = action.payload;
        },
        setErrorToNull: (state) => {
            state.error = null;
        },
        setShowCreateModal: (state, action: PayloadAction<boolean>) => {
            state.showCreateModal = action.payload;
        },
        setShowEditModal: (state, action: PayloadAction<boolean>) => {
            state.showEditModal = action.payload;
        },
        setShowStatusModal: (state, action: PayloadAction<boolean>) => {
            state.showStatusModal = action.payload;
        },
        setShowFeedbackFormModal: (state, action: PayloadAction<boolean>) => {
            state.showFeedbackFormModal = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create Campaign
            .addCase(createCampaign.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCampaign.fulfilled, (state, action) => {
                state.loading = false;
                state.campaigns.push(action.payload.data);
                state.showCreateModal = false;
                toast.success("Campaign created successfully");
            })
            .addCase(createCampaign.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                toast.error(state.error);
            })

            // Get All Campaigns
            .addCase(getAllCampaigns.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCampaigns.fulfilled, (state, action) => {
                state.loading = false;
                state.campaigns = action.payload.data;
            })
            .addCase(getAllCampaigns.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                toast.error(state.error);
            })

            // Get Campaign by ID
            .addCase(getCampaignById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCampaignById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedCampaign = action.payload.data;
            })
            .addCase(getCampaignById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                toast.error(state.error);
            })

            // Update Campaign
            .addCase(updateCampaign.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCampaign.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.campaigns.findIndex(c => c._id === action.payload.data._id);
                if (index !== -1) {
                    state.campaigns[index] = action.payload.data;
                }
                state.showEditModal = false;
                toast.success("Campaign updated successfully");
            })
            .addCase(updateCampaign.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                toast.error(state.error);
            })

            // Delete Campaign
            .addCase(deleteCampaign.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCampaign.fulfilled, (state, action) => {
                state.loading = false;
                state.campaigns = state.campaigns.filter(c => c._id !== action.payload);
                toast.success("Campaign deleted successfully");
            })
            .addCase(deleteCampaign.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                toast.error(state.error);
            })

            // Add Feedback Form
            .addCase(addFeedbackForm.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addFeedbackForm.fulfilled, (state, action) => {
                state.loading = false;
                state.feedbackForms.push(action.payload.data);
                toast.success("Feedback form added successfully");
            })
            .addCase(addFeedbackForm.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                toast.error(state.error);
            })

            // Get Feedback Forms
            .addCase(getFeedbackForms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFeedbackForms.fulfilled, (state, action) => {
                state.loading = false;
                state.feedbackForms = action.payload.data;
            })
            .addCase(getFeedbackForms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                toast.error(state.error);
            })

            // Get Single Feedback Form by ID
            .addCase(getFeedbackFormById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.selectedFeedbackForm = null; // Clear previous selection
            })
            .addCase(getFeedbackFormById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedFeedbackForm = action.payload.data;
            })
            .addCase(getFeedbackFormById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.selectedFeedbackForm = null;
                toast.error(state.error);
            })

            // Delete Feedback Form
            .addCase(deleteFeedbackForm.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteFeedbackForm.fulfilled, (state, action) => {
                state.loading = false;
                state.feedbackForms = state.feedbackForms.filter(form => form._id !== action.payload);
                toast.success("Feedback form deleted successfully");
            })
            .addCase(deleteFeedbackForm.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                toast.error(state.error);
            });
    },
});

export const {
    setSelectedCampaign,
    setErrorToNull,
    setShowCreateModal,
    setShowEditModal,
    setShowStatusModal,
    setShowFeedbackFormModal,
} = campaignSlice.actions;

export default campaignSlice.reducer;
