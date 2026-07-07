import axiosInstance, { IApiEnvelope } from '@/configs/axios';
import { IMaterialFilter, IStudyMaterial } from './types';

export const materialApi = {
  // GET /study-materials — mọi role xem được (list phân trang, lấy nguyên envelope)
  list: (filter: IMaterialFilter = {}) =>
    axiosInstance.get<IApiEnvelope<IStudyMaterial[]>, IApiEnvelope<IStudyMaterial[]>>('/study-materials', {
      params: filter,
      _rawEnvelope: true,
    }),
};
