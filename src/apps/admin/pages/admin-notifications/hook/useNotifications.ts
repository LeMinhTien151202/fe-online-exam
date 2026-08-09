import {
  useState } from 'react';
import {
  useAdminNotificationsQuery,
  useCreateNotificationMutation,
  useMarkReadMutation,
  useReadAllMutation,
} from '../services/notificationQuery';
import { ICreateNotificationPayload, NotificationAudience, NotificationType } from '../services/types';
import { toast } from '../../../../../configs/toast';
import { usePagination } from '@/shared/hooks/usePagination';

export const useNotifications = () => {
  const { page, pageSize, onChange, reset } = usePagination(10);
  const [audience, setAudience] = useState<NotificationAudience | undefined>();
  const [notificationType, setNotificationType] = useState<NotificationType | undefined>();

  const { data, isLoading } = useAdminNotificationsQuery({
    page,
    limit: pageSize,
    audience,
    notificationType,
  });

  const createMutation = useCreateNotificationMutation();
  const markReadMutation = useMarkReadMutation();
  const readAllMutation = useReadAllMutation();

  const notifications = data?.data ?? [];
  const total = data?.metaData?.total ?? 0;

  const handleCreate = (payload: ICreateNotificationPayload) => {
    createMutation.mutate(payload, {
      onSuccess: () => {
        reset();
        toast.success('Đã gửi thông báo.');
      },
    });
  };

  const setAudienceFilter = (v?: NotificationAudience) => {
    setAudience(v);
    reset();
  };
  const setTypeFilter = (v?: NotificationType) => {
    setNotificationType(v);
    reset();
  };

  const handleMarkRead = (id: number) => markReadMutation.mutate(id);

  const handleReadAll = () => {
    readAllMutation.mutate(undefined, {
      onSuccess: (res) => toast.success(`Đã đánh dấu đã đọc ${res.updated} thông báo.`),
    });
  };

  return {
    notifications,
    loading: isLoading,
    total,
    page,
    pageSize,
    onPageChange: onChange,
    audience,
    setAudience: setAudienceFilter,
    notificationType,
    setNotificationType: setTypeFilter,
    isSending: createMutation.isPending,
    handleCreate,
    handleMarkRead,
    handleReadAll,
  };
};
