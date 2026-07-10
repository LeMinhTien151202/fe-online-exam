// ============================================================
// Student Exam — Submit / Attempt types
// Khớp .docs/EXAM_SUBMIT_SAMPLES.md + .docs/API_PLAN.md (2.8, 2.9, 3.2, 3.3, 3.6)
// ============================================================
import { ExamType } from '../../../apps/admin/pages/admin-exams/services/types';

// Giá trị `response` đa hình theo từng dạng câu hỏi:
//  - MC thường           -> number (index 0-based)
//  - MC gap-fill/ordering -> number[]
//  - MC agreement         -> ('MAN'|'WOMAN'|'BOTH')[]
//  - WORD_BANK/HEADING/SPEAKER_MATCH(Listening) -> Record<string,string>
//  - SPEAKER_MATCH(Reading) -> string[]
//  - ESSAY                -> string[]  (theo thứ tự prompts/tasks)
//  - RECORD               -> string | string[] (URL audio đã upload)
export type SubmitResponseValue =
  | number
  | number[]
  | string
  | string[]
  | Record<string, string | number>;

export interface ISubmitAnswer {
  questionId: number;
  response: SubmitResponseValue;
}

export interface ISubmitExamPayload {
  answers: ISubmitAnswer[];
}

// Chi tiết chấm trắc nghiệm (1 dòng / câu)
export interface IAutoGradeDetail {
  questionId: number;
  questionType: string;
  earned: number;
  total: number;
  autoGraded: boolean;
  needsAiGrading: boolean;
}

// Chi tiết chấm tự luận qua AI (ESSAY / RECORD)
export interface IAiGradeDetail {
  questionId: number;
  questionType: string; // 'ESSAY' | 'RECORD'
  aiScore: number | null; // null khi Gemini lỗi / chưa cấu hình -> cần chấm tay
  band: string | null; // 'A1'..'C'
  feedback: string;
  needsManualReview: boolean;
}

// Review nóng trả về sau khi nộp (mục C trong EXAM_SUBMIT_SAMPLES.md)
export interface IExamSubmitResult {
  examId: number;
  type: ExamType;
  attemptId: number | null; // null với PART_PRACTICE (không ghi attempt)
  score: number; // điểm tổng (trắc nghiệm + AI), 0-100
  autoScore: number; // riêng phần trắc nghiệm
  earnedAutoPoints: number;
  totalAutoPoints: number;
  needsManualReviewCount: number;
  details: IAutoGradeDetail[];
  ai: IAiGradeDetail[];
}

// GET /attempts/me — 1 dòng lịch sử làm bài
export interface IAttemptItem {
  id: number;
  examSetId: number;
  type: ExamType;
  totalScore: number | null; // NULL với SKILL_FULL_SET (chỉ đánh dấu đã làm)
  status: string; // 'SUBMITTED'
  startedAt?: string | null;
  finishedAt?: string | null;
  createdAt: string;
}

// GET /attempts/me — envelope kèm điểm trung bình MOCK_TEST
export interface IAttemptsResponse {
  result: IAttemptItem[];
  averageMockScore: number | null; // AVG(total_score) các attempt MOCK_TEST
}

export interface IAttemptFilter {
  type?: ExamType;
  examSetId?: number;
}
