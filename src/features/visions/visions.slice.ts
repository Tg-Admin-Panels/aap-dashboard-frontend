import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { getAllVisions, createVision, getVisionDetails, addPointToVision, removePointFromVision, updateVision, deleteVision } from './visionsApi';

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
        toast.error(state.error);
      })
      .addCase(createVision.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVision.fulfilled, (state, action: PayloadAction<Vision>) => {
        state.loading = false;
        state.visions.push(action.payload);
        toast.success("Vision created successfully");
      })
      .addCase(createVision.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create vision';
        toast.error(state.error);
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
        toast.error(state.error);
      })
      .addCase(addPointToVision.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPointToVision.fulfilled, (state, action: PayloadAction<Vision>) => {
        state.loading = false;
        state.selectedVision = action.payload;
        toast.success("Point added successfully");
      })
      .addCase(addPointToVision.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add point to vision';
        toast.error(state.error);
      })
      .addCase(removePointFromVision.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removePointFromVision.fulfilled, (state, action) => {
        state.loading = false;
        // Filter out the removed point from the selectedVision's points array
        if (state.selectedVision) {
          state.selectedVision.points = state.selectedVision.points.filter(
            (p) => p !== action.meta.arg.point
          );
        }
        toast.success("Point removed successfully");
      })
      .addCase(removePointFromVision.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove point from vision';
        toast.error(state.error);
      })
      .addCase(updateVision.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVision.fulfilled, (state, action: PayloadAction<Vision>) => {
        state.loading = false;
        state.visions = state.visions.map((vision) =>
          vision._id === action.payload._id ? action.payload : vision
        );
        toast.success("Vision updated successfully");
      })
      .addCase(updateVision.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update vision';
        toast.error(state.error);
      })
      .addCase(deleteVision.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVision.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.visions = state.visions.filter((vision) => vision._id !== action.payload);
        toast.success("Vision deleted successfully");
      })
      .addCase(deleteVision.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete vision';
        toast.error(state.error);
      });
  },
});

export const { setShowAddPointModal, setSelectedPoint } = visionsSlice.actions;
export default visionsSlice.reducer;