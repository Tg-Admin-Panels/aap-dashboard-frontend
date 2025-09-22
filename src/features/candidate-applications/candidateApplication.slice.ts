
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
    createCandidateApplication,
    getAllCandidateApplications,
    getCandidateApplicationById,
    updateCandidateApplication,
    deleteCandidateApplication,
    updateCandidateApplicationStatus,
} from "./candidateApplicationApi";

export interface CandidateApplication {
    _id: string;
    // 1. व्यक्तिगत विवरण
    applicantName: string;
    fatherName: string;
    fatherOccupation?: string;
    dob: string;
    age: number;
    gender: "Male" | "Female" | "Other";
    religion?: string;
    maritalStatus?: "Married" | "Unmarried" | "Other";
    state: { _id: string; name: string };
    district: { _id: string; name: string };
    legislativeAssembly: { _id: string; name: string };
    address: string;
    pincode?: string;

    // 2. संपर्क विवरण
    mobile: string;
    whatsapp?: string;
    email?: string;
    facebookFollowers?: number;
    facebookLink?: string;
    instagramFollowers?: number;
    instagramLink?: string;

    // 3. शैक्षिक एवं आर्थिक विवरण
    education?: string;
    panNumber?: string;
    occupation?: string;
    occupation1?: string;
    occupation2?: string;
    occupation3?: string;
    itrAmount?: number;
    totalAssets?: number;
    vehicleDetails?: string;

    // 4. चुनाव सम्बन्धी विवरण
    pastElection?: string;
    totalBooths?: number;
    activeBooths?: number;

    // 5. टीम विवरण
    teamMembers: { name: string; mobile: string }[];

    // 6. सामाजिक गतिविधियाँ
    socialPrograms?: string;

    // 7. आगामी कार्यक्रम
    programDate?: string;
    meetingDate?: string;

    // 8. जीवनी
    biodataPdf: string;
    biodataPdfPublicId?: string;

    // Meta
    status: "pending" | "approved" | "rejected";
    notes?: string;
}

interface CandidateApplicationState {
    applications: CandidateApplication[];
    selectedApplication: CandidateApplication | null;
    loading: boolean;
    error: string | null;
    showCreateModal: boolean;
    showUpdateModal: boolean;
    showStatusModal: boolean;
    showViewModal: boolean;
}

const initialState: CandidateApplicationState = {
    applications: [],
    selectedApplication: null,
    loading: false,
    error: null,
    showCreateModal: false,
    showUpdateModal: false,
    showStatusModal: false,
    showViewModal: false,
};

const candidateApplicationSlice = createSlice({
    name: "candidateApplications",
    initialState,
    reducers: {
        setSelectedApplication: (state, action: PayloadAction<CandidateApplication | null>) => {
            state.selectedApplication = action.payload;
        },
        setErrorToNull: (state) => {
            state.error = null;
        },
        setShowCreateModal: (state, action: PayloadAction<boolean>) => {
            state.showCreateModal = action.payload;
        },
        setShowUpdateModal: (state, action: PayloadAction<boolean>) => {
            state.showUpdateModal = action.payload;
        },
        setShowStatusModal: (state, action: PayloadAction<boolean>) => {
            state.showStatusModal = action.payload;
        },
        setShowViewModal: (state, action: PayloadAction<boolean>) => {
            state.showViewModal = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create
            .addCase(createCandidateApplication.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCandidateApplication.fulfilled, (state, action) => {
                state.loading = false;
                state.applications.push(action.payload.data);
                state.showCreateModal = false;
                toast.success("Application submitted successfully");
            })
            .addCase(createCandidateApplication.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                toast.error(state.error);
            })

            // Read all
            .addCase(getAllCandidateApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCandidateApplications.fulfilled, (state, action) => {
                state.loading = false;
                state.applications = action.payload.data;
            })
            .addCase(getAllCandidateApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                toast.error(state.error);
            })

            // Read one
            .addCase(getCandidateApplicationById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCandidateApplicationById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedApplication = action.payload.data;
            })
            .addCase(getCandidateApplicationById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                toast.error(state.error);
            })

            // Update
            .addCase(updateCandidateApplication.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCandidateApplication.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.applications.findIndex(app => app._id === action.payload.data._id);
                if (index !== -1) {
                    state.applications[index] = action.payload.data;
                }
                state.showUpdateModal = false;
                toast.success("Application updated successfully");
            })
            .addCase(updateCandidateApplication.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                toast.error(state.error);
            })

            // Delete
            .addCase(deleteCandidateApplication.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCandidateApplication.fulfilled, (state, action) => {
                state.loading = false;
                state.applications = state.applications.filter(app => app._id !== action.payload);
                toast.success("Application deleted successfully");
            })
            .addCase(deleteCandidateApplication.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                toast.error(state.error);
            })

            // Update status
            .addCase(updateCandidateApplicationStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCandidateApplicationStatus.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.applications.findIndex(app => app._id === action.payload.data._id);
                if (index !== -1) {
                    state.applications[index] = action.payload.data;
                }
                state.showStatusModal = false;
                toast.success("Status updated successfully");
            })
            .addCase(updateCandidateApplicationStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                toast.error(state.error);
            });
    },
});

export const {
    setSelectedApplication,
    setErrorToNull,
    setShowCreateModal,
    setShowUpdateModal,
    setShowStatusModal,
    setShowViewModal,
} = candidateApplicationSlice.actions;

export default candidateApplicationSlice.reducer;
