
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    createFormDefinition,
    fetchAllForms,
    fetchFormDefinition,
    fetchSubmissionsForForm,
    submitFormData,
    fetchSubmissionDetails
} from './formsApi';

interface FormsState {
    formsList: any[];
    currentFormDefinition: any | null;
    submissions: any[];
    currentSubmission: any | null;
    loading: boolean;
    error: string | null;
}

const initialState: FormsState = {
    formsList: [],
    currentFormDefinition: null,
    submissions: [],
    currentSubmission: null,
    loading: false,
    error: null,
};

const formsSlice = createSlice({
    name: 'forms',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearLoading: (state) => {
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // createFormDefinition
            .addCase(createFormDefinition.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createFormDefinition.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createFormDefinition.rejected, (state, action) => {
                state.loading = false;
                state.error = String(action.payload);
            })

            // fetchAllForms
            .addCase(fetchAllForms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllForms.fulfilled, (state, action: PayloadAction<any[]>) => {
                state.loading = false;
                state.formsList = action.payload;
            })
            .addCase(fetchAllForms.rejected, (state, action) => {
                state.loading = false;
                state.error = String(action.payload) || 'error in fetching all form';
            })

            // fetchFormDefinition
            .addCase(fetchFormDefinition.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFormDefinition.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.currentFormDefinition = action.payload;
            })
            .addCase(fetchFormDefinition.rejected, (state, action) => {
                state.loading = false;
                state.error = String(action.payload);
            })

            // fetchSubmissionsForForm
            .addCase(fetchSubmissionsForForm.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubmissionsForForm.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.currentFormDefinition = action.payload.formDefinition;
                state.submissions = action.payload.submissions;
            })
            .addCase(fetchSubmissionsForForm.rejected, (state, action) => {
                state.loading = false;
                state.error = String(action.payload);
            })

            // submitFormData
            .addCase(submitFormData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitFormData.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(submitFormData.rejected, (state, action) => {
                state.loading = false;
                state.error = String(action.payload);
            })

            // fetchSubmissionDetails
            .addCase(fetchSubmissionDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubmissionDetails.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.currentSubmission = action.payload;
            })
            .addCase(fetchSubmissionDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = String(action.payload);
            });
    },
});

export const { clearError, clearLoading } = formsSlice.actions;
export default formsSlice.reducer;
