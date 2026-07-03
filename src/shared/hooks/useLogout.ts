import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useLogoutMutation } from '@apps/auth/services/authQuery';
import { useAppDispatch } from '@/shared/store/hooks';
import { logout as logoutAction } from '@/shared/store/authSlice';

export const useLogout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const logoutMutation = useLogoutMutation();

  const logout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        dispatch(logoutAction());
        // Xóa toàn bộ cache React Query: tránh hiển thị nhầm dữ liệu (hồ sơ, tài khoản...) của phiên trước
        queryClient.clear();
        navigate({ to: '/' });
      },
    });
  };

  return { logout, isLoggingOut: logoutMutation.isPending };
};
