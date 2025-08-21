import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./features/store";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import MedicineList from "./pages/wings/WingTable";
import ProtectedLayout from "./layout/ProtectedLayout";
import { useEffect } from "react";
import CreateWing from "./pages/wings/CreateWingForm";
import { Bounce, ToastContainer } from "react-toastify";
import VolunteerTable from "./pages/volunteers/VolunteersList";
import MemberTable from "./pages/members/membersTable";
import VolunteerDetailsPage from "./pages/volunteers/volunteersDetailsPage";
import { checkAuth } from "./features/auth/authApi";
import WingDetails from "./pages/wings/WingDetailsPage";
import BoothTeamList from "./pages/booth-team/BoothTeam";
import AddBoothTeamMember from "./pages/booth-team/AddBoothTeamMember";
import LocationDropdowns from "./pages/OtherPage/LocationDropdowns";
import CreateState from "./pages/Locations/CreateState";
import CreateDistrict from "./pages/Locations/CreateDistrict";
import CreateLegislativeAssembly from "./pages/Locations/CreateLegislativeAssembly";
import CreateBooth from "./pages/Locations/CreateBooth";

export default function App() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const dispatch = useDispatch<AppDispatch>();

  console.log("isAuthenticated", isAuthenticated);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isAuthenticated == null) {
    return <div className="flex flex-col items-center justify-center h-screen bg-white text-gray-800">
      <img
        src="../images/logo/app-logo.png" // Replace with your logo path
        alt="Logo"
        className="h-24 mb-4 brightness-0 dark:brightness-100"
      />
      <p className="text-lg font-semibold">Loading...</p>
    </div>
  }

  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <ScrollToTop />
      <Routes>
        {/* Prevent authenticated users from accessing SignIn or SignUp */}
        <Route
          path="/signin"
          element={isAuthenticated ? <Navigate to="/" /> : <SignIn />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" /> : <SignUp />}
        />

        {/* Protected Routes */}
        <Route element={<ProtectedLayout />}>
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            <Route path="/wing/add" element={<CreateWing />} />
            <Route path="/wing/list" element={<MedicineList />} />
            <Route path="/wings/:id/details" element={<WingDetails />} />
            <Route path="/volunteers/" element={<VolunteerTable />} />
            <Route
              path="/volunteers/:volunteerId"
              element={<VolunteerDetailsPage />}
            />
            <Route path="/members/" element={<MemberTable />} />
            <Route path="/booth-team" element={<BoothTeamList />} />
            <Route path="/booth-team/add" element={<AddBoothTeamMember />} />
            <Route path="/locations" element={<LocationDropdowns />} />
            <Route path="/locations/create-state" element={<CreateState />} />
            <Route path="/locations/create-district" element={<CreateDistrict />} />
            <Route path="/locations/create-assembly" element={<CreateLegislativeAssembly />} />
            <Route path="/locations/create-booth" element={<CreateBooth />} />
          </Route>
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
