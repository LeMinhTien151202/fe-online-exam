import { useState, useEffect } from "react";
import {
  AdminNotification,
  notificationService,
} from "../services/notificationService";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleCreate = async (data: any) => {
    const newNotif = await notificationService.createNotification(data);
    setNotifications([newNotif, ...notifications]);
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return {
    notifications,
    loading,
    handleCreate,
    handleDelete,
    refresh: fetchNotifications,
  };
};
