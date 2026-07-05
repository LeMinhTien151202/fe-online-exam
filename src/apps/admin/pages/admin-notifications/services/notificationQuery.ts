import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from './notificationApi';
import { ICreateNotificationPayload, INotificationFilter } from './types';

export const NOTIFICATIONS_KEY = ['admin', 'notifications'];

// Admin: danh sách quản lý (phân trang) — trả nguyên envelope { data, metaData }
export const useAdminNotificationsQuery = (filter: INotificationFilter = {}) => {
  return useQuery({
    queryKey: [...NOTIFICATIONS_KEY, 'all', filter],
    queryFn: () => notificationApi.getAll(filter),
  });
};

export const useCreateNotificationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateNotificationPayload) => notificationApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  });
};

export const useMarkReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => notificationApi.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  });
};

export const useReadAllMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationApi.readAll(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  });
};
