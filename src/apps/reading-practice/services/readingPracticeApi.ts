import axiosInstance, { IApiEnvelope } from '@/configs/axios';
import { IStudentExamSummary, IStudentExamTake } from '@/shared/services/student-exam';

// Học viên đọc đề Reading (skillId 3) đã publish (isActive=true)
export const READING_SKILL_ID = 3;

export const studentExamApi = {
  // Danh sách đề Reading đã công khai — luyện theo bộ đề = chỉ SKILL_FULL_SET.
  listReadingSets: (page = 1, limit = 50) =>
    axiosInstance.get<IApiEnvelope<IStudentExamSummary[]>, IApiEnvelope<IStudentExamSummary[]>>('/exams', {
      params: { type: 'SKILL_FULL_SET', skillId: READING_SKILL_ID, page, limit },
      _rawEnvelope: true,
    }),

  // Nội dung đề dành cho học viên, không chứa đáp án.
  examDetail: (id: number) =>
    axiosInstance.get<IStudentExamTake, IStudentExamTake>(`/exams/${id}/take`),
};
