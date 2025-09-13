// utils/axiosInstance.ts
import axios from 'axios';
import Cookies from 'js-cookie';


const axiosFormInstance = axios.create({
  baseURL: import.meta.env.VITE_NODE_ENV === 'production'
    ? import.meta.env.VITE_PROD_BASE_URL
    : import.meta.env.VITE_NODE_ENV === 'local' ? import.meta.env.VITE_LOCAL_BASE_URL : import.meta.env.VITE_DEV_BASE_URL,
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
