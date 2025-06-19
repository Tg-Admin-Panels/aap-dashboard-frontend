import { createSlice } from "@reduxjs/toolkit";
interface Member {
  _id: string;
  name: string;
  phone: string;
  image: string;
  role: string;
  post: string;
}

interface MemberState {
  members: Member[];
  loading: boolean;
  error: string | null;
}

const initialState: MemberState = {
  members: [],
  loading: false,
  error: null,
};

const wingMemberSlice = createSlice({
  name: "wings",
  initialState,
  reducers: {
    setErrorToNull: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // .addCase(getAllWingMembers.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(getAllWingMembers.rejected, (state, action) => {
      //   state.error = String(action.payload) || "Failed to create wing";
      //   state.loading = false;
      // })
      // .addCase(getAllWingMembers.fulfilled, (state, action) => {
      //   state.members = action.payload.data;
      //   state.loading = false;
      //   state.error = null;
      // });
  },
});

export default wingMemberSlice.reducer;

export const { setErrorToNull } = wingMemberSlice.actions;
