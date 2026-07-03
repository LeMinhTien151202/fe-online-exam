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
  audio_group_id?: string; // Listening P4
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
export interface SpeakerAgreementConfig {
  choice_kind: 'SPEAKER_AGREEMENT';
  correct: AgreementChoice;
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
export interface EssayConfig {
  word_limit_min: number;
  word_limit_max: number;
  speaker_name?: string; // Writing P3
  register_type?: EssayRegister; // Writing P4
  task_label?: string; // Writing P4
  question_group_id?: string; // Writing P4
  context?: string; // Writing P4
}

export interface RecordConfig {
  response_time_seconds: 30 | 45 | 120;
  prep_time_seconds: 0 | 60;
  image_count: 0 | 1 | 2;
  image_urls?: string[];
  question_group_id?: string;
}

export type QuestionExtraConfig =
  | McConfig
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
