import axiosInstance, { IApiEnvelope } from '@/configs/axios';
import { IQuestion } from '../../admin/pages/admin-questions/services/types';

// Listening = skillId 2, giữ nguyên 4 phần (part 1-4)
export const LISTENING_SKILL_ID = 2;

export const listeningApi = {
  listByPart: (partNumber: number) =>
    axiosInstance.get<IApiEnvelope<IQuestion[]>, IApiEnvelope<IQuestion[]>>('/questions', {
      params: { skillId: LISTENING_SKILL_ID, partNumber, page: 1, limit: 50 },
      _rawEnvelope: true,
    }),
};
