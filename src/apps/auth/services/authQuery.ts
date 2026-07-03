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

// Chỉ gọi khi đã có access_token, phục vụ khôi phục phiên đăng nhập / hiển thị thông tin user
export const useAccountQuery = () => {
  return useQuery({
    queryKey: AUTH_ACCOUNT_QUERY_KEY,
    queryFn: authApi.getAccount,
    enabled: !!tokenManager.getAccessToken(),
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
