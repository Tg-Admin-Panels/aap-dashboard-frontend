import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/user.slice'
import inventoryReducer from '../features/inventory/inventory.slice'
import authMiddleware from './middlewares/authMiddleware'
import wingReducer from "./wings/wings.slice"
import wingMembersReducer from "./wings/wingMembers.slice"
import volunteersReducer from "./volunteers/volunteers.slice"
import membersReducer from "./members/members.slice"
import volunteerMembers from "./members/volunteerMember.slice"
const store = configureStore({
  reducer: {
    auth: authReducer,
    wings: wingReducer,
    wingMembers: wingMembersReducer,
    inventory: inventoryReducer,
    volunteers: volunteersReducer,
    members: membersReducer,
    volunteerMembers: volunteerMembers,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
