
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import axiosInstance from '../../utils/axiosInstance'

interface LoginCredentials {
  mobileNumber: string
  password: string
}

export const loginUser = createAsyncThunk(
  'users/loginUser',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const url = import.meta.env.VITE_NODE_ENV === 'development' ? import.meta.env.VITE_DEV_BASE_URL : import.meta.env.VITE_PROD_BASE_URL
      console.log("URL is", url)
      const response = await axios.post(`${url}/users/login`, credentials, {
        withCredentials: true
      })
      console.log(response.data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred')
    }
  }
)

export const checkAuth = createAsyncThunk(
  'users/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/users/me')
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred')
    }
  }
)

export const logoutUser = createAsyncThunk(
  'users/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/users/logout')
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred')
    }
  }
)
