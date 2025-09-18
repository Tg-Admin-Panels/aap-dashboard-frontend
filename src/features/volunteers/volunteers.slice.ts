import { createSlice } from "@reduxjs/toolkit";
import {
  createVolunteer,
  getAllVolunteers,
  getVolunteerById,
  updateVolunteer,
  deleteVolunteer,
  updateVolunteerStatus,
} from "./volunteersApi";
import { toast } from "react-toastify";

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

// small helper to extract error message safely
const errMsg = (action: any, fallback: string) =>
  (action?.payload as string) || action?.error?.message || fallback;

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
      // CREATE
      .addCase(createVolunteer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVolunteer.fulfilled, (state, action) => {
        state.volunteers.push(action.payload.data);
        state.selectedVolunteer = action.payload.data;
        state.loading = false;
        toast.success("Volunteer created successfully");
      })
      .addCase(createVolunteer.rejected, (state, action) => {
        state.loading = false;
        state.error = errMsg(action, "Failed to create volunteer");
        toast.error(state.error);
      })

      // GET ALL
      .addCase(getAllVolunteers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllVolunteers.fulfilled, (state, action) => {
        state.volunteers = action.payload.data;
        state.loading = false;
      })
      .addCase(getAllVolunteers.rejected, (state, action) => {
        state.loading = false;
        state.error = errMsg(action, "Failed to fetch volunteers");
        toast.error(state.error);
      })

      // GET BY ID
      .addCase(getVolunteerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVolunteerById.fulfilled, (state, action) => {
        state.selectedVolunteer = action.payload.data;
        state.loading = false;
      })
      .addCase(getVolunteerById.rejected, (state, action) => {
        state.loading = false;
        state.error = errMsg(action, "Failed to fetch volunteer");
        toast.error(state.error);
      })

      // UPDATE
      .addCase(updateVolunteer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVolunteer.fulfilled, (state, action) => {
        const updated = action.payload.data;
        state.volunteers = state.volunteers.map((v) =>
          v._id === updated._id ? updated : v
        );
        state.selectedVolunteer = updated;
        state.loading = false;
        toast.success("Volunteer updated successfully");
      })
      .addCase(updateVolunteer.rejected, (state, action) => {
        state.loading = false;
        state.error = errMsg(action, "Failed to update volunteer");
        toast.error(state.error);
      })

      // DELETE
      .addCase(deleteVolunteer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVolunteer.fulfilled, (state, action) => {
        const id = action.payload.id;
        state.volunteers = state.volunteers.filter((v) => v._id !== id);
        state.selectedVolunteer = null;
        state.loading = false;
        toast.success("Volunteer deleted successfully");
      })
      .addCase(deleteVolunteer.rejected, (state, action) => {
        state.loading = false;
        state.error = errMsg(action, "Failed to delete volunteer");
        toast.error(state.error);
      })

      // UPDATE STATUS
      .addCase(updateVolunteerStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVolunteerStatus.fulfilled, (state, action) => {
        const updated = action.payload.data;
        const index = state.volunteers.findIndex((v) => v._id === updated._id);
        if (index !== -1) {
          state.volunteers[index].status = updated.status;
        }
        state.loading = false;
        toast.success("Volunteer status updated successfully");
      })
      .addCase(updateVolunteerStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = errMsg(action, "Failed to update status");
        toast.error(state.error);
      });
  },
});

export default volunteerSlice.reducer;
export const { clearSelectedVolunteer, clearVolunteerError } =
  volunteerSlice.actions;
