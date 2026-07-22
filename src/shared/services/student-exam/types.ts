// ============================================================
// Student Exam — Submit / Attempt types
// Khớp .docs/EXAM_SUBMIT_SAMPLES.md + .docs/API_PLAN.md (2.8, 2.9, 3.2, 3.3, 3.6)
// ============================================================
import { ExamType } from '../../../apps/admin/pages/admin-exams/services/types';
import { Cefr } from '../../utils/cefrScale';

// Điểm + CEFR theo từng kỹ năng (xem .docs/SCORING_CEFR_PLAN.md). Grammar(skillId 1): cefr = null.
export interface ISkillScore {
  skillId: number;
  name: string;
  earned?: number; // kỹ năng trắc nghiệm (1,2,3)
  total?: number;
  aiScore?: number | null; // kỹ năng AI chấm (4,5), 0–100
  scaled: number; // 0–50 (ước lượng tuyến tính)
  cefr: Cefr | null; // null cho Grammar
}

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

// Chi tiết chấm trắc nghiệm (1 dòng / câu). skillId/partNumber để gộp theo kỹ năng.
export interface IAutoGradeDetail {
  questionId: number;
  questionType: string;
  skillId?: number;
  partNumber?: number;
  earned: number;
  total: number;
  autoGraded: boolean;
  needsAiGrading: boolean;
}

// Chi tiết chấm tự luận qua AI (ESSAY / RECORD)
export interface IAiGradeDetail {
  questionId: number;
  questionType: string; // 'ESSAY' | 'RECORD'
  skillId?: number;
  partNumber?: number;
  aiScore: number | null; // null khi Gemini lỗi / chưa cấu hình -> cần chấm tay
  band: string | null; // 'A0'..'C1' (có thể 'C' -> chuẩn hoá về 'C1')
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
  // MOCK_TEST: điểm + CEFR theo kỹ năng (gồm Grammar) và CEFR tổng.
  skills?: ISkillScore[];
  overallCefr?: Cefr | null; // null khi thiếu kỹ năng / còn câu chờ chấm tay
}

// GET /attempts/me — 1 dòng lịch sử làm bài.
// BE trả `examId` + `exam{}`; giữ `examSetId` optional để tương thích ngược.
export interface IAttemptItem {
  id: number;
  examId?: number;
  examSetId?: number;
  type?: ExamType;
  totalScore: number | null; // NULL với SKILL_FULL_SET (chỉ đánh dấu đã làm)
  status?: string; // 'SUBMITTED'
  overallCefr?: Cefr | null; // MOCK_TEST: CEFR tổng lúc nộp
  skillCefr?: ISkillScore[] | null; // snapshot điểm/CEFR từng kỹ năng lúc nộp
  startedAt?: string | null;
  finishedAt?: string | null;
  createdAt: string;
  exam?: { id: number; title: string; type: ExamType };
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

// GET /progress/me — tiến độ TÍCH LŨY theo (skill, part), gộp mọi đề (dashboard học tập).
export interface IStudentProgressRow {
  skillId: number;
  partNumber: number;
  answered: number;
  total: number;
}

// GET /progress/exams/me — % hoàn thành theo TỪNG ĐỀ (gắn examId). BE tự tính percent,
// total luôn theo đề hiện tại nên thêm câu -> % giảm; đề chưa làm KHÔNG có dòng -> FE coi 0%.
export interface IExamProgressRow {
  examId: number;
  answered: number;
  total: number;
  percent: number;
}
