import axiosInstance, { IApiEnvelope } from '@/configs/axios';
import { IQuestion } from '../../admin/pages/admin-questions/services/types';

// Grammar & Vocabulary = skillId 1. Part 1 = Grammar (MC), Part 2 = Vocabulary (WORD_BANK 4-5 task)
export const GRAMMAR_SKILL_ID = 1;

export const grammarApi = {
  listByPart: (partNumber: number) =>
    axiosInstance.get<IApiEnvelope<IQuestion[]>, IApiEnvelope<IQuestion[]>>('/questions', {
      params: { skillId: GRAMMAR_SKILL_ID, partNumber, page: 1, limit: 100 },
      _rawEnvelope: true,
    }),
};
