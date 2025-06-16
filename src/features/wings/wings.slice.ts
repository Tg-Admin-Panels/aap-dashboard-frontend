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
  wings: Array<Wings>(),
  selectedWing: null,
  loading: false,
  error: null,
};

const wingSlice = createSlice({
  name: 'wings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    //   .addCase(getAllMedicines.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
      // .addCase(getAllMedicines.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.medicines = action.payload.data;
      // })
      // .addCase(getAllMedicines.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.error.message || 'Failed to fetch medicines';
      // })
      // .addCase(createMedicine.fulfilled, (state, action) => {
      //   state.medicines.push(action.payload);
      // })
      .addCase(createWing.fulfilled, (state, action) => {
        state.wings.push(action.payload);
      })
      .addCase(getAllWings.fulfilled, (state, action) => {
        state.wings = action.payload.data;
      })
      // .addCase(deleteMedicineById.fulfilled, (state, action) => {
      //   state.medicines = state.medicines.filter((medicine) => medicine.medicineId !== action.payload);
      // })
      // .addCase(getMedicineById.fulfilled, (state, action) => {
      //   state.selectedMedicine = action.payload;
      // })
      // .addCase(updateMedicineById.fulfilled, (state, action) => {
      //   const index = state.medicines.findIndex((medicine) => medicine.medicineId === action.payload.medicineId);
      //   if (index !== -1) {
      //     state.medicines[index] = action.payload;
      //   }
      // });
  },
});

export default wingSlice.reducer;
