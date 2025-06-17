import { createSlice } from "@reduxjs/toolkit";
import {
  createVolunteer,
  getAllVolunteers,
  getVolunteerById,
  updateVolunteer,
  deleteVolunteer,
  updateVolunteerStatus,
} from "./volunteersApi";

interface Volunteer {
  _id: string;
  fullName: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  mobileNumber: string;
  religion?: string;
  profilePicture?: string;
  zone: string;
  district: string;
  block: string;
  wardNumber?: string;
  boothNumber?: string;
  pinCode?: string;
  postOffice?: string;
  cityName?: string;
  streetOrLocality?: string;
  panchayat?: string;
  villageName?: string;
  status: string;
}

interface VolunteerState {
  volunteers: Volunteer[];
  selectedVolunteer: Volunteer | null;
  loading: boolean;
  error: string | null;
}

const initialState: VolunteerState = {
  volunteers: [],
  selectedVolunteer: null,
  loading: false,
  error: null,
};

const volunteerSlice = createSlice({
  name: "volunteers",
  initialState,
  reducers: {
    clearSelectedVolunteer: (state) => {
      state.selectedVolunteer = null;
    },
    clearVolunteerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createVolunteer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVolunteer.fulfilled, (state, action) => {
        state.volunteers.push(action.payload.data);
        state.selectedVolunteer = action.payload.data;
        state.loading = false;
      })
      .addCase(createVolunteer.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      .addCase(getAllVolunteers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllVolunteers.fulfilled, (state, action) => {
        state.volunteers = action.payload.data;
        state.loading = false;
      })
      .addCase(getAllVolunteers.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      .addCase(getVolunteerById.fulfilled, (state, action) => {
        state.selectedVolunteer = action.payload.data;
      })

      .addCase(updateVolunteer.fulfilled, (state, action) => {
        const updated = action.payload.data;
        state.volunteers = state.volunteers.map((v) =>
          v._id === updated._id ? updated : v
        );
        state.selectedVolunteer = updated;
      })

      .addCase(deleteVolunteer.fulfilled, (state, action) => {
        const id = action.payload.id;
        state.volunteers = state.volunteers.filter((v) => v._id !== id);
        state.selectedVolunteer = null;
      })
      .addCase(updateVolunteerStatus.fulfilled, (state, action) => {
        const updated = action.payload.data;
        const index = state.volunteers.findIndex((v) => v._id === updated._id);
        if (index !== -1) {
          state.volunteers[index].status = updated.status;
        }
      });
  },
});

export default volunteerSlice.reducer;
export const { clearSelectedVolunteer, clearVolunteerError } =
  volunteerSlice.actions;
