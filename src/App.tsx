import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./features/store";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import MedicineList from "./pages/wings/MedicineList";
import SellForm from "./pages/inventory/SellForm";
import SellHistory from "./pages/inventory/SellHistory";
import ProtectedLayout from "./layout/ProtectedLayout";
import { useEffect } from "react";
import CreateWing from "./pages/wings/CreateWingForm";
import { Bounce, ToastContainer } from "react-toastify";

export default function App() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  // const isAuthenticated = true
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch({ type: 'auth/checkAuth' });
  }, [dispatch]);

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
            <Route path="/inventory" element={<SellForm />} />
            <Route path="/inventory/history" element={<SellHistory />} />
          </Route>
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
