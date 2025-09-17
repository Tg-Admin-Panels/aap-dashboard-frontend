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
} from "./locationsApi";

interface LocationItem {
  _id: string;
  name: string;
  code: string;
  parentId?: string;
}

interface LocationsState {
  states: LocationItem[];
  districts: LocationItem[];
  legislativeAssemblies: LocationItem[];
  booths: LocationItem[];
  loading: boolean;
  error: string | null;
}

const initialState: LocationsState = {
  states: [],
  districts: [],
  legislativeAssemblies: [],
  booths: [],
  loading: false,
  error: null,
};

const locationsSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {
    clearDistricts: (state) => {
      state.districts = [];
      state.legislativeAssemblies = [];
      state.booths = [];
    },
    clearLegislativeAssemblies: (state) => {
      state.legislativeAssemblies = [];
      state.booths = [];
    },
    clearBooths: (state) => {
      state.booths = [];
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
        state.states = action.payload.data;
        state.loading = false;
      })
      .addCase(getAllStates.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to get states";
        state.loading = false;
        toast.error(state.error);
      })
      .addCase(createState.fulfilled, (state, action) => {
        state.states.push(action.payload.data);
        state.loading = false;
        toast.success("State created successfully");
      })
      .addCase(createState.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to create state";
        state.loading = false;
        toast.error(state.error);
      })
      .addCase(bulkUploadStates.fulfilled, (state, action) => {
        state.states = [...state.states, ...action.payload.data];
        state.loading = false;
        toast.success("States uploaded successfully");
      })
      .addCase(bulkUploadStates.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to upload states";
        state.loading = false;
        toast.error(state.error);
      })

      // ================= Districts =================
      .addCase(getAllDistricts.fulfilled, (state, action) => {
        state.districts = action.payload.data;
        state.loading = false;
      })
      .addCase(getAllDistricts.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to get districts";
        state.loading = false;
        toast.error(state.error);
      })
      .addCase(createDistrict.fulfilled, (state, action) => {
        state.districts.push(action.payload.data);
        state.loading = false;
        toast.success("District created successfully");
      })
      .addCase(createDistrict.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to create district";
        state.loading = false;
        toast.error(state.error);
      })
      .addCase(bulkUploadDistricts.fulfilled, (state, action) => {
        state.districts = [...state.districts, ...action.payload.data];
        state.loading = false;
        toast.success("Districts uploaded successfully");
      })
      .addCase(bulkUploadDistricts.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to upload districts";
        state.loading = false;
        toast.error(state.error);
      })

      // ================= Legislative Assemblies =================
      .addCase(getAllLegislativeAssemblies.fulfilled, (state, action) => {
        state.legislativeAssemblies = action.payload.data;
        state.loading = false;
      })
      .addCase(getAllLegislativeAssemblies.rejected, (state, action) => {
        state.error =
          String(action.payload) || "Failed to get legislative assemblies";
        state.loading = false;
        toast.error(state.error);
      })
      .addCase(createLegislativeAssembly.fulfilled, (state, action) => {
        state.legislativeAssemblies.push(action.payload.data);
        state.loading = false;
        toast.success("Legislative Assembly created successfully");
      })
      .addCase(createLegislativeAssembly.rejected, (state, action) => {
        state.error =
          String(action.payload) || "Failed to create legislative assembly";
        state.loading = false;
        toast.error(state.error);
      })
      .addCase(bulkUploadLegislativeAssemblies.fulfilled, (state, action) => {
        state.legislativeAssemblies = [
          ...state.legislativeAssemblies,
          ...action.payload.data,
        ];
        state.loading = false;
        toast.success("Legislative Assemblies uploaded successfully");
      })
      .addCase(bulkUploadLegislativeAssemblies.rejected, (state, action) => {
        state.error =
          String(action.payload) || "Failed to upload legislative assemblies";
        state.loading = false;
        toast.error(state.error);
      })

      // ================= Booths =================
      .addCase(getAllBooths.fulfilled, (state, action) => {
        state.booths = action.payload.data;
        state.loading = false;
      })
      .addCase(getAllBooths.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to get booths";
        state.loading = false;
        toast.error(state.error);
      })
      .addCase(createBooth.fulfilled, (state, action) => {
        state.booths.push(action.payload.data);
        state.loading = false;
        toast.success("Booth created successfully");
      })
      .addCase(createBooth.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to create booth";
        state.loading = false;
        toast.error(state.error);
      })
      .addCase(bulkUploadBooths.fulfilled, (state, action) => {
        state.booths = [...state.booths, ...action.payload.data];
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
