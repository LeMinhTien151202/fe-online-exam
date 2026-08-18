import axiosInstance, { IApiEnvelope } from '@/configs/axios';
import { IStudentExamSummary, IStudentExamTake } from '@/shared/services/student-exam';

export const LISTENING_SKILL_ID = 2;

export const studentListeningExamApi = {
  // Luyện theo bộ đề = chỉ SKILL_FULL_SET (không lẫn PART_PRACTICE / MOCK_TEST).
  listListeningSets: (page = 1, limit = 50) =>
    axiosInstance.get<IApiEnvelope<IStudentExamSummary[]>, IApiEnvelope<IStudentExamSummary[]>>('/exams', {
      params: { type: 'SKILL_FULL_SET', skillId: LISTENING_SKILL_ID, page, limit },
      _rawEnvelope: true,
    }),

  examDetail: (id: number) =>
    axiosInstance.get<IStudentExamTake, IStudentExamTake>(`/exams/${id}/take`),
};
