import { Middleware, createAction } from '@reduxjs/toolkit';
import { setUser } from '../auth/user.slice';
import axiosInstance from '../../utils/axiosInstance';
import { logoutUser } from '../auth/authApi';

// Create a type-safe action
export const checkAuth = createAction('auth/checkAuth');

const authMiddleware: Middleware = (store) => (next) => async (action) => {
  if (checkAuth.match(action)) {

    try {
      const response = await axiosInstance.get('/users/me');

      store.dispatch(setUser(response.data));
    } catch (error: any) {
      console.error('Failed to authenticate user:', error?.response?.data?.message);
      store.dispatch({ type: "users/logoutUser" });
    }
  }

  return next(action);
};

export default authMiddleware;
