import axiosInstance, { IApiEnvelope } from '@/configs/axios';
import { IQuestion } from '../../admin/pages/admin-questions/services/types';

// Speaking = skillId 5, giữ nguyên 4 phần (part 1-4)
export const SPEAKING_SKILL_ID = 5;

export const speakingApi = {
  listByPart: (partNumber: number) =>
    axiosInstance.get<IApiEnvelope<IQuestion[]>, IApiEnvelope<IQuestion[]>>('/questions', {
      params: { skillId: SPEAKING_SKILL_ID, partNumber, page: 1, limit: 50 },
      _rawEnvelope: true,
    }),
};
