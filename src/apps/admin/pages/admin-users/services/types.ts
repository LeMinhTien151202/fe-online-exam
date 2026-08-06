// Vai trò & nhãn dùng chung toàn app (xem src/shared/auth/roleAccess.ts).
import type { UserRole } from '@/shared/auth/roleAccess';
export type { UserRole };
export { ROLE_LABEL } from '@/shared/auth/roleAccess';
export type UserStatus = 'ACTIVE' | 'LOCKED';

export interface IUserProfile {
  userId: number;
  fullName: string;
  aptisGoal?: string | null;
}

export interface IUserStreakSummary {
  currentStreak: number;
  longestStreak: number;
  lastActivity: string | null;
}

export interface IAdminUser {
  id: number;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  profile?: IUserProfile;
  streak: IUserStreakSummary | null;
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

// Dòng hiển thị ở bảng quản trị, dùng streak thật từ API /users.
export interface IUserRow {
  key: string;
  id: number;
  name: string;
  email: string;
  role: UserRole;
  target: string;
  registeredDate: string;
  active: boolean;
  streak: IUserStreakSummary | null;
  raw: IAdminUser;
}
