import axiosInstance, { IApiEnvelope } from '@/configs/axios';
import { IExamSetDetail, IExamSetListItem } from '../../../apps/admin/pages/admin-exams/services/types';
import {
  IAttemptFilter,
  IAttemptsResponse,
  IExamProgressRow,
  IExamSubmitResult,
  IStudentProgressRow,
  ISubmitExamPayload,
} from './types';

// Học viên làm bài & nộp — khớp API_PLAN mục 2.8 / 2.9 và EXAM_SUBMIT_SAMPLES.md
export const studentExamApi = {
  // Danh sách đề luyện theo phần (PART_PRACTICE) của 1 kỹ năng — dùng để tra examId theo partNumber.
  listPartPractice: (skillId: number) =>
    axiosInstance.get<IApiEnvelope<IExamSetListItem[]>, IApiEnvelope<IExamSetListItem[]>>('/exam-sets', {
      params: { type: 'PART_PRACTICE', skillId, page: 1, limit: 100 },
      _rawEnvelope: true,
    }),

  // Chi tiết đề (kèm đáp án) để chấm cục bộ như các trang thi thử.
  examSetDetail: (id: number) =>
    axiosInstance.get<IExamSetDetail, IExamSetDetail>(`/exam-sets/${id}`),

  // Nộp bài: BE tự phân luồng theo type của đề (PART_PRACTICE / SKILL_FULL_SET / MOCK_TEST).
  // Trả review nóng: điểm trắc nghiệm + kết quả AI (ESSAY/RECORD) ngay trong response.
  submit: (examId: number, payload: ISubmitExamPayload) =>
    axiosInstance.post<IExamSubmitResult, IExamSubmitResult>(`/exams/${examId}/submit`, payload),

  // Lịch sử làm bài của mình (+ điểm trung bình MOCK_TEST)
  myAttempts: (filter: IAttemptFilter = {}) =>
    axiosInstance.get<IAttemptsResponse, IAttemptsResponse>('/attempts/me', { params: filter }),

  // Tập exam_set_id đã làm (để gắn nhãn Đã làm/Chưa làm cho SKILL_FULL_SET & MOCK_TEST)
  myDone: () =>
    axiosInstance.get<number[], number[]>('/attempts/me/done'),

  // % hoàn thành theo TỪNG ĐỀ (gắn examId) — nguồn cho thanh tiến độ card luyện theo phần.
  // BE tính percent = round(answered/total*100); total theo đề hiện tại nên thêm câu -> % giảm.
  myExamProgress: () =>
    axiosInstance.get<IExamProgressRow[], IExamProgressRow[]>('/progress/exams/me'),

  // Tiến độ tích lũy theo (skill, part) — dashboard "đã luyện bao nhiêu" (gộp mọi đề).
  myProgress: () =>
    axiosInstance.get<IStudentProgressRow[], IStudentProgressRow[]>('/progress/me'),
};
