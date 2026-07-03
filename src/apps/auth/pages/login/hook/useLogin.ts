import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useLoginMutation } from '@apps/auth/services/authQuery';
import { ILoginPayload } from '@apps/auth/services/types';
import { useAppDispatch } from '@/shared/store/hooks';
import { setCredentials } from '@/shared/store/authSlice';

export const useLogin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const loginMutation = useLoginMutation();

  const login = (payload: ILoginPayload) => {
    loginMutation.mutate(payload, {
      onSuccess: (res) => {
        // Xóa cache cũ (nếu tab này vừa đăng nhập tài khoản khác trước đó) trước khi lưu phiên mới
        queryClient.clear();
        dispatch(setCredentials({ user: res.user, accessToken: res.access_token }));
        message.success('Đăng nhập thành công!');
        navigate({ to: '/' });
      },
    });
  };

  return {
    login,
    isLoggingIn: loginMutation.isPending,
  };
};
