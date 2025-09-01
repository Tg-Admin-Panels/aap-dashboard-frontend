
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../features/store';
import SpinnerOverlay from '../components/ui/SpinnerOverlay';

const ProtectedLayout: React.FC = () => {
  const { isAuthenticated, status } = useSelector((state: RootState) => state.auth);

  if (status === 'loading' || status === 'idle') {
    // While the initial auth check is running, show a loading screen.
    // This prevents the premature redirect to /signin.
    return <SpinnerOverlay loading={true} />;
  }

  // Once the check is complete, either show the protected content or redirect.
  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedLayout;
