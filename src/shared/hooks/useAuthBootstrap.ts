import { useEffect } from 'react';
import { useAccountQuery } from '@apps/auth/services/authQuery';
import { useAppDispatch } from '@/shared/store/hooks';
import { logout, setUser } from '@/shared/store/authSlice';

// Khôi phục phiên đăng nhập khi tải lại trang (nếu còn access_token hợp lệ).
// Thất bại thì âm thầm về trạng thái khách, KHÔNG chặn app (không bắt buộc đăng nhập).
export const useAuthBootstrap = (): void => {
  const dispatch = useAppDispatch();
  const { data: user, isError } = useAccountQuery();

  useEffect(() => {
    if (user) {
      dispatch(setUser(user));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (isError) {
      dispatch(logout());
    }
  }, [isError, dispatch]);
};
