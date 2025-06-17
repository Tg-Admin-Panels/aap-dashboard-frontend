import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../features/store';

const ProtectedLayout: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  console.log("isAuthenticated", isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
  // return <Outlet/> // Delete this
};

export default ProtectedLayout;