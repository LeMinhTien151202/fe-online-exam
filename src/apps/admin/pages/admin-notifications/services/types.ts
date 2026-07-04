export type NotificationType = 'SYSTEM' | 'EXAM_REMINDER' | 'GRADE_RESULT';

export const NOTIFICATION_TYPE_LABEL: Record<NotificationType, string> = {
  SYSTEM: 'Hệ thống',
  EXAM_REMINDER: 'Nhắc lịch thi',
  GRADE_RESULT: 'Kết quả chấm',
};

export interface INotification {
  id: number;
  receiverId: number | null; // null = broadcast
  notificationType: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ICreateNotificationPayload {
  notificationType: NotificationType;
  title: string;
  message: string;
  receiverId?: number; // bỏ trống = broadcast
}

export interface INotificationFilter {
  isRead?: boolean;
}
