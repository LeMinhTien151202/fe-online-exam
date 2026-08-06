import { useMutation } from '@tanstack/react-query';
import { App } from 'antd';
import { IRegisterPayload } from '@apps/auth/services/types';
import { authService } from '../services/auth';

export const useAuthAction = () => {
  const { notification } = App.useApp();
  const registerMutation = useMutation({
    mutationFn: (payload: IRegisterPayload) => authService.register(payload),
    onSuccess: () => {
      notification.success({
        title: 'Thành công',
        description: 'Đăng ký tài khoản thành công!',
      });
    },
    // Lỗi global đã được xử lý ở axios interceptor,
    // nhưng có thể override hoặc thêm logic ở đây nếu cần.
  });

  return {
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
  };
};
