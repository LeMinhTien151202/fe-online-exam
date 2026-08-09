import axiosInstance, { IApiEnvelope } from '@/configs/axios';
import { IAdminAttempt, IAttemptListFilter } from './types';

export const attemptApi = {
  // Danh sách tất cả lượt nộp bài (Admin/Teacher) — phân trang + lọc studentId/status/type.
  // Lấy nguyên envelope để đọc metaData.total cho phân trang.
  list: (filter: IAttemptListFilter = {}) =>
    axiosInstance.get<IApiEnvelope<IAdminAttempt[]>, IApiEnvelope<IAdminAttempt[]>>('/attempts', {
      params: filter,
      _rawEnvelope: true,
    }),
};
