import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth';
import { notification } from 'antd';

export const useAuthAction = () => {
  const registerMutation = useMutation({
    mutationFn: (payload: any) => authService.register(payload),
    onSuccess: () => {
      notification.success({
        message: 'Thành công',
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
