import axiosInstance, { IApiEnvelope } from '@/configs/axios';
import { IExamSetDetail, IExamSetListItem } from '../../admin/pages/admin-exams/services/types';

export const SPEAKING_SKILL_ID = 5;

export const studentSpeakingExamApi = {
  listSpeakingSets: (page = 1, limit = 50) =>
    axiosInstance.get<IApiEnvelope<IExamSetListItem[]>, IApiEnvelope<IExamSetListItem[]>>('/exam-sets', {
      params: { skillId: SPEAKING_SKILL_ID, page, limit },
      _rawEnvelope: true,
    }),

  examDetail: (id: number) =>
    axiosInstance.get<IExamSetDetail, IExamSetDetail>(`/exam-sets/${id}`),
};
