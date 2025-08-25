import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
    Campaign,
    Comment,
    createCampaign,
    getAllCampaigns,
    getCampaignById,
    updateCampaign,
    deleteCampaign,
    addComment,
    getComments,
    deleteComment,
} from "./campaignApi";

interface CampaignState {
    campaigns: Campaign[];
    selectedCampaign: Campaign | null;
    comments: Comment[];
    loading: boolean;
    error: string | null;
    showCreateModal: boolean;
    showEditModal: boolean;
    showStatusModal: boolean;
    showCommentsModal: boolean;
}

const initialState: CampaignState = {
    campaigns: [],
    selectedCampaign: null,
    comments: [],
    loading: false,
    error: null,
    showCreateModal: false,
    showEditModal: false,
    showStatusModal: false,
    showCommentsModal: false,
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
        setShowCommentsModal: (state, action: PayloadAction<boolean>) => {
            state.showCommentsModal = action.payload;
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

            // Add Comment
            .addCase(addComment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addComment.fulfilled, (state, action) => {
                state.loading = false;
                state.comments.push(action.payload.data);
                toast.success("Comment added successfully");
            })
            .addCase(addComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                toast.error(state.error);
            })

            // Get Comments
            .addCase(getComments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getComments.fulfilled, (state, action) => {
                state.loading = false;
                state.comments = action.payload.data;
            })
            .addCase(getComments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                toast.error(state.error);
            })

            // Delete Comment
            .addCase(deleteComment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.loading = false;
                state.comments = state.comments.filter(comment => comment._id !== action.payload);
                toast.success("Comment deleted successfully");
            })
            .addCase(deleteComment.rejected, (state, action) => {
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
    setShowCommentsModal,
} = campaignSlice.actions;

export default campaignSlice.reducer;
