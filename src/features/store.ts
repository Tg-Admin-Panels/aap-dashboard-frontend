import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/user.slice'
import inventoryReducer from '../features/inventory/inventory.slice'
import authMiddleware from './middlewares/authMiddleware'
import wingReducer from "./wings/wings.slice"
import wingMembersReducer from "./wings/wingMembers.slice"
import volunteersReducer from "./volunteers/volunteers.slice"
import membersReducer from "./members/members.slice"
import volunteerMembers from "./members/volunteerMember.slice"
import boothTeamReducer from "./booth-team/boothTeam.slice"
import locationsReducer from "./locations/locations.slice"
import visionsReducer from "./visions/visions.slice"
import candidateApplicationReducer from "./candidate-applications/candidateApplication.slice"
import campaignReducer from "./campaigns/campaign.slice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    wings: wingReducer,
    wingMembers: wingMembersReducer,
    inventory: inventoryReducer,
    volunteers: volunteersReducer,
    members: membersReducer,
    volunteerMembers: volunteerMembers,
    boothTeam: boothTeamReducer,
    locations: locationsReducer,
    visions: visionsReducer,
    candidateApplications: candidateApplicationReducer,
    campaigns: campaignReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
