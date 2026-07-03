import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { authApi } from '@apps/auth/services/authApi';
import { useAppDispatch } from '@/shared/store/hooks';
import { setCredentials } from '@/shared/store/authSlice';
import { tokenManager } from '@/shared/utils/tokenManager';

export const useOAuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  useEffect(() => {
    const accessToken = new URLSearchParams(window.location.search).get('access_token');

    if (!accessToken) {
      navigate({ to: '/login' });
      return;
    }

    tokenManager.setAccessToken(accessToken);

    authApi
      .getAccount()
      .then((user) => {
        // Xóa cache cũ (nếu tab này vừa đăng nhập tài khoản khác trước đó) trước khi lưu phiên mới
        queryClient.clear();
        dispatch(setCredentials({ user, accessToken }));
        message.success('Đăng nhập Google thành công!');
        navigate({ to: '/' });
      })
      .catch(() => {
        tokenManager.clearAccessToken();
        navigate({ to: '/login' });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
