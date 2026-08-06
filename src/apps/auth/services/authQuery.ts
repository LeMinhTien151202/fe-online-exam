import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi } from './authApi';
import { tokenManager } from '@/shared/utils/tokenManager';

export const AUTH_ACCOUNT_QUERY_KEY = ['auth', 'account'];

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: authApi.register,
  });
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: authApi.login,
  });
};

// Chỉ khôi phục phiên khi CÓ access token (đã từng đăng nhập, token còn lưu ở localStorage).
// Khách chưa đăng nhập không có token -> bỏ qua hẳn để tránh cặp 401 (/auth/account + /auth/refresh)
// nổi lên console khi vừa mở app. Nếu token hết hạn, interceptor vẫn dùng refresh cookie khôi phục.
export const useAccountQuery = () => {
  return useQuery({
    queryKey: AUTH_ACCOUNT_QUERY_KEY,
    queryFn: authApi.getAccount,
    retry: false,
    enabled: !!tokenManager.getAccessToken(),
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: authApi.logout,
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: authApi.changePassword,
  });
};
