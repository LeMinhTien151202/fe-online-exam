import axiosInstance, { IApiEnvelope } from '@/configs/axios';
import { IAdminUser, ICreateUserPayload, IUpdateUserPayload, IUserFilter } from './types';

export const userApi = {
  list: (filter: IUserFilter = {}) =>
    axiosInstance.get<IApiEnvelope<IAdminUser[]>, IApiEnvelope<IAdminUser[]>>('/users', {
      params: filter,
      _rawEnvelope: true,
    }),

  detail: (id: number) => axiosInstance.get<IAdminUser, IAdminUser>(`/users/${id}`),

  create: (payload: ICreateUserPayload) => axiosInstance.post<IAdminUser, IAdminUser>('/users', payload),

  update: (id: number, payload: IUpdateUserPayload) =>
    axiosInstance.patch<IAdminUser, IAdminUser>(`/users/${id}`, payload),

  // Khoá tài khoản (status = LOCKED). Mở khoá dùng update({ status: 'ACTIVE' }).
  lock: (id: number) => axiosInstance.patch<IAdminUser, IAdminUser>(`/users/${id}/lock`),
};
