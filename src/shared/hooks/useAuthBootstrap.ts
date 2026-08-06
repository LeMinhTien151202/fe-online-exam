import { useEffect } from 'react';
import axios from 'axios';
import { useAccountQuery } from '@apps/auth/services/authQuery';
import { useAppDispatch } from '@/shared/store/hooks';
import { logout, setUser } from '@/shared/store/authSlice';

// Khôi phục phiên bằng access token hoặc refresh cookie.
// Lỗi mạng, timeout, 429 hoặc 5xx không được xóa phiên đang có.
export const useAuthBootstrap = (): void => {
  const dispatch = useAppDispatch();
  const { data: user, error } = useAccountQuery();

  useEffect(() => {
    if (user) {
      dispatch(setUser(user));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      dispatch(logout());
    }
  }, [error, dispatch]);
};
