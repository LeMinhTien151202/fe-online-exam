// ============================================================
// Student Exam — Submit / Attempt types
// Khớp .docs/EXAM_SUBMIT_SAMPLES.md + .docs/API_PLAN.md (2.8, 2.9, 3.2, 3.3, 3.6)
// ============================================================
import { ExamType } from '../../../apps/admin/pages/admin-exams/services/types';
import { Cefr } from '../../utils/cefrScale';

// GET /exams và GET /exams/{id}/take — contract riêng cho học viên.
// Không dùng lại IExamSetDetail của admin vì response này đã được BE loại bỏ đáp án.
export interface IStudentExamSkill {
  id: number;
  name: string;
  totalParts: number;
}

export interface IStudentExamSummary {
  id: number;
  title: string;
  description?: string | null;
  type: ExamType;
  skillId: number | null;
  partNumber: number | null;
  isActive: boolean;
  createdBy: number;
  createdAt: string;
  deletedAt?: string | null;
  skill?: IStudentExamSkill | null;
}

export interface IStudentExamQuestion {
  id: number;
  skillId: number;
  partNumber: number;
  questionType: string;
  content: string;
  mediaUrl?: string | null;
  extraConfig?: unknown;
}

export interface IStudentExamPartQuestion {
  examPartId: number;
  questionId: number;
  orderIndex: number;
  question?: IStudentExamQuestion;
}

export interface IStudentExamPart {
  id: number;
  partNumber: number;
  instruction?: string | null;
  audioUrl?: string | null;
  questions: IStudentExamPartQuestion[];
}

export interface IStudentExamSection {
  id: number;
  skillId: number;
  durationMinutes: number;
  orderIndex: number;
  skill?: IStudentExamSkill | null;
  parts: IStudentExamPart[];
}

export interface IStudentExamTake extends IStudentExamSummary {
  sections: IStudentExamSection[];
}

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
  // Đáp án đúng theo ĐÚNG hình dạng của `response` đã gửi lên cho câu đó (xem SubmitResponseValue),
  // để FE so sánh trực tiếp từng ô rồi tô xanh/đỏ và in đáp án. BE chỉ trả trường này sau khi nộp
  // (GET /exams/{id}/take vẫn bị AnswerSanitizer cắt sạch đáp án). null với ESSAY/RECORD.
  correctResponse?: SubmitResponseValue | null;
}

// Điểm + nhận xét theo TỪNG tiêu chí chấm (trôi chảy, ngữ pháp, từ vựng...).
export interface IAiCriterion {
  name: string; // tên tiêu chí (do BE quy định theo kỹ năng)
  score: number | null; // 0–100
  comment: string; // nhận xét ngắn tiếng Việt
}

// Chi tiết chấm tự luận qua AI (ESSAY / RECORD)
export interface IAiGradeDetail {
  questionId: number;
  questionType: string; // 'ESSAY' | 'RECORD'
  skillId?: number;
  partNumber?: number;
  aiScore: number; // 0-100; lỗi Gemini làm request thất bại, không tạo kết quả tạm
  band: string; // 'A0'..'C1' (có thể 'C' -> chuẩn hoá về 'C1')
  feedback: string;
  criteria?: IAiCriterion[]; // điểm chi tiết từng tiêu chí (có thể rỗng)
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
  details: IAutoGradeDetail[];
  ai: IAiGradeDetail[];
  // MOCK_TEST: điểm + CEFR theo kỹ năng (gồm Grammar) và CEFR tổng.
  skills?: ISkillScore[];
  overallCefr?: Cefr | null; // null khi đề thiếu kỹ năng bắt buộc
}

// GET /attempts/me — 1 dòng lịch sử làm bài.
// BE trả `examId` + `exam{}`; giữ `examSetId` optional để tương thích ngược.
export interface IAttemptItem {
  id: number;
  examId?: number;
  examSetId?: number;
  type?: ExamType;
  totalScore: number | null; // điểm 0-100; null chỉ để tương thích dữ liệu lịch sử cũ
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
  latestOverallCefr?: Cefr | null;
  metaData?: {
    page: number;
    pageSize: number;
    total: number;
    totalPage: number;
  } | null;
}

export interface IAttemptFilter {
  type?: ExamType;
  examId?: number;
  examSetId?: number;
  page?: number;
  limit?: number;
}

// GET /progress/me — tiến độ TÍCH LŨY theo (skill, part), chỉ PART_PRACTICE (dashboard học tập).
export interface IStudentProgressRow {
  skillId: number;
  partNumber: number;
  answered: number;
  total: number;
}

// GET /streaks/me — chuỗi ngày học liên tiếp của học viên hiện tại.
export interface ILearningStreak {
  studentId: number;
  currentStreak: number;
  longestStreak: number;
  lastActivity: string | null;
}

// GET /progress/exams/me — % hoàn thành theo TỪNG ĐỀ (gắn examId). BE tự tính percent,
// total luôn theo đề hiện tại nên thêm câu -> % giảm; đề chưa làm KHÔNG có dòng -> FE coi 0%.
export interface IExamProgressRow {
  examId: number;
  answered: number;
  total: number;
  percent: number;
}
