import axiosInstance, { IApiEnvelope } from '@/configs/axios';
import { IStudentExamSummary, IStudentExamTake } from '@/shared/services/student-exam';

export const SPEAKING_SKILL_ID = 5;

export const studentSpeakingExamApi = {
  // Luyện theo bộ đề = chỉ SKILL_FULL_SET (không lẫn PART_PRACTICE / MOCK_TEST).
  listSpeakingSets: (page = 1, limit = 50) =>
    axiosInstance.get<IApiEnvelope<IStudentExamSummary[]>, IApiEnvelope<IStudentExamSummary[]>>('/exams', {
      params: { type: 'SKILL_FULL_SET', skillId: SPEAKING_SKILL_ID, page, limit },
      _rawEnvelope: true,
    }),

  examDetail: (id: number) =>
    axiosInstance.get<IStudentExamTake, IStudentExamTake>(`/exams/${id}/take`),
};
