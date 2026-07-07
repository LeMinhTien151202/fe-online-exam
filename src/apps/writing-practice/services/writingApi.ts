import axiosInstance, { IApiEnvelope } from '@/configs/axios';
import { IQuestion } from '../../admin/pages/admin-questions/services/types';

// Writing = skillId 4, giữ nguyên 4 phần (part 1-4)
export const WRITING_SKILL_ID = 4;

export const writingApi = {
  listByPart: (partNumber: number) =>
    axiosInstance.get<IApiEnvelope<IQuestion[]>, IApiEnvelope<IQuestion[]>>('/questions', {
      params: { skillId: WRITING_SKILL_ID, partNumber, page: 1, limit: 50 },
      _rawEnvelope: true,
    }),
};
