import axiosInstance, { IApiEnvelope } from '@/configs/axios';
import { IExamSetDetail, IExamSetListItem } from '../../admin/pages/admin-exams/services/types';

// Thi thử full 5 kỹ năng: đề type MOCK_TEST (mỗi section = 1 kỹ năng theo skillId)
export const mockExamApi = {
  list: (page = 1, limit = 50) =>
    axiosInstance.get<IApiEnvelope<IExamSetListItem[]>, IApiEnvelope<IExamSetListItem[]>>('/exam-sets', {
      params: { type: 'MOCK_TEST', page, limit },
      _rawEnvelope: true,
    }),

  detail: (id: number) =>
    axiosInstance.get<IExamSetDetail, IExamSetDetail>(`/exam-sets/${id}`),
};
