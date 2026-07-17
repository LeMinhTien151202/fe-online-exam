// ============================================================
// Question Bank — Types (khớp DATABASE_DESIGN 4.md + QUESTION_SAMPLES.md)
// ============================================================

export type QuestionType =
  | 'MC'
  | 'ORDERING'
  | 'WORD_BANK'
  | 'HEADING_MATCH'
  | 'SPEAKER_MATCH'
  | 'ESSAY'
  | 'RECORD';

// Label tiếng Việt cho loại câu hỏi — hiển thị cho người dùng thay enum thô
export const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  MC: 'Trắc nghiệm',
  ORDERING: 'Sắp xếp câu',
  WORD_BANK: 'Ngân hàng từ',
  HEADING_MATCH: 'Ghép tiêu đề',
  SPEAKER_MATCH: 'Ghép người nói',
  ESSAY: 'Tự luận',
  RECORD: 'Ghi âm',
};

export const questionTypeLabel = (type?: string | null): string =>
  (type && QUESTION_TYPE_LABEL[type as QuestionType]) || type || '';

// Kỹ năng: id cố định theo seed BE
export const SKILL_ID = {
  grammar: 1,
  listening: 2,
  reading: 3,
  writing: 4,
  speaking: 5,
} as const;

export type SkillRoute = keyof typeof SKILL_ID;

export const SKILL_LABEL: Record<SkillRoute, string> = {
  grammar: 'Ngữ pháp & Từ vựng',
  listening: 'Nghe',
  reading: 'Đọc hiểu',
  speaking: 'Nói',
  writing: 'Viết',
};

// ---------- extra_config theo từng dạng ----------
export interface McOption {
  content: string;
  is_correct: boolean;
}
export interface McConfig {
  options: McOption[];
}

// Listening P4 — Monologue: mỗi bài nghe = 1 bản ghi, gói các câu MC trong questions[]
export interface MonologueQuestion {
  question: string;
  options: McOption[];
}
export interface MonologueConfig {
  questions: MonologueQuestion[];
}

export interface GapFillGap {
  gap_id: number;
  options: string[];
  correct_index: number;
}
export interface GapFillConfig {
  gaps: GapFillGap[];
}

export interface OrderingConfig {
  fixed_first: boolean;
  options_pool: string[];
  correct_order: number[];
}

export type WordBankVariant = 'DEFINITION' | 'COLLOCATION' | 'SENTENCE' | 'SYNONYM' | 'ANTONYM';
export interface WordBankSlot {
  slot_id: string;
  prompt: string;
  correct_answer: string;
}
export interface WordBankConfig {
  task_variant: WordBankVariant;
  options_pool: string[];
  slots: WordBankSlot[];
}

export interface SpeakerMatchSpeaker {
  speaker_index: number;
  correct_answer: string;
}
export interface ListeningSpeakerMatchConfig {
  options_pool: string[];
  speakers: SpeakerMatchSpeaker[];
}

export type AgreementChoice = 'MAN' | 'WOMAN' | 'BOTH';
// Listening P3 — Opinion Matching: gom cả part vào 1 bản ghi, mỗi nhận định 1 statement
export interface AgreementStatement {
  statement: string;
  correct: AgreementChoice;
}
export interface SpeakerAgreementConfig {
  choice_kind: 'SPEAKER_AGREEMENT';
  statements: AgreementStatement[];
}

export interface ReadingPerson {
  key: string;
  passage: string;
}
export interface ReadingPersonQuestion {
  statement: string;
  correct_person: string;
}
export interface ReadingSpeakerMatchConfig {
  people: ReadingPerson[];
  questions: ReadingPersonQuestion[];
}

export interface HeadingExample {
  paragraph_label: string;
  paragraph_text: string;
  correct_heading: string;
}
export interface HeadingParagraph {
  label: string;
  text: string;
}
export interface HeadingAnswer {
  paragraph_label: string;
  correct_heading: string;
}
export interface HeadingMatchConfig {
  example: HeadingExample;
  paragraphs: HeadingParagraph[];
  headings_pool: string[];
  answers: HeadingAnswer[];
}

export type EssayRegister = 'FORMAL' | 'INFORMAL';
// Câu con trong Writing P1 (chỉ question) / P3 (kèm speaker_name)
export interface EssayPrompt {
  question: string;
  speaker_name?: string;
  sample_answer?: string; // đáp án mẫu cho câu con (P1/P3)
}
// Task trong Writing P4 (mỗi part 1 bản ghi, gói 2 task Informal/Formal)
export interface EssayTask {
  task_label: string;
  instruction: string;
  register_type: EssayRegister;
  word_limit_min: number;
  word_limit_max: number;
  sample_answer?: string; // bài mẫu cho task (P4)
}
export interface EssayConfig {
  word_limit_min?: number; // P1/P2/P3 (P4 giới hạn nằm trong từng task)
  word_limit_max?: number;
  speaker_name?: string; // (cũ) Writing P3
  register_type?: EssayRegister; // (cũ) Writing P4
  task_label?: string; // (cũ) Writing P4
  question_group_id?: string; // (cũ) Writing P4
  context?: string; // Writing P4 (Notice dùng chung)
  sample_answer?: string; // bài mẫu (P2 top-level)
  prompts?: EssayPrompt[]; // Writing P1 (5 câu) / P3 (3 câu)
  tasks?: EssayTask[]; // Writing P4 (2 task)
}

// Speaking: câu con trong P2/P3/P4 (gói cả part vào 1 bản ghi)
export interface RecordQuestion {
  question: string;
  sample_answer?: string;
}
export interface RecordConfig {
  response_time_seconds: 30 | 45 | 120;
  prep_time_seconds: 0 | 60;
  image_count: 0 | 1 | 2;
  image_urls?: string[];
  questions?: RecordQuestion[]; // Speaking P2/P3/P4 (P1 không có → tách lẻ)
}

export type QuestionExtraConfig =
  | McConfig
  | MonologueConfig
  | GapFillConfig
  | OrderingConfig
  | WordBankConfig
  | ListeningSpeakerMatchConfig
  | SpeakerAgreementConfig
  | ReadingSpeakerMatchConfig
  | HeadingMatchConfig
  | EssayConfig
  | RecordConfig;

// ---------- Entity & Payload ----------
export interface IQuestion {
  id: number;
  skillId: number;
  partNumber: number;
  questionType: QuestionType;
  content: string;
  mediaUrl: string | null;
  extraConfig: QuestionExtraConfig;
  createdBy: number;
  createdAt: string;
  deletedAt: string | null;
}

export interface ICreateQuestionPayload {
  skillId: number;
  partNumber: number;
  content: string;
  mediaUrl?: string;
  extraConfig: QuestionExtraConfig;
}

export interface IUpdateQuestionPayload {
  content?: string;
  mediaUrl?: string;
  extraConfig?: QuestionExtraConfig;
}

export interface IQuestionFilter {
  skillId?: number;
  partNumber?: number;
  questionType?: QuestionType;
  search?: string;
  page?: number;
  limit?: number;
}

export interface IPageMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPage: number;
}

export interface IPaginated<T> {
  data: T[];
  metaData: IPageMeta | null;
}

// ---------- Upload file ----------
export type FileFolderType = 'images' | 'audio';
export interface IUploadedFile {
  url: string;
  key: string;
  size: number;
  mimeType: string;
}
