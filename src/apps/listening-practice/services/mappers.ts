import {
  IQuestion,
  McConfig,
  MonologueConfig,
  ListeningSpeakerMatchConfig,
  SpeakerAgreementConfig,
} from '../../admin/pages/admin-questions/services/types';

// ---------- P1: MC (mỗi bản ghi = 1 câu, audio riêng) ----------
export interface LPart1Question {
  id: number;
  questionId?: number; // id thật trong DB
  questionText: string;
  options: string[];
  correctIndex: number;
  mediaUrl: string | null;
}

export const mapLPart1 = (records: IQuestion[]): LPart1Question[] =>
  records.map((r, i) => {
    const cfg = r.extraConfig as unknown as McConfig;
    const options = (cfg?.options ?? []).map((o) => o.content);
    return {
      id: i + 1,
      questionId: r.id,
      questionText: r.content,
      options,
      correctIndex: (cfg?.options ?? []).findIndex((o) => o.is_correct),
      mediaUrl: r.mediaUrl,
    };
  });

// ---------- P2: SPEAKER_MATCH (1 bản ghi = 1 bài, 4 người / 6 câu văn) ----------
export interface LPart2Set {
  id: number;
  questionId?: number; // id thật trong DB
  mediaUrl: string | null;
  instruction: string;
  options: { value: string; label: string }[]; // options_pool
  speakerCount: number;
  correctBySpeaker: Record<number, string>; // speaker_index -> correct_answer
}

export const mapLPart2 = (records: IQuestion[]): LPart2Set[] =>
  records.map((r, i) => {
    const cfg = r.extraConfig as unknown as ListeningSpeakerMatchConfig;
    const pool = cfg?.options_pool ?? [];
    const speakers = cfg?.speakers ?? [];
    return {
      id: i + 1,
      questionId: r.id,
      mediaUrl: r.mediaUrl,
      instruction: r.content,
      options: pool.map((s) => ({ value: s, label: s })),
      speakerCount: speakers.length || 4,
      correctBySpeaker: Object.fromEntries(speakers.map((s) => [s.speaker_index, s.correct_answer])),
    };
  });

// ---------- P3: SPEAKER_AGREEMENT (1 bản ghi = cả bài, statements[]) ----------
export interface LPart3Statement {
  id: number;
  text: string;
  correct: string; // MAN | WOMAN | BOTH
}
export interface LPart3Set {
  id: number;
  questionId?: number; // id thật trong DB
  mediaUrl: string | null;
  instruction: string;
  statements: LPart3Statement[];
}

export const mapLPart3 = (records: IQuestion[]): LPart3Set[] =>
  records.map((r, i) => {
    const cfg = r.extraConfig as unknown as SpeakerAgreementConfig;
    return {
      id: i + 1,
      questionId: r.id,
      mediaUrl: r.mediaUrl,
      instruction: r.content,
      statements: (cfg?.statements ?? []).map((s, j) => ({ id: j + 1, text: s.statement, correct: s.correct })),
    };
  });

// ---------- P4: Monologue (mỗi bản ghi = 1 bài nghe, questions[] MC) ----------
export interface LPart4SubQuestion {
  id: string;
  title: string;
  options: string[];
  correctIndex: number;
}
export interface LPart4Group {
  id: number;
  questionId?: number; // id thật trong DB
  title: string;
  instruction: string;
  mediaUrl: string | null;
  subQuestions: LPart4SubQuestion[];
}

export const mapLPart4 = (records: IQuestion[]): LPart4Group[] =>
  records.map((r, i) => {
    const cfg = r.extraConfig as unknown as MonologueConfig;
    return {
      id: i + 1,
      questionId: r.id,
      title: `Bài nghe ${i + 1}`,
      instruction: r.content,
      mediaUrl: r.mediaUrl,
      subQuestions: (cfg?.questions ?? []).map((q, j) => ({
        id: `${i + 1}.${j + 1}`,
        title: q.question,
        options: (q.options ?? []).map((o) => o.content),
        correctIndex: (q.options ?? []).findIndex((o) => o.is_correct),
      })),
    };
  });
