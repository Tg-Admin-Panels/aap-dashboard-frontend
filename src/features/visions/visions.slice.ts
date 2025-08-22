import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAllVisions, createVision, getVisionDetails, addPointToVision, removePointFromVision } from './visionsApi';

export interface Vision {
  _id: string;
  title: string;
  image: string;
  points: string[];
  icon: string;
}

interface VisionsState {
  visions: Vision[];
  selectedVision: Vision | null;
  loading: boolean;
  error: string | null;
  showAddPointModal: boolean;
  selectedPoint: string | null;
}

const initialState: VisionsState = {
  visions: [],
  selectedVision: null,
  loading: false,
  error: null,
  showAddPointModal: false,
  selectedPoint: null,
};

const visionsSlice = createSlice({
  name: 'visions',
  initialState,
  reducers: {
    setShowAddPointModal: (state, action: PayloadAction<boolean>) => {
      state.showAddPointModal = action.payload;
    },
    setSelectedPoint: (state, action: PayloadAction<string | null>) => {
      state.selectedPoint = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllVisions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllVisions.fulfilled, (state, action: PayloadAction<Vision[]>) => {
        state.loading = false;
        state.visions = action.payload;
      })
      .addCase(getAllVisions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch visions';
      })
      .addCase(createVision.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVision.fulfilled, (state, action: PayloadAction<Vision>) => {
        state.loading = false;
        state.visions.push(action.payload);
      })
      .addCase(createVision.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create vision';
      })
      .addCase(getVisionDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVisionDetails.fulfilled, (state, action: PayloadAction<Vision>) => {
        state.loading = false;
        state.selectedVision = action.payload;
      })
      .addCase(getVisionDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch vision details';
      })
      .addCase(addPointToVision.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPointToVision.fulfilled, (state, action: PayloadAction<Vision>) => {
        state.loading = false;
        state.selectedVision = action.payload;
      })
      .addCase(addPointToVision.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add point to vision';
      })
      .addCase(removePointFromVision.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removePointFromVision.fulfilled, (state, action: PayloadAction<Vision>) => {
        state.loading = false;
        state.selectedVision = action.payload;
      })
      .addCase(removePointFromVision.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove point from vision';
      });
  },
});

export const { setShowAddPointModal, setSelectedPoint } = visionsSlice.actions;
export default visionsSlice.reducer;
