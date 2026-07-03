import axios, { InternalAxiosRequestConfig, AxiosError, AxiosRequestConfig } from 'axios';
import { notification } from 'antd';
import { tokenManager } from '@/shared/utils/tokenManager';
import { store } from '@/shared/store/store';
import { logout } from '@/shared/store/authSlice';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

interface IApiEnvelope<T> {
  code: number;
  success: boolean;
  message: string;
  messages: string[];
  data: T;
  metaData: unknown;
}

interface IRetryableRequestConfig extends AxiosRequestConfig {
  _retried?: boolean;
}

// Các endpoint auth tự thân: không thử refresh khi chính chúng trả 401 (tránh vòng lặp)
const NO_REFRESH_RETRY_PATHS = ['/auth/login', '/auth/register', '/auth/refresh'];
// 401 ở các endpoint này là lỗi thật cần báo cho người dùng (sai mật khẩu, email trùng...)
// Mọi endpoint khác: 401 chỉ có nghĩa là phiên hết hạn/khách chưa đăng nhập -> xử lý âm thầm, không dọa người dùng
const LOUD_401_PATHS = ['/auth/login', '/auth/register'];

const matchesPath = (url: string | undefined, paths: string[]) => !!url && paths.some((p) => url.includes(p));

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Gửi kèm cookie httpOnly refresh_token
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getAccessToken();
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
    // BE bọc dữ liệu trong { data: {...} }, trả thẳng phần data cho FE dùng
    const body = response.data as IApiEnvelope<unknown> | undefined;
    return body && typeof body === 'object' && 'data' in body ? body.data : response.data;
  },
  async (error: AxiosError<{ message?: string | string[] }>) => {
    const originalRequest = error.config as IRetryableRequestConfig | undefined;

    const isAuthSelfEndpoint = matchesPath(originalRequest?.url, NO_REFRESH_RETRY_PATHS);

    // Token hết hạn: thử refresh 1 lần rồi gọi lại request cũ (trừ chính các endpoint auth)
    if (error.response?.status === 401 && originalRequest && !originalRequest._retried && !isAuthSelfEndpoint) {
      originalRequest._retried = true;
      try {
        const refreshRes = await axios.get<IApiEnvelope<{ access_token: string }>>(
          `${API_BASE_URL}/auth/refresh`,
          { withCredentials: true }
        );
        const newAccessToken = refreshRes.data.data.access_token;
        tokenManager.setAccessToken(newAccessToken);
        return axiosInstance(originalRequest);
      } catch {
        // Refresh cũng thất bại: phiên đã hết hạn thật -> về trạng thái khách (không bắt buộc đăng nhập)
        store.dispatch(logout());
      }
    }

    const rawMessage = error.response?.data?.message;
    const message = Array.isArray(rawMessage) ? rawMessage.join(', ') : rawMessage || 'Đã có lỗi xảy ra, vui lòng thử lại sau!';

    // 401 chỉ báo lỗi thật ở /auth/login, /auth/register (sai thông tin đăng nhập/đăng ký).
    // Mọi 401 khác (phiên hết hạn, token refresh không hợp lệ...) đều là bình thường -> không cần cảnh báo.
    const isLoud401 = error.response?.status === 401 && matchesPath(originalRequest?.url, LOUD_401_PATHS);
    const shouldNotify = error.response?.status !== 401 || isLoud401;

    if (shouldNotify) {
      notification.error({
        message: 'Lỗi hệ thống',
        description: message,
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
