import { createSlice } from "@reduxjs/toolkit";
import {
  getAllStates,
  getAllDistricts,
  getAllLegislativeAssemblies,
  getAllBooths,
  createState,
  createDistrict,
  createLegislativeAssembly,
  createBooth,
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
      .addCase(getAllStates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllStates.fulfilled, (state, action) => {
        state.states = action.payload.data;
        state.loading = false;
      })
      .addCase(getAllStates.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(createState.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createState.fulfilled, (state, action) => {
        state.states.push(action.payload.data);
        state.loading = false;
      })
      .addCase(createState.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(getAllDistricts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllDistricts.fulfilled, (state, action) => {
        state.districts = action.payload.data;
        state.loading = false;
      })
      .addCase(getAllDistricts.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(createDistrict.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDistrict.fulfilled, (state, action) => {
        state.districts.push(action.payload.data);
        state.loading = false;
      })
      .addCase(createDistrict.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(getAllLegislativeAssemblies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllLegislativeAssemblies.fulfilled, (state, action) => {
        state.legislativeAssemblies = action.payload.data;
        state.loading = false;
      })
      .addCase(getAllLegislativeAssemblies.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(createLegislativeAssembly.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLegislativeAssembly.fulfilled, (state, action) => {
        state.legislativeAssemblies.push(action.payload.data);
        state.loading = false;
      })
      .addCase(createLegislativeAssembly.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(getAllBooths.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBooths.fulfilled, (state, action) => {
        state.booths = action.payload.data;
        state.loading = false;
      })
      .addCase(getAllBooths.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(createBooth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooth.fulfilled, (state, action) => {
        state.booths.push(action.payload.data);
        state.loading = false;
      })
      .addCase(createBooth.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { clearDistricts, clearLegislativeAssemblies, clearBooths } = locationsSlice.actions;
export default locationsSlice.reducer;