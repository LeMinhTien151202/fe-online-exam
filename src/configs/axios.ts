import axios, { InternalAxiosRequestConfig, AxiosError, AxiosRequestConfig } from 'axios';
import { notification } from 'antd';
import { tokenManager } from '@/shared/utils/tokenManager';
import { store } from '@/shared/store/store';
import { logout } from '@/shared/store/authSlice';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:6969/api/v1';

export interface IPageMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPage: number;
}

export interface IApiEnvelope<T> {
  code: number;
  success: boolean;
  message: string;
  messages: string[];
  data: T;
  metaData: IPageMeta | null;
}

// Cho phép list phân trang lấy nguyên envelope (data + metaData) thay vì chỉ data.
declare module 'axios' {
  export interface AxiosRequestConfig {
    _rawEnvelope?: boolean;
  }
}

interface IRetryableRequestConfig extends AxiosRequestConfig {
  _retried?: boolean;
}

interface IApiErrorBody {
  message?: string | string[];
}

// Các endpoint auth tự thân: không thử refresh khi chính chúng trả 401 (tránh vòng lặp)
const NO_REFRESH_RETRY_PATHS = ['/auth/login', '/auth/register', '/auth/refresh'];
// 401 ở các endpoint này là lỗi thật cần báo cho người dùng (sai mật khẩu, email trùng...)
// Mọi endpoint khác: 401 chỉ có nghĩa là phiên hết hạn/khách chưa đăng nhập -> xử lý âm thầm, không dọa người dùng
const LOUD_401_PATHS = ['/auth/login', '/auth/register'];

const matchesPath = (url: string | undefined, paths: string[]) => !!url && paths.some((p) => url.includes(p));

const isTimeoutError = (error: AxiosError<IApiErrorBody>) =>
  error.code === 'ECONNABORTED' || /timeout/i.test(error.message ?? '');

// Tiêu đề notification theo ĐÚNG loại lỗi, thay vì luôn "Lỗi hệ thống" chung chung.
const resolveErrorTitle = (error: AxiosError<IApiErrorBody>): string => {
  const status = error.response?.status;

  if (!status) {
    if (isTimeoutError(error)) return 'Quá thời gian chờ';
    if (error.request) return 'Mất kết nối';
    return 'Lỗi hệ thống';
  }

  switch (status) {
    case 400:
      return 'Dữ liệu không hợp lệ';
    case 401:
      // 401 chỉ báo lên UI ở /auth/login, /auth/register (sai thông tin đăng nhập).
      return 'Đăng nhập thất bại';
    case 403:
      return 'Không đủ quyền';
    case 404:
      return 'Không tìm thấy';
    case 409:
      return 'Dữ liệu bị xung đột';
    case 413:
      return 'Tệp quá lớn';
    default:
      return status >= 500 ? 'Lỗi máy chủ' : 'Lỗi hệ thống';
  }
};

// Chọn thông điệp lỗi CỤ THỂ để hiển thị, ưu tiên message thật từ backend.
// Chỉ dùng câu chung chung khi thực sự không còn thông tin nào rõ hơn.
const resolveErrorMessage = (error: AxiosError<IApiErrorBody>): string => {
  const status = error.response?.status;

  // 403 = thiếu quyền (RBAC ở backend từ chối).
  if (status === 403) return 'Bạn không có quyền thực hiện chức năng này.';

  // Có phản hồi từ backend -> luôn dùng đúng message backend trả về (đồng bộ FE/BE).
  const rawMessage = error.response?.data?.message;
  if (rawMessage) return Array.isArray(rawMessage) ? rawMessage.join(', ') : rawMessage;
  if (status) return `Máy chủ trả về lỗi ${status}. Vui lòng thử lại.`;

  // Không có phản hồi -> phân biệt timeout với mất kết nối thay vì gộp thành lỗi chung.
  if (isTimeoutError(error)) {
    return 'Máy chủ xử lý quá lâu (chấm AI có thể mất nhiều thời gian). Vui lòng thử lại.';
  }
  if (error.request) {
    return 'Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.';
  }
  return 'Đã có lỗi xảy ra, vui lòng thử lại sau!';
};

const REFRESH_LOCK_NAME = 'exam-online-auth-refresh';
let refreshPromise: Promise<string> | null = null;

const getBearerToken = (config: AxiosRequestConfig | undefined): string | null => {
  const authorization = config?.headers?.Authorization;
  if (typeof authorization !== 'string' || !authorization.startsWith('Bearer ')) return null;
  return authorization.slice('Bearer '.length);
};

const requestNewAccessToken = async (failedAccessToken: string | null): Promise<string> => {
  const refresh = async (): Promise<string> => {
    const latestAccessToken = tokenManager.getAccessToken();
    if (failedAccessToken && latestAccessToken && latestAccessToken !== failedAccessToken) {
      return latestAccessToken;
    }

    const refreshRes = await axios.get<IApiEnvelope<{ access_token: string }>>(
      `${API_BASE_URL}/auth/refresh`,
      { withCredentials: true, timeout: 10000 }
    );
    const newAccessToken = refreshRes.data.data?.access_token;
    if (!newAccessToken) {
      throw new Error('Phản hồi refresh token không chứa access_token');
    }
    tokenManager.setAccessToken(newAccessToken);
    return newAccessToken;
  };

  // Cookie refresh được dùng chung giữa các tab, nên cần khóa cả ở cấp trình duyệt.
  if (typeof navigator !== 'undefined' && 'locks' in navigator) {
    return navigator.locks.request(REFRESH_LOCK_NAME, refresh);
  }
  return refresh();
};

const getRefreshedAccessToken = (failedAccessToken: string | null): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = requestNewAccessToken(failedAccessToken).finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

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
    // BE bọc dữ liệu trong { data, metaData }. Mặc định trả thẳng `data`.
    // List phân trang đặt `_rawEnvelope: true` -> trả nguyên envelope để lấy `metaData`.
    const body = response.data as IApiEnvelope<unknown> | undefined;
    if (!body || typeof body !== 'object' || !('data' in body)) return response.data;
    return response.config?._rawEnvelope ? body : body.data;
  },
  async (error: AxiosError<IApiErrorBody>) => {
    const originalRequest = error.config as IRetryableRequestConfig | undefined;

    const isAuthSelfEndpoint = matchesPath(originalRequest?.url, NO_REFRESH_RETRY_PATHS);

    // Token hết hạn: thử refresh 1 lần rồi gọi lại request cũ (trừ chính các endpoint auth)
    if (error.response?.status === 401 && originalRequest && !originalRequest._retried && !isAuthSelfEndpoint) {
      originalRequest._retried = true;
      try {
        await getRefreshedAccessToken(getBearerToken(originalRequest));
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Chỉ xóa phiên khi backend xác nhận refresh token không còn hợp lệ.
        if (axios.isAxiosError(refreshError) && refreshError.response?.status === 401) {
          store.dispatch(logout());
        }
        return Promise.reject(refreshError);
      }
    }

    const description = resolveErrorMessage(error);
    // Tiêu đề đổi theo loại lỗi (403 thiếu quyền, timeout, mất kết nối, lỗi máy chủ...).
    const title = resolveErrorTitle(error);

    // 401 chỉ báo lỗi thật ở /auth/login, /auth/register (sai thông tin đăng nhập/đăng ký).
    // Mọi 401 khác (phiên hết hạn, token refresh không hợp lệ...) đều là bình thường -> không cần cảnh báo.
    const isLoud401 = error.response?.status === 401 && matchesPath(originalRequest?.url, LOUD_401_PATHS);
    const shouldNotify = error.response?.status !== 401 || isLoud401;

    if (shouldNotify) {
      notification.error({
        message: title,
        description,
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
