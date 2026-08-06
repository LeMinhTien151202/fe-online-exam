import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi } from './authApi';

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

// Luôn kiểm tra tài khoản khi khởi động. Interceptor sẽ dùng refresh cookie
// để khôi phục phiên nếu access token đang thiếu hoặc đã hết hạn.
export const useAccountQuery = () => {
  return useQuery({
    queryKey: AUTH_ACCOUNT_QUERY_KEY,
    queryFn: authApi.getAccount,
    retry: false,
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
