import axiosInstance, { API_BASE_URL } from '@/configs/axios';
import {
  IAuthMessageResponse,
  IChangePasswordPayload,
  IForgotPasswordPayload,
  ILoginPayload,
  ILoginResponse,
  IRefreshResponse,
  IRegisterPayload,
  IRegisterResponse,
  IResetPasswordPayload,
  IUser,
  IVerifyOtpPayload,
  IVerifyOtpResponse,
} from './types';

export const authApi = {
  register: (payload: IRegisterPayload) =>
    axiosInstance.post<IRegisterResponse, IRegisterResponse>('/auth/register', payload),

  login: (payload: ILoginPayload) =>
    axiosInstance.post<ILoginResponse, ILoginResponse>('/auth/login', payload),

  getAccount: () => axiosInstance.get<IUser, IUser>('/auth/account'),

  refresh: () => axiosInstance.get<IRefreshResponse, IRefreshResponse>('/auth/refresh'),

  logout: () => axiosInstance.post<void, void>('/auth/logout'),

  changePassword: (payload: IChangePasswordPayload) =>
    axiosInstance.patch<void, void>('/auth/change-password', payload),

  forgotPassword: (payload: IForgotPasswordPayload) =>
    axiosInstance.post<IAuthMessageResponse, IAuthMessageResponse>('/auth/forgot-password', payload),

  verifyOtp: (payload: IVerifyOtpPayload) =>
    axiosInstance.post<IVerifyOtpResponse, IVerifyOtpResponse>('/auth/verify-otp', payload),

  resetPassword: (payload: IResetPasswordPayload) =>
    axiosInstance.post<IAuthMessageResponse, IAuthMessageResponse>('/auth/reset-password', payload),

  googleLoginUrl: () => `${API_BASE_URL}/auth/google`,
};
