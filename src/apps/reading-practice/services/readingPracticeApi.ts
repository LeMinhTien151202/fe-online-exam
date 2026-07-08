import axiosInstance, { IApiEnvelope } from '@/configs/axios';
import { IExamSetDetail, IExamSetListItem } from '../../admin/pages/admin-exams/services/types';

// Học viên đọc đề Reading (skillId 3) đã publish (isActive=true)
export const READING_SKILL_ID = 3;

export const studentExamApi = {
  // Danh sách đề Reading đã công khai
  listReadingSets: (page = 1, limit = 50) =>
    axiosInstance.get<IApiEnvelope<IExamSetListItem[]>, IApiEnvelope<IExamSetListItem[]>>('/exam-sets', {
      params: { skillId: READING_SKILL_ID, page, limit },
      _rawEnvelope: true,
    }),

  // Chi tiết đề (lấy toàn bộ sections → parts → questions)
  examDetail: (id: number) =>
    axiosInstance.get<IExamSetDetail, IExamSetDetail>(`/exam-sets/${id}`),
};
