import axiosInstance from '@/configs/axios';
import { IRegisterPayload } from '@apps/auth/services/types';

export const authService = {
  register: (payload: IRegisterPayload) => {
    return axiosInstance.post('/auth/register', payload);
  },
};
