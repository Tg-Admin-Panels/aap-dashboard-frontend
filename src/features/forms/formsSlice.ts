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
    },
    extraReducers: (builder) => {
        builder
            // Handle fulfilled states specifically
            .addCase(createFormDefinition.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(fetchAllForms.fulfilled, (state, action: PayloadAction<any[]>) => {
                state.loading = false;
                state.formsList = action.payload;
            })
            .addCase(fetchFormDefinition.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.currentFormDefinition = action.payload;
            })
            .addCase(fetchSubmissionsForForm.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.currentFormDefinition = action.payload.formDefinition;
                state.submissions = action.payload.submissions;
            })
            .addCase(submitFormData.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(fetchSubmissionDetails.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.currentSubmission = action.payload;
            })

            // Handle loading and error states generically using matchers
            // These must come AFTER all addCase calls
            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action: PayloadAction<string>) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            );
    },
});

export const { clearError } = formsSlice.actions;
export default formsSlice.reducer;