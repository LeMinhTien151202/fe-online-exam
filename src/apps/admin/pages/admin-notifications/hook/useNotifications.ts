import { message } from 'antd';
import {
  useCreateNotificationMutation,
  useMarkReadMutation,
  useNotificationsQuery,
  useReadAllMutation,
} from '../services/notificationQuery';
import { ICreateNotificationPayload } from '../services/types';

export const useNotifications = () => {
  const { data, isLoading } = useNotificationsQuery();
  const createMutation = useCreateNotificationMutation();
  const markReadMutation = useMarkReadMutation();
  const readAllMutation = useReadAllMutation();

  const notifications = data ?? [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleCreate = (payload: ICreateNotificationPayload) => {
    createMutation.mutate(payload, {
      onSuccess: () => message.success('Đã gửi thông báo.'),
    });
  };

  const handleMarkRead = (id: number) => {
    markReadMutation.mutate(id);
  };

  const handleReadAll = () => {
    readAllMutation.mutate(undefined, {
      onSuccess: (res) => message.success(`Đã đánh dấu đã đọc ${res.updated} thông báo.`),
    });
  };

  return {
    notifications,
    loading: isLoading,
    unreadCount,
    isSending: createMutation.isPending,
    handleCreate,
    handleMarkRead,
    handleReadAll,
  };
};
