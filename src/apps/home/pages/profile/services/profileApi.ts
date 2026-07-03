import axiosInstance from '@/configs/axios';
import { IProfile, IUpdateProfilePayload } from './types';

export const getProfile = () => axiosInstance.get<IProfile, IProfile>('/profile/me');

export const updateProfile = (payload: IUpdateProfilePayload) =>
  axiosInstance.patch<IProfile, IProfile>('/profile/me', payload);
