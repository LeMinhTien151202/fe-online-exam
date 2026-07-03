export type UserRole = 'STUDENT' | 'ADMIN';

export interface IUserProfile {
  userId: number;
  fullName: string;
}

export interface IUser {
  id: number;
  email: string;
  role: UserRole;
  status?: string;
  createdAt?: string;
  fullName?: string; // Trả kèm trực tiếp từ /auth/login
  profile?: IUserProfile; // Trả dạng lồng từ /auth/register, /auth/account
}

export interface IRegisterPayload {
  email: string;
  password: string;
  full_name: string;
}

export type IRegisterResponse = IUser;

export interface ILoginPayload {
  username: string;
  password: string;
}

export interface ILoginResponse {
  access_token: string;
  refresh_token: string;
  user: IUser;
}

export interface IRefreshResponse {
  access_token: string;
}

export interface IChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}
