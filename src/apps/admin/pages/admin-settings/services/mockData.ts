export const initialAuditLogs = [
  { key: '1', time: '03/06/2026 14:10', user: 'Admin', action: 'Nộp điểm chấm', module: 'Chấm điểm', detail: 'Chấm điểm Speaking cho học viên Nguyễn Văn A', ip: '192.168.1.12' },
  { key: '2', time: '03/06/2026 13:45', user: 'Admin', action: 'Tạo bộ đề thi', module: 'Bộ đề thi', detail: 'Tạo đề luyện tập Đọc hiểu Phần 1 #5', ip: '192.168.1.12' },
  { key: '3', time: '02/06/2026 11:20', user: 'Giáo viên Phạm H.', action: 'Tải tài liệu', module: 'Tài liệu', detail: 'Đăng tải tài liệu "Writing Part 4 Guideline"', ip: '113.23.45.67' },
  { key: '4', time: '01/06/2026 09:05', user: 'Admin', action: 'Khóa người dùng', module: 'Người dùng', detail: 'Khóa tài khoản pmd@gmail.com do vi phạm điều khoản', ip: '192.168.1.12' },
];

export const initialPackages = [
  { key: '1', name: 'Premium', price: '499,000 VND / tháng', features: 'Mở khóa 100% đề thi, ưu tiên chấm Speaking/Writing nhanh', userCount: 1540 },
  { key: '2', name: 'Pro', price: '299,000 VND / tháng', features: 'Mở khóa 80% đề thi, chấm điểm Speaking/Writing giới hạn', userCount: 2840 },
  { key: '3', name: 'Miễn phí', price: '0 VND', features: 'Luyện tập các phần cơ bản, không hỗ trợ chấm điểm tự luận', userCount: 10440 },
];
