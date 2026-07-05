import axiosInstance from '@/configs/axios';

export type NotificationType = 'SYSTEM' | 'EXAM_REMINDER' | 'GRADE_RESULT';

export interface INotification {
  id: number;
  receiverId: number | null;
  notificationType: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationApi = {
  getMine: () => axiosInstance.get<INotification[], INotification[]>('/notifications/me'),
  markRead: (id: number) =>
    axiosInstance.patch<{ id: number; message: string }, { id: number; message: string }>(
      `/notifications/${id}/read`
    ),
  readAll: () => axiosInstance.patch<{ updated: number }, { updated: number }>('/notifications/read-all'),
};
