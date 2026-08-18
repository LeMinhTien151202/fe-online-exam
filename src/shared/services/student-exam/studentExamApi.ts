import axiosInstance, { IApiEnvelope } from '@/configs/axios';
import {
  IAttemptFilter,
  IAttemptsResponse,
  IExamProgressRow,
  IExamSubmitResult,
  ILearningStreak,
  IStudentProgressRow,
  ISubmitExamPayload,
  IStudentExamSummary,
  IStudentExamTake,
} from './types';

// Học viên làm bài & nộp — khớp API_PLAN mục 2.8 / 2.9 và EXAM_SUBMIT_SAMPLES.md
export const studentExamApi = {
  // Danh sách đề luyện theo phần (PART_PRACTICE) của 1 kỹ năng — dùng để tra examId theo partNumber.
  listPartPractice: (skillId: number) =>
    axiosInstance.get<IApiEnvelope<IStudentExamSummary[]>, IApiEnvelope<IStudentExamSummary[]>>('/exams', {
      params: { type: 'PART_PRACTICE', skillId, page: 1, limit: 100 },
      _rawEnvelope: true,
    }),

  // Nội dung đề dành cho học viên; BE đã loại toàn bộ khóa đáp án khỏi extraConfig.
  take: (id: number) =>
    axiosInstance.get<IStudentExamTake, IStudentExamTake>(`/exams/${id}/take`),

  // Nộp bài: BE tự phân luồng theo type của đề (PART_PRACTICE / SKILL_FULL_SET / MOCK_TEST).
  // Trả review nóng: điểm trắc nghiệm + kết quả AI (ESSAY/RECORD) ngay trong response.
  submit: (examId: number, payload: ISubmitExamPayload) =>
    axiosInstance.post<IExamSubmitResult, IExamSubmitResult>(`/exams/${examId}/submit`, payload, {
      // AI grading is synchronous and can take longer when a Speaking answer contains several audio files.
      timeout: 120_000,
    }),

  // Lịch sử làm bài phân trang + summary MOCK_TEST. Vẫn đọc được response mảng của BE cũ.
  myAttempts: async (filter: IAttemptFilter = {}): Promise<IAttemptsResponse> => {
    const envelope = await axiosInstance.get<IApiEnvelope<unknown>, IApiEnvelope<unknown>>('/attempts/me', {
      params: filter,
      _rawEnvelope: true,
    });
    const raw = envelope.data;
    const result = Array.isArray(raw)
      ? (raw as IAttemptsResponse['result'])
      : ((raw as IAttemptsResponse)?.result ?? []);
    return {
      result,
      averageMockScore: Array.isArray(raw) ? null : ((raw as IAttemptsResponse)?.averageMockScore ?? null),
      latestOverallCefr: Array.isArray(raw) ? null : ((raw as IAttemptsResponse)?.latestOverallCefr ?? null),
      metaData: envelope.metaData,
    };
  },

  // Chỉ mở được sau khi attempt thuộc về học viên hiện tại; response có answer key để review.
  reviewAttempt: (attemptId: number) =>
    axiosInstance.get<IStudentExamTake, IStudentExamTake>(`/attempts/${attemptId}/review`),

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
