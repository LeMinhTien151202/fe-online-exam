import axiosInstance, { IApiEnvelope } from '@/configs/axios';
import { ICreateNotificationPayload, INotification, INotificationFilter } from './types';

export const notificationApi = {
  // Admin — tất cả thông báo (quản lý), phân trang + lọc, kèm receiver
  getAll: (filter: INotificationFilter = {}) =>
    axiosInstance.get<IApiEnvelope<INotification[]>, IApiEnvelope<INotification[]>>('/notifications', {
      params: filter,
      _rawEnvelope: true,
    }),

  getMine: (filter: INotificationFilter = {}) =>
    axiosInstance.get<INotification[], INotification[]>('/notifications/me', { params: filter }),

  markRead: (id: number) =>
    axiosInstance.patch<{ id: number; message: string }, { id: number; message: string }>(
      `/notifications/${id}/read`
    ),

  readAll: () =>
    axiosInstance.patch<{ updated: number }, { updated: number }>('/notifications/read-all'),

  create: (payload: ICreateNotificationPayload) =>
    axiosInstance.post<INotification, INotification>('/notifications', payload),
};
