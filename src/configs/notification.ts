import { notification as staticNotification } from 'antd';
import type { NotificationInstance } from 'antd/es/notification/interface';

// Instance notification lấy từ <App> (đọc được theme động, không cảnh báo "static function").
// Được set bởi <NotificationBridge> khi app mount. Dùng cho cả nơi ngoài React (axios interceptor).
let appNotification: NotificationInstance | null = null;

export const setAppNotification = (api: NotificationInstance | null) => {
  appNotification = api;
};

// Ưu tiên instance từ <App>; fallback về static nếu bridge chưa kịp mount.
export const getNotification = (): NotificationInstance => appNotification ?? staticNotification;
