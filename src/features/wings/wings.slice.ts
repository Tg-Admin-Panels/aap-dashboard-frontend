import { createSlice } from "@reduxjs/toolkit";
import {
  addLeaderToWing,
  addMemberToWing,
  changeLeader,
  createWing,
  deleteWing,
  deleteWingMember,
  getAllWings,
  getWingMembers,
  updateMember,
} from "./wingsApi";
import { toast } from "react-toastify";

export interface WingMember {
  _id: string;
  name: string;
  phone: string;
  image: string;
  role: string;
  post: string;
}

interface Cta {
  label: string;
  href: string;
  variant: "primary" | "secondary" | "link";
}

interface Bullet {
  text: string;
  icon?: string;
}

interface Image {
  url: string;
  alt?: string;
  caption?: string;
  glow: {
    enabled: boolean;
    color: string;
  };
  aspectRatio?: string;
}

interface Hero {
  title: string;
  highlight?: string;
  subtitle?: string;
  description?: string;
  bullets: Bullet[];
  image: Image;
  ctas: {
    primary: Cta;
    secondary?: Cta;
  };
}

interface SectionHeader {
  title: string;
  subtitle?: string;
}

export interface Wings {
  _id: string;
  name: string;
  slug: string;
  leader?: WingMember;
  members: WingMember[];
  hero: Hero;
  ourLeadersSection: SectionHeader;
}

interface WingState {
  wings: Wings[];
  selectedWing: Wings | null;
  selectedMember: WingMember | null;
  loading: boolean;
  error: string | null;
  showCreateLeaderModal: boolean;
  showCreateMemberModal: boolean;
  showUpdateMemberModal: boolean;
  showChangeLeaderModal: boolean;
}

const initialState: WingState = {
  wings: [],
  selectedWing: null,
  selectedMember: null,
  loading: false,
  error: null,
  showCreateLeaderModal: false,
  showCreateMemberModal: false,
  showUpdateMemberModal: false,
  showChangeLeaderModal: false,
};

const wingSlice = createSlice({
  name: "wings",
  initialState,
  reducers: {
    setSelectedWingToNull: (state) => {
      state.selectedWing = null;
    },
    setErrorToNull: (state) => {
      state.error = null;
    },
    setShowCreateLeaderModal: (state, action) => {
      state.showCreateLeaderModal = action.payload;
    },
    setShowCreateMemberModal: (state, action) => {
      state.showCreateMemberModal = action.payload;
    },
    setSelectedMember: (state, action) => {
      state.selectedMember = action.payload;
    },
    setShowUpdateMemberModal: (state, action) => {
      state.showUpdateMemberModal = action.payload;
    },
    setShowChangeLeaderModal: (state, action) => {
      state.showChangeLeaderModal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create wing
      .addCase(createWing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWing.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to create wing";
        state.loading = false;
        toast.error(state.error);
      })
      .addCase(createWing.fulfilled, (state, action) => {
        state.wings.push(action.payload?.data);
        state.selectedWing = action.payload?.data;
        state.loading = false;
        state.error = null;
        state.showCreateLeaderModal = true;
        toast.success("Wing created successfully");
      })

      // get all wings
      .addCase(getAllWings.fulfilled, (state, action) => {
        state.wings = action.payload.data;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAllWings.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to get wings";
        state.loading = false;
        toast.error(state.error);
      })
      .addCase(getAllWings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // add leader to wing
      .addCase(addLeaderToWing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLeaderToWing.fulfilled, (state, action) => {
        state.selectedWing = action.payload?.data;
        console.log("wing leader data from api", state.selectedWing);
        state.showCreateLeaderModal = false;
        state.loading = false;
        state.error = null;
        toast.success("Leader added successfully");
      })
      .addCase(addLeaderToWing.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to add leader";
        state.loading = false;
        toast.error(state.error);
      })

      // add member to wing
      .addCase(addMemberToWing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMemberToWing.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to add member";
        state.loading = false;
        toast.error(state.error);
      })
      .addCase(addMemberToWing.fulfilled, (state, action) => {
        state.selectedWing?.members.push(action.payload?.data.member);
        state.showCreateMemberModal = false;
        state.loading = false;
        state.error = null;
        toast.success("Member added successfully");
      })

      // get wing members
      .addCase(getWingMembers.fulfilled, (state, action) => {
        state.selectedWing = action.payload?.data;
      })

      // change wing leader
      .addCase(changeLeader.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeLeader.fulfilled, (state, action) => {
        if (state.selectedWing) {
          state.selectedWing.leader = action.payload?.data.leader;
          state.selectedWing.members = action.payload?.data.members;
        }
        state.loading = false;
        state.error = null;
        state.showChangeLeaderModal = false;
        toast.success("Leader changed successfully");
      })
      .addCase(changeLeader.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload) || "Failed to change leader";
        toast.error(state.error);
      })

      // update member
      .addCase(updateMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMember.fulfilled, (state, action) => {
        const updatedMember = action.payload?.data;
        if (state.selectedWing) {
          if (updatedMember.role === "leader" && state.selectedWing.leader) {
            state.selectedWing.leader = updatedMember;
          }

          if (updatedMember.role === "member") {
            const index = state.selectedWing.members.findIndex(
              (m) => m._id === updatedMember._id
            );
            if (index !== -1) {
              state.selectedWing.members[index] = updatedMember;
            }
          }
        }
        state.showUpdateMemberModal = false;
        state.selectedMember = null;
        state.loading = false;
        toast.success("Member updated successfully");
      })
      .addCase(updateMember.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload) || "Failed to update member";
        toast.error(state.error);
      })
      .addCase(deleteWing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWing.fulfilled, (state, action) => {

        state.loading = false;
        state.error = null;
        state.wings = state.wings.filter(wing => String(wing._id) !== String(action.payload?.wingId));
        toast.success("Wing deleted successfully");
      })
      .addCase(deleteWing.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload) || "Failed to change leader";
        toast.error(state.error);
      })
      .addCase(deleteWingMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteWingMember.fulfilled, (state, action) => {
        const { wing, memberId } = action.payload;


        state.selectedWing = {
          ...state.selectedWing!,
          members: state.selectedWing?.members.filter(
            (member) => String(member._id) !== String(memberId)
          ) || [],
        }


        state.loading = false;
        state.error = null;
        toast.success("Wing member deleted successfully");
      })

      .addCase(deleteWingMember.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload) || "Failed to delete member";
        toast.error(state.error);
      });


  },
});

export default wingSlice.reducer;

export const {
  setSelectedWingToNull,
  setErrorToNull,
  setShowCreateLeaderModal,
  setShowCreateMemberModal,
  setSelectedMember,
  setShowUpdateMemberModal,
  setShowChangeLeaderModal,
} = wingSlice.actions;
