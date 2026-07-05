export const initialPermissions = [
  { key: '1', action: 'Xem đề thi', superAdmin: true, admin: true, teacher: true, student: true },
  { key: '2', action: 'Làm đề thi', superAdmin: true, admin: true, teacher: true, student: true },
  { key: '3', action: 'Tạo đề thi mới', superAdmin: true, admin: true, teacher: true, student: false },
  { key: '4', action: 'Xoá đề thi', superAdmin: true, admin: true, teacher: false, student: false },
  { key: '5', action: 'Duyệt tài liệu', superAdmin: true, admin: true, teacher: false, student: false },
  { key: '6', action: 'Chấm điểm tự luận', superAdmin: true, admin: true, teacher: true, student: false },
  { key: '7', action: 'Quản trị hệ thống', superAdmin: true, admin: false, teacher: false, student: false },
];
