
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import CreateVolunteer from "./pages/volunteers/CreateVolunteer";
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
import VisionTable from "./pages/Visions/VisionTable";
import CreateVisionForm from "./pages/Visions/CreateVisionForm";
import VisionDetails from "./pages/Visions/VisionDetailsPage";
import CandidateApplications from "./pages/candidate-applications";
import ApplyForCandidacy from "./pages/candidate-applications/apply";
import Campaigns from "./pages/campaigns";
import CreateMember from "./pages/members/CreateMember";
import UpdateMember from "./pages/members/UpdateMember";
import DetailMember from "./pages/members/DetailMember";
import SpinnerOverlay from "./components/ui/SpinnerOverlay";
import CreateForm from "./pages/Forms/CreateForm";
import ViewSubmissions from "./pages/Forms/ViewSubmissions";
import SubmitForm from "./pages/Forms/SubmitForm";
import SubmissionDetail from "./pages/Forms/SubmissionDetail";

export default function App() {
  const { isAuthenticated, status } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (status === 'idle') {
      dispatch(checkAuth());
    }
  }, [status, dispatch]);

  if (status === 'loading' || status === 'idle') {
    return <SpinnerOverlay loading={true} />;
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
        <Route
          path="/signin"
          element={isAuthenticated ? <Navigate to="/" /> : <SignIn />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" /> : <SignUp />}
        />

        <Route element={<ProtectedLayout />}>
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            <Route path="/wing/add" element={<CreateWing />} />
            <Route path="/wing/list" element={<MedicineList />} />
            <Route path="/wings/:id/details" element={<WingDetails />} />
            <Route path="/volunteers/" element={<VolunteerTable />} />
            <Route path="/volunteers/add" element={<CreateVolunteer />} />
            <Route
              path="/volunteers/:volunteerId"
              element={<VolunteerDetailsPage />}
            />
            <Route path="/members/" element={<MemberTable />} />
            <Route path="/members/create" element={<CreateMember />} />
            <Route path="/members/update/:id" element={<UpdateMember />} />
            <Route path="/members/detail/:id" element={<DetailMember />} />
            <Route path="/booth-team" element={<BoothTeamList />} />
            <Route path="/booth-team/add" element={<AddBoothTeamMember />} />
            <Route path="/locations" element={<LocationDropdowns />} />
            <Route path="/locations/create-state" element={<CreateState />} />
            <Route path="/locations/create-district" element={<CreateDistrict />} />
            <Route path="/locations/create-assembly" element={<CreateLegislativeAssembly />} />
            <Route path="/locations/create-booth" element={<CreateBooth />} />
            <Route path="/visions/list" element={<VisionTable />} />
            <Route path="/visions/add" element={<CreateVisionForm />} />
            <Route path="/visions/:id/details" element={<VisionDetails />} />
            <Route path="/candidate-applications" element={<CandidateApplications />} />
            <Route path="/candidate-applications/apply" element={<ApplyForCandidacy />} />
            <Route path="/campaigns" element={<Campaigns />} />

            {/* Dynamic Form Routes */}
            <Route path="/forms/create" element={<CreateForm />} />
            <Route path="/forms/view" element={<ViewSubmissions />} />
            <Route path="/forms/submit/:formId" element={<SubmitForm />} />
            <Route path="/submissions/:submissionId" element={<SubmissionDetail />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
