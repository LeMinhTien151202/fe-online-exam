import { useNavigate } from '@tanstack/react-router';
import { message } from 'antd';
import { useRegisterMutation } from '@apps/auth/services/authQuery';
import { IRegisterPayload } from '@apps/auth/services/types';

export const useRegister = () => {
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();

  const register = (payload: IRegisterPayload) => {
    registerMutation.mutate(payload, {
      onSuccess: () => {
        message.success('Đăng ký thành công! Vui lòng đăng nhập.');
        navigate({ to: '/login' });
      },
    });
  };

  return {
    register,
    isRegistering: registerMutation.isPending,
  };
};
