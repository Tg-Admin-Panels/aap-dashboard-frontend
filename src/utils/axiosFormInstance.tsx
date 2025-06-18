// utils/axiosInstance.ts
import axios from 'axios';
import Cookies from 'js-cookie';


const axiosFormInstance = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  withCredentials: true
})



// Add a request interceptor to attach the token
axiosFormInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosFormInstance;
