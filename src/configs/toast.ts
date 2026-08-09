import type { ReactNode } from 'react';
import { getNotification } from './notification';

/**
 * Toast dùng chung toàn hệ thống — thay cho antd `message` (toast nhỏ ở giữa).
 * Hiển thị dạng notification góc phải trên, có tiêu đề + mô tả + thanh tiến trình.
 *
 * API tương thích message cũ để thay 1-1:
 *   toast.success('Đã lưu')     hiển thị góc phải trên
 *   toast.error('Lỗi', 6)       tham số thứ 2 là thời gian (giây)
 *
 * Lưu ý: message.loading(...) (spinner ở giữa) KHÔNG thuộc helper này — giữ nguyên message.
 */

type ToastType = 'success' | 'error' | 'warning' | 'info';

// Tiêu đề mặc định theo loại; nội dung truyền vào trở thành phần mô tả bên dưới.
const TITLES: Record<ToastType, string> = {
  success: 'Thành công',
  error: 'Có lỗi xảy ra',
  warning: 'Cảnh báo',
  info: 'Thông báo',
};

// Thời gian hiển thị (giây) mặc định theo loại — lỗi để lâu hơn cho người dùng kịp đọc.
const DEFAULT_DURATION: Record<ToastType, number> = {
  success: 3,
  error: 5,
  warning: 4,
  info: 4,
};

const show = (type: ToastType, content: ReactNode, duration?: number) => {
  getNotification()[type]({
    message: TITLES[type],
    description: content,
    placement: 'topRight',
    duration: duration ?? DEFAULT_DURATION[type],
    showProgress: true,
    pauseOnHover: true,
  });
};

export const toast = {
  success: (content: ReactNode, duration?: number) => show('success', content, duration),
  error: (content: ReactNode, duration?: number) => show('error', content, duration),
  warning: (content: ReactNode, duration?: number) => show('warning', content, duration),
  info: (content: ReactNode, duration?: number) => show('info', content, duration),
};
