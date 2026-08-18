import axiosInstance, { IApiEnvelope } from '@/configs/axios';
import { IStudentExamSummary, IStudentExamTake } from '@/shared/services/student-exam';

export const WRITING_SKILL_ID = 4;

export const studentWritingExamApi = {
  // Luyện theo bộ đề = chỉ SKILL_FULL_SET (không lẫn PART_PRACTICE / MOCK_TEST).
  listWritingSets: (page = 1, limit = 50) =>
    axiosInstance.get<IApiEnvelope<IStudentExamSummary[]>, IApiEnvelope<IStudentExamSummary[]>>('/exams', {
      params: { type: 'SKILL_FULL_SET', skillId: WRITING_SKILL_ID, page, limit },
      _rawEnvelope: true,
    }),

  examDetail: (id: number) =>
    axiosInstance.get<IStudentExamTake, IStudentExamTake>(`/exams/${id}/take`),
};
