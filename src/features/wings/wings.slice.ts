import { createSlice } from '@reduxjs/toolkit';
import { createWing, getAllWings,} from './wingsApi';


interface Member {
  _id: string;
  name: string;
  phone: string;
  image: string;
  role: string;
  post: string;
}


interface Wings {
  _id: string;
  name: string;
  leader: Member;
  members: Member[];
}

interface WingState {
  wings: Wings[];
  selectedWing: Wings | null;
  loading: boolean;
  error: string | null;
}

const initialState: WingState = {
  wings: [],
  selectedWing: null,
  loading: false,
  error: null,
};

const wingSlice = createSlice({
  name: 'wings',
  initialState,
  reducers: {
    setSelectedWingToNull: (state) => {
      state.selectedWing = null;
    },
    setErrorToNull: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createWing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWing.rejected, (state, action) => {
        state.error = String(action.payload) || "Failed to create wing";
        state.loading = false;
      })
      .addCase(createWing.fulfilled, (state, action) => {
        state.wings.push(action.payload?.data);
        state.selectedWing = action.payload?.data
        state.loading = false;
        state.error = null;
      })
      .addCase(getAllWings.fulfilled, (state, action) => {
        state.wings = action.payload.data;
      });
  },
});

export default wingSlice.reducer;

export const { setSelectedWingToNull, setErrorToNull } = wingSlice.actions;
