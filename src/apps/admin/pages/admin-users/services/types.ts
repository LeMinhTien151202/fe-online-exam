export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';
export type UserStatus = 'ACTIVE' | 'LOCKED';

export const ROLE_LABEL: Record<UserRole, string> = {
  ADMIN: 'Quản trị',
  TEACHER: 'Giáo viên',
  STUDENT: 'Học viên',
};

export interface IUserProfile {
  userId: number;
  fullName: string;
  aptisGoal?: string | null;
}

export interface IAdminUser {
  id: number;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  profile?: IUserProfile;
}

export interface ICreateUserPayload {
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
}

export interface IUpdateUserPayload {
  role?: UserRole;
  status?: UserStatus;
}

export interface IUserFilter {
  page?: number;
  limit?: number;
  role?: UserRole;
  status?: UserStatus;
  search?: string;
}

// Dòng hiển thị ở bảng (đã map từ IAdminUser). `streak` tạm fake — chưa có API.
export interface IUserRow {
  key: string;
  id: number;
  name: string;
  email: string;
  role: UserRole;
  target: string;
  registeredDate: string;
  active: boolean;
  streak: number;
  raw: IAdminUser;
}
