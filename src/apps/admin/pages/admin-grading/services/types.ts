// ============================================================
// Admin — Kết quả & Lịch sử thi (Attempt History)
// Khớp GET /attempts (AdminAttemptResponse ở backend).
// Chỉ có dữ liệu TỔNG HỢP: điểm tổng + CEFR tổng + band từng kỹ năng (snapshot lúc nộp).
// KHÔNG có bài làm / audio / nhận xét AI (backend không lưu chi tiết từng câu).
// ============================================================
import { ExamType } from '../../admin-exams/services/types';
import { Cefr } from '@/shared/utils/cefrScale';

// Band + điểm 1 kỹ năng trong snapshot skillCefr (list<SkillScore> ở BE).
export interface IAttemptSkillScore {
  skillId: number;
  name: string;
  earned?: number | null; // kỹ năng trắc nghiệm (Nghe/Đọc)
  total?: number | null;
  aiScore?: number | null; // kỹ năng AI chấm (Viết/Nói), 0–100
  scaled: number; // 0–50 (ước lượng)
  cefr?: Cefr | null; // Grammar (skillId 1) = null
}

// 1 lượt nộp bài (Admin/Teacher xem tất cả học viên).
export interface IAdminAttempt {
  id: number;
  studentId: number;
  examId: number;
  status: string; // 'SUBMITTED'
  totalScore: number | null;
  overallCefr: Cefr | null; // MOCK_TEST: CEFR tổng
  skillCefr: IAttemptSkillScore[] | null; // snapshot điểm/band từng kỹ năng
  startedAt: string | null;
  finishedAt: string | null;
  exam: { id: number; title: string; type: ExamType } | null;
  student: { id: number; email: string } | null;
}

export interface IAttemptListFilter {
  page?: number;
  limit?: number;
  studentId?: number;
  status?: string;
  type?: ExamType;
}
