export interface AdminNotification {
  id: string;
  title: string;
  content: string;
  type: "system" | "exam" | "question" | "promotion";
  status: "published" | "draft" | "scheduled";
  recipientType: "all" | "specific";
  createdAt: string;
  publishAt?: string;
}

const mockNotifications: AdminNotification[] = [
  {
    id: "1",
    title: "Đã cập nhật bộ đề thi Reading mới",
    content:
      "Chúng tôi vừa cập nhật 5 đề thi Reading mới cho phần thi Aptis ESOL...",
    type: "exam",
    status: "published",
    recipientType: "all",
    createdAt: "2024-03-20 10:00:00",
  },
  {
    id: "2",
    title: "Lịch bảo trì hệ thống 25/03",
    content:
      "Hệ thống sẽ tạm ngưng để bảo trì định kỳ từ 00:00 đến 02:00 ngày 25/03...",
    type: "system",
    status: "scheduled",
    recipientType: "all",
    createdAt: "2024-03-21 08:30:00",
    publishAt: "2024-03-25 00:00:00",
  },
];

export const notificationService = {
  getNotifications: async () => {
    return [...mockNotifications];
  },
  createNotification: async (
    data: Omit<AdminNotification, "id" | "createdAt">,
  ) => {
    return {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      ...data,
    };
  },
};
