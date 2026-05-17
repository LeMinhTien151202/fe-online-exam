import axiosInstance from '@/configs/axios';

export const authService = {
  register: (payload: any) => {
    return axiosInstance.post('/auth/register', payload);
  },
};
