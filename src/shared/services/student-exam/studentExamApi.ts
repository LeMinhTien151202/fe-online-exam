import axiosInstance from '@/configs/axios';
import {
  IAttemptFilter,
  IAttemptsResponse,
  IExamSubmitResult,
  ISubmitExamPayload,
} from './types';

// Học viên làm bài & nộp — khớp API_PLAN mục 2.8 / 2.9 và EXAM_SUBMIT_SAMPLES.md
export const studentExamApi = {
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
};
