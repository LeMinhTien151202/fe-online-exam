import axiosInstance, { IApiEnvelope } from '@/configs/axios';
import { IStudentExamSummary, IStudentExamTake } from '@/shared/services/student-exam';

// Thi thử full 5 kỹ năng: đề type MOCK_TEST (mỗi section = 1 kỹ năng theo skillId)
export const mockExamApi = {
  list: (page = 1, limit = 50) =>
    axiosInstance.get<IApiEnvelope<IStudentExamSummary[]>, IApiEnvelope<IStudentExamSummary[]>>('/exams', {
      params: { type: 'MOCK_TEST', page, limit },
      _rawEnvelope: true,
    }),

  detail: (id: number) =>
    axiosInstance.get<IStudentExamTake, IStudentExamTake>(`/exams/${id}/take`),

  // Chỉ được gọi từ giao diện chạy Vite dev. Backend không tạo route này ở staging/production.
  answerKey: (id: number) =>
    axiosInstance.get<IStudentExamTake, IStudentExamTake>(`/test-support/exams/${id}/answer-key`),
};
