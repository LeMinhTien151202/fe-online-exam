import axiosInstance, { IApiEnvelope } from '@/configs/axios';
import { IExamSetDetail, IExamSetListItem } from '../../../apps/admin/pages/admin-exams/services/types';
import {
  IAttemptFilter,
  IAttemptsResponse,
  IExamProgressRow,
  IExamSubmitResult,
  ILearningStreak,
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
    axiosInstance.post<IExamSubmitResult, IExamSubmitResult>(`/exams/${examId}/submit`, payload, {
      // AI grading is synchronous and can take longer when a Speaking answer contains several audio files.
      timeout: 120_000,
    }),

  // Lịch sử làm bài của mình (+ điểm trung bình MOCK_TEST).
  // BE trả `data` là MẢNG attempts trực tiếp (không bọc { result, averageMockScore }),
  // và có thể (bản cũ) bọc trong { result }. Chuẩn hoá về IAttemptsResponse để UI dùng thống nhất.
  myAttempts: async (filter: IAttemptFilter = {}): Promise<IAttemptsResponse> => {
    const raw = await axiosInstance.get<unknown, unknown>('/attempts/me', { params: filter });
    const result = Array.isArray(raw)
      ? (raw as IAttemptsResponse['result'])
      : ((raw as IAttemptsResponse)?.result ?? []);
    const averageMockScore = (raw as IAttemptsResponse)?.averageMockScore ?? null;
    return { result, averageMockScore };
  },

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

  // Chuỗi ngày học hiện tại; BE đã tính hiệu lực theo ngày nghiệp vụ.
  myStreak: () =>
    axiosInstance.get<ILearningStreak, ILearningStreak>('/streaks/me'),
};
