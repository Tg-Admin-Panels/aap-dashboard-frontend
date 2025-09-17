import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  getAllStates,
  getAllDistricts,
  getAllLegislativeAssemblies,
  getAllBooths,
  createState,
  createDistrict,
  createLegislativeAssembly,
  createBooth,
  bulkUploadStates,
  bulkUploadDistricts,
  bulkUploadLegislativeAssemblies,
  bulkUploadBooths,
  updateState,
  deleteState,
  updateDistrict,
  deleteDistrict,
  updateLegislativeAssembly,
  deleteLegislativeAssembly,
  updateBooth,
  deleteBooth,
} from "./locationsApi";

interface LocationItem {
  _id: string;
  name: string;
  code: string;
  parentId?: string;
}

interface PaginatedData {
  items: LocationItem[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

interface LocationsState {
  states: PaginatedData;
  districts: PaginatedData;
  legislativeAssemblies: PaginatedData;
  booths: PaginatedData;
  loading: boolean;
  error: string | null;
}

const initialPaginatedData: PaginatedData = {
  items: [],
  total: 0,
  page: 1,
  limit: 100,
  hasNextPage: false,
};

const initialState: LocationsState = {
  states: initialPaginatedData,
  districts: initialPaginatedData,
  legislativeAssemblies: initialPaginatedData,
  booths: initialPaginatedData,
  loading: false,
  error: null,
};

const locationsSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {
    clearDistricts: (state) => {
      state.districts = initialPaginatedData;
      state.legislativeAssemblies = initialPaginatedData;
      state.booths = initialPaginatedData;
    },
    clearLegislativeAssemblies: (state) => {
      state.legislativeAssemblies = initialPaginatedData;
      state.booths = initialPaginatedData;
    },
    clearBooths: (state) => {
      state.booths = initialPaginatedData;
    },
  },
  extraReducers: (builder) => {
    builder
      // ================= States =================
      .addCase(getAllStates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllStates.fulfilled, (state, action) => {
        const { data, pagination } = action.payload;
        if (pagination.page === 1) {
          state.states.items = data;
        } else {
          state.states.items.push(...data);
        }
        state.states.total = pagination.total;
        state.states.page = pagination.page;
        state.states.limit = pagination.limit;
        state.states.hasNextPage = pagination.hasNextPage;
        state.loading = false;
      })
      .addCase(getAllStates.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to get states";
        state.loading = false;
        toast.error(state.error);
      })
      .addCase(createState.fulfilled, (state, action) => {
        state.states.items.unshift(action.payload.data);
        state.loading = false;
        toast.success("State created successfully");
      })
      .addCase(createState.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to create state";
        state.loading = false;
        toast.error(state.error);
      })
      .addCase(updateState.fulfilled, (state, action) => {
        const index = state.states.items.findIndex(s => s._id === action.payload.data._id);
        if (index !== -1) state.states.items[index] = action.payload.data;
        state.loading = false;
        toast.success("State updated successfully");
      })
      .addCase(updateState.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to update state";
        state.loading = false;
        toast.error(state.error);
      })
      .addCase(deleteState.fulfilled, (state, action) => {
        state.states.items = state.states.items.filter(s => s._id !== action.meta.arg);
        state.loading = false;
        toast.success("State deleted successfully");
      })
      .addCase(deleteState.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to delete state";
        state.loading = false;
        toast.error(state.error);
      })
      .addCase(bulkUploadStates.fulfilled, (state, action) => {
        // After bulk upload, we should probably refetch page 1
        state.loading = false;
        toast.success("States uploaded successfully");
      })
      .addCase(bulkUploadStates.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to upload states";
        state.loading = false;
        toast.error(state.error);
      })

      // ================= Districts =================
      .addCase(getAllDistricts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllDistricts.fulfilled, (state, action) => {
        const { data, pagination } = action.payload;
        if (pagination.page === 1) {
          state.districts.items = data;
        } else {
          state.districts.items.push(...data);
        }
        state.districts.total = pagination.total;
        state.districts.page = pagination.page;
        state.districts.limit = pagination.limit;
        state.districts.hasNextPage = pagination.hasNextPage;
        state.loading = false;
      })
      .addCase(getAllDistricts.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to get districts";
        state.loading = false;
        toast.error(state.error);
      })
      .addCase(createDistrict.fulfilled, (state, action) => {
        state.districts.items.unshift(action.payload.data);
        state.loading = false;
        toast.success("District created successfully");
      })
      .addCase(createDistrict.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to create district";
        state.loading = false;
        toast.error(state.error);
      })
      .addCase(updateDistrict.fulfilled, (state, action) => {
        const index = state.districts.items.findIndex(d => d._id === action.payload.data._id);
        if (index !== -1) state.districts.items[index] = action.payload.data;
        state.loading = false;
        toast.success("District updated successfully");
      })
      .addCase(updateDistrict.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to update district";
        state.loading = false;
        toast.error(state.error);
      })
      .addCase(deleteDistrict.fulfilled, (state, action) => {
        state.districts.items = state.districts.items.filter(d => d._id !== action.meta.arg);
        state.loading = false;
        toast.success("District deleted successfully");
      })
      .addCase(deleteDistrict.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to delete district";
        state.loading = false;
        toast.error(state.error);
      })
      .addCase(bulkUploadDistricts.fulfilled, (state, action) => {
        state.loading = false;
        toast.success("Districts uploaded successfully");
      })
      .addCase(bulkUploadDistricts.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to upload districts";
        state.loading = false;
        toast.error(state.error);
      })

      // ================= Legislative Assemblies =================
      .addCase(getAllLegislativeAssemblies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllLegislativeAssemblies.fulfilled, (state, action) => {
        const { data, pagination } = action.payload;
        if (pagination.page === 1) {
          state.legislativeAssemblies.items = data;
        } else {
          state.legislativeAssemblies.items.push(...data);
        }
        state.legislativeAssemblies.total = pagination.total;
        state.legislativeAssemblies.page = pagination.page;
        state.legislativeAssemblies.limit = pagination.limit;
        state.legislativeAssemblies.hasNextPage = pagination.hasNextPage;
        state.loading = false;
      })
      .addCase(getAllLegislativeAssemblies.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to get legislative assemblies";
        state.loading = false;
        toast.error(state.error);
      })
      .addCase(createLegislativeAssembly.fulfilled, (state, action) => {
        state.legislativeAssemblies.items.unshift(action.payload.data);
        state.loading = false;
        toast.success("Legislative Assembly created successfully");
      })
      .addCase(createLegislativeAssembly.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to create legislative assembly";
        state.loading = false;
        toast.error(state.error);
      })
      .addCase(updateLegislativeAssembly.fulfilled, (state, action) => {
        const index = state.legislativeAssemblies.items.findIndex(a => a._id === action.payload.data._id);
        if (index !== -1) state.legislativeAssemblies.items[index] = action.payload.data;
        state.loading = false;
        toast.success("Legislative Assembly updated successfully");
      })
      .addCase(updateLegislativeAssembly.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to update legislative assembly";
        state.loading = false;
        toast.error(state.error);
      })
      .addCase(deleteLegislativeAssembly.fulfilled, (state, action) => {
        state.legislativeAssemblies.items = state.legislativeAssemblies.items.filter(a => a._id !== action.meta.arg);
        state.loading = false;
        toast.success("Legislative Assembly deleted successfully");
      })
      .addCase(deleteLegislativeAssembly.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to delete legislative assembly";
        state.loading = false;
        toast.error(state.error);
      })
      .addCase(bulkUploadLegislativeAssemblies.fulfilled, (state, action) => {
        state.loading = false;
        toast.success("Legislative Assemblies uploaded successfully");
      })
      .addCase(bulkUploadLegislativeAssemblies.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to upload legislative assemblies";
        state.loading = false;
        toast.error(state.error);
      })

      // ================= Booths =================
      .addCase(getAllBooths.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBooths.fulfilled, (state, action) => {
        const { data, pagination } = action.payload;
        if (pagination.page === 1) {
          state.booths.items = data;
        } else {
          state.booths.items.push(...data);
        }
        state.booths.total = pagination.total;
        state.booths.page = pagination.page;
        state.booths.limit = pagination.limit;
        state.booths.hasNextPage = pagination.hasNextPage;
        state.loading = false;
      })
      .addCase(getAllBooths.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to get booths";
        state.loading = false;
        toast.error(state.error);
      })
      .addCase(createBooth.fulfilled, (state, action) => {
        state.booths.items.unshift(action.payload.data);
        state.loading = false;
        toast.success("Booth created successfully");
      })
      .addCase(createBooth.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to create booth";
        state.loading = false;
        toast.error(state.error);
      })
      .addCase(updateBooth.fulfilled, (state, action) => {
        const index = state.booths.items.findIndex(b => b._id === action.payload.data._id);
        if (index !== -1) state.booths.items[index] = action.payload.data;
        state.loading = false;
        toast.success("Booth updated successfully");
      })
      .addCase(updateBooth.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to update booth";
        state.loading = false;
        toast.error(state.error);
      })
      .addCase(deleteBooth.fulfilled, (state, action) => {
        state.booths.items = state.booths.items.filter(b => b._id !== action.meta.arg);
        state.loading = false;
        toast.success("Booth deleted successfully");
      })
      .addCase(deleteBooth.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to delete booth";
        state.loading = false;
        toast.error(state.error);
      })
      .addCase(bulkUploadBooths.fulfilled, (state, action) => {
        state.loading = false;
        toast.success("Booths uploaded successfully");
      })
      .addCase(bulkUploadBooths.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to upload booths";
        state.loading = false;
        toast.error(state.error);
      });
  },
});

export const { clearDistricts, clearLegislativeAssemblies, clearBooths } =
  locationsSlice.actions;

export default locationsSlice.reducer;
