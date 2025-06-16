import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/user.slice'
import inventoryReducer from '../features/inventory/inventory.slice'
import activeMedicineReducer from './wings/activeMedicine.slice'
import authMiddleware from './middlewares/authMiddleware'
import wingReducer from "./wings/wings.slice"
import wingMembersReducer from "./wings/wingMembers.slice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    wings:wingReducer,
    wingMembers:wingMembersReducer,
    inventory:inventoryReducer,
    activeMedicines:activeMedicineReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
