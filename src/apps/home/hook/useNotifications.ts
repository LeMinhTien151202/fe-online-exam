import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationApi, INotification, NotificationType } from '../services/notification';
import { useAppSelector } from '@/shared/store/hooks';

export const HOME_NOTIFICATIONS_KEY = ['notifications', 'me'];

// material-symbols icon + type dùng cho IconBox theo loại thông báo
const ICON_BY_TYPE: Record<NotificationType, string> = {
  SYSTEM: 'campaign',
  EXAM_REMINDER: 'event_available',
  GRADE_RESULT: 'grading',
};
const STYLE_TYPE_BY_TYPE: Record<NotificationType, string> = {
  SYSTEM: 'mock-test',
  EXAM_REMINDER: 'streak',
  GRADE_RESULT: 'progress',
};

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

const groupOf = (iso: string): string => {
  const now = new Date();
  const created = new Date(iso);
  const dayDiff = Math.round((startOfDay(now) - startOfDay(created)) / 86400000);
  if (dayDiff <= 0) return 'Hôm nay';
  if (dayDiff === 1) return 'Hôm qua';
  if (dayDiff <= 7) return 'Tuần này';
  return 'Trước đó';
};

const relativeTime = (iso: string): string => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Vừa xong';
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Hôm qua';
  return `${days} ngày trước`;
};

export interface DisplayNotification {
  id: number;
  type: string;
  icon: string;
  text: string;
  time: string;
  group: string;
  isRead: boolean;
  receiverId: number | null;
}

const toDisplay = (n: INotification): DisplayNotification => ({
  id: n.id,
  type: STYLE_TYPE_BY_TYPE[n.notificationType] ?? 'mock-test',
  icon: ICON_BY_TYPE[n.notificationType] ?? 'notifications',
  text: n.title ? `${n.title}: ${n.message}` : n.message,
  time: relativeTime(n.createdAt),
  group: groupOf(n.createdAt),
  isRead: n.isRead,
  receiverId: n.receiverId,
});

export const useNotifications = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: HOME_NOTIFICATIONS_KEY,
    queryFn: notificationApi.getMine,
    enabled: isAuthenticated,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: number) => notificationApi.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: HOME_NOTIFICATIONS_KEY }),
  });

  const readAllMutation = useMutation({
    mutationFn: () => notificationApi.readAll(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: HOME_NOTIFICATIONS_KEY }),
  });

  const raw = useMemo(() => data ?? [], [data]);
  const notifications = useMemo(() => raw.map(toDisplay), [raw]);
  const unreadCount = useMemo(() => raw.filter((n) => !n.isRead).length, [raw]);

  const groupedNotifications = useMemo(() => {
    return notifications.reduce((acc, notif) => {
      (acc[notif.group] ||= []).push(notif);
      return acc;
    }, {} as Record<string, DisplayNotification[]>);
  }, [notifications]);

  const handleMarkRead = (id: number, receiverId: number | null) => {
    if (receiverId == null) return; // broadcast không đánh dấu riêng được
    markReadMutation.mutate(id);
  };

  const handleReadAll = () => readAllMutation.mutate();

  return { notifications, groupedNotifications, unreadCount, handleMarkRead, handleReadAll };
};
