// ============================================================
// Exam Sets — Types (khớp FE_PHASE4_EXAM_SETS.md)
// ============================================================
import { IQuestion } from '../../admin-questions/services/types';

export type ExamType = 'PART_PRACTICE' | 'SKILL_FULL_SET' | 'MOCK_TEST';

// FE dùng 'partial'|'set'|'full' ở form -> map sang ExamType của API
export type ExamUiType = 'partial' | 'set' | 'full';

export const UI_TYPE_TO_API: Record<ExamUiType, ExamType> = {
  partial: 'PART_PRACTICE',
  set: 'SKILL_FULL_SET',
  full: 'MOCK_TEST',
};

export const API_TYPE_TO_UI: Record<ExamType, ExamUiType> = {
  PART_PRACTICE: 'partial',
  SKILL_FULL_SET: 'set',
  MOCK_TEST: 'full',
};

// Kỹ năng: label FE <-> id BE (seed)
export const FE_SKILL_TO_ID: Record<string, number> = {
  Grammar: 1,
  Listening: 2,
  Reading: 3,
  Writing: 4,
  Speaking: 5,
};

export const ID_TO_FE_SKILL: Record<number, string> = {
  1: 'Grammar',
  2: 'Listening',
  3: 'Reading',
  4: 'Writing',
  5: 'Speaking',
};

export interface IExamSkill {
  id: number;
  name: string;
  totalParts: number;
}

export interface IExamPart {
  id: number;
  sectionId: number;
  partNumber: number;
  instruction: string | null;
  audioUrl: string | null;
  questions: IExamPartQuestion[];
}

export interface IExamSection {
  id: number;
  examId: number;
  skillId: number;
  durationMinutes: number;
  orderIndex: number;
  skill?: IExamSkill;
  parts: IExamPart[];
}

export interface IExamPartQuestion {
  examPartId: number;
  questionId: number;
  orderIndex: number;
  question?: {
    id: number;
    skillId: number;
    partNumber: number;
    questionType: string;
    content: string;
    mediaUrl?: string | null;
    extraConfig?: unknown;
  };
}

// Đề dạng list (rút gọn)
export interface IExamSetListItem {
  id: number;
  title: string;
  description?: string;
  type: ExamType;
  skillId: number | null;
  partNumber: number | null;
  isActive: boolean;
  createdAt: string;
  skill?: IExamSkill;
  _count?: { sections: number; attempts: number };
}

// Đề dạng chi tiết (full tree)
export interface IExamSetDetail extends IExamSetListItem {
  sections: IExamSection[];
}

export interface ICreateExamPayload {
  title: string;
  description?: string;
  type: ExamType;
  skillId?: number;
  partNumber?: number;
}

export interface IUpdateExamPayload {
  title?: string;
  description?: string;
}

export interface IAssignQuestion {
  questionId: number;
  orderIndex: number;
}

export interface IExamFilter {
  type?: ExamType;
  skillId?: number;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

// Câu hỏi trong ngân hàng, đã map về shape mà các Selection component dùng
export interface IBankQuestion {
  key: string;
  id: number;
  content: string;
  type: string; // 'Grammar' | 'Vocabulary' | 'Reading' | 'Listening' | 'Speaking' | 'Writing'
  part: string; // 'Part 1'..'Part 5'
  task?: string; // 'Task 1'..'Task 5' cho Vocabulary
  skillId: number;
  partNumber: number;
  raw: IQuestion; // câu hỏi gốc từ API (dùng cho bước xem trước: đáp án, media, extraConfig)
}
