import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios';
import { notification } from 'antd';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Trả về data trực tiếp
    return response.data;
  },
  (error: AxiosError<{ message?: string }>) => {
    const message = error.response?.data?.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau!';
    
    notification.error({
      message: 'Lỗi hệ thống',
      description: message,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
