// Nguồn phân quyền DUY NHẤT của frontend cho RBAC cố định.
// Vai trò lấy từ users.role -> JWT -> Spring Security ROLE_* -> @PreAuthorize (backend mới là lớp bảo vệ thật).
// Frontend chỉ dùng các nhóm quyền dưới đây để guard route và ẩn/hiện menu cho khớp với backend.

export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

export const ROLE_LABEL: Record<UserRole, string> = {
  ADMIN: 'Quản trị',
  TEACHER: 'Giáo viên',
  STUDENT: 'Học viên',
};

// Các nhóm quyền theo chức năng, ánh xạ 1-1 với @PreAuthorize ở backend.
export const ROLE_ACCESS = {
  // Chỉ ADMIN: quản lý người dùng, tổng quan hệ thống, cài đặt, thông báo.
  adminOnly: ['ADMIN'] as UserRole[],
  // ADMIN + TEACHER: quản lý nội dung học thuật (câu hỏi, bộ đề, tài liệu, Q&A, chấm điểm...).
  contentManagers: ['ADMIN', 'TEACHER'] as UserRole[],
  // Chỉ STUDENT: khu vực luyện thi / làm bài.
  students: ['STUDENT'] as UserRole[],
};

export const hasAnyRole = (role: UserRole | null | undefined, allowed: UserRole[]): boolean =>
  !!role && allowed.includes(role);

// Điểm đến mặc định sau khi đăng nhập / khi bị chặn vào trang không đủ quyền.
export const roleHomePath = (role: UserRole | null | undefined): string => {
  switch (role) {
    case 'ADMIN':
      return '/admin';
    case 'TEACHER':
      // TEACHER không được vào /admin (Tổng quan) nên mặc định về ngân hàng câu hỏi.
      return '/admin/questions/grammar';
    default:
      // STUDENT hoặc chưa đăng nhập: về khu vực học viên.
      return '/';
  }
};
