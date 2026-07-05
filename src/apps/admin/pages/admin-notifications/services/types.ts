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
  receiver?: { id: number; email: string } | null; // kèm khi gọi GET /notifications (admin)
}

export interface ICreateNotificationPayload {
  notificationType: NotificationType;
  title: string;
  message: string;
  receiverId?: number; // bỏ trống = broadcast
}

export type NotificationAudience = 'all' | 'broadcast' | 'personal';

// GET /notifications (admin — quản lý, phân trang + lọc)
export interface INotificationFilter {
  page?: number;
  limit?: number;
  notificationType?: NotificationType;
  isRead?: boolean;
  audience?: NotificationAudience;
  receiverId?: number;
  search?: string;
}
