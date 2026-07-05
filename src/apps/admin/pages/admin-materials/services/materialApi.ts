import axiosInstance, { IApiEnvelope } from '@/configs/axios';
import { ICreateMaterialPayload, IMaterial, IMaterialFilter, IUpdateMaterialPayload } from './types';

export const materialApi = {
  list: (filter: IMaterialFilter = {}) =>
    axiosInstance.get<IApiEnvelope<IMaterial[]>, IApiEnvelope<IMaterial[]>>('/study-materials', {
      params: filter,
      _rawEnvelope: true,
    }),

  detail: (id: number) => axiosInstance.get<IMaterial, IMaterial>(`/study-materials/${id}`),

  create: (payload: ICreateMaterialPayload) =>
    axiosInstance.post<IMaterial, IMaterial>('/study-materials', payload),

  update: (id: number, payload: IUpdateMaterialPayload) =>
    axiosInstance.patch<IMaterial, IMaterial>(`/study-materials/${id}`, payload),

  remove: (id: number) =>
    axiosInstance.delete<{ message: string }, { message: string }>(`/study-materials/${id}`),
};
