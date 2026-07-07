import { EssayConfig, IQuestion } from '../../admin/pages/admin-questions/services/types';

// ---------- Part 1: 5 câu điền ngắn ----------
export interface WPart1Data {
  instruction: string;
  wordMin: number;
  wordMax: number;
  questions: { id: number; questionText: string; sampleAnswer?: string }[];
}

export const mapWPart1 = (q: IQuestion): WPart1Data | null => {
  const cfg = q.extraConfig as unknown as EssayConfig;
  const prompts = cfg?.prompts ?? [];
  if (!prompts.length) return null;
  return {
    instruction: q.content,
    wordMin: cfg.word_limit_min ?? 1,
    wordMax: cfg.word_limit_max ?? 5,
    questions: prompts.map((p, i) => ({ id: i + 1, questionText: p.question, sampleAnswer: p.sample_answer })),
  };
};

// ---------- Part 2: 1 đề ----------
export interface WPart2Data {
  prompt: string;
  wordMin: number;
  wordMax: number;
  sampleAnswer?: string;
}

export const mapWPart2 = (q: IQuestion): WPart2Data | null => {
  const cfg = q.extraConfig as unknown as EssayConfig;
  if (!q.content) return null;
  return {
    prompt: q.content,
    wordMin: cfg?.word_limit_min ?? 20,
    wordMax: cfg?.word_limit_max ?? 30,
    sampleAnswer: cfg?.sample_answer,
  };
};

// ---------- Part 3: chat 3 thành viên ----------
export interface WPart3Message {
  id: number;
  sender: string;
  avatar: string;
  messageText: string;
  sampleAnswer?: string;
}
export interface WPart3Data {
  wordMin: number;
  wordMax: number;
  messages: WPart3Message[];
}

export const mapWPart3 = (q: IQuestion): WPart3Data | null => {
  const cfg = q.extraConfig as unknown as EssayConfig;
  const prompts = cfg?.prompts ?? [];
  if (!prompts.length) return null;
  return {
    wordMin: cfg.word_limit_min ?? 30,
    wordMax: cfg.word_limit_max ?? 40,
    messages: prompts.map((p, i) => {
      const sender = p.speaker_name || `Member ${String.fromCharCode(65 + i)}`;
      return {
        id: i + 1,
        sender,
        avatar: sender.charAt(0).toUpperCase(),
        messageText: p.question,
        sampleAnswer: p.sample_answer,
      };
    }),
  };
};

// ---------- Part 4: Notice + 2 task ----------
export interface WPart4Data {
  situation: string;
  informalPrompt: string;
  formalPrompt: string;
  informalMin: number;
  informalMax: number;
  formalMin: number;
  formalMax: number;
  informalSample?: string;
  formalSample?: string;
}

export const mapWPart4 = (q: IQuestion): WPart4Data | null => {
  const cfg = q.extraConfig as unknown as EssayConfig;
  const tasks = cfg?.tasks ?? [];
  if (!tasks.length) return null;
  const informal = tasks.find((t) => t.register_type === 'INFORMAL') ?? tasks[0];
  const formal = tasks.find((t) => t.register_type === 'FORMAL') ?? tasks[1] ?? tasks[0];
  return {
    situation: cfg.context ?? q.content,
    informalPrompt: informal?.instruction ?? '',
    formalPrompt: formal?.instruction ?? '',
    informalMin: informal?.word_limit_min ?? 50,
    informalMax: informal?.word_limit_max ?? 75,
    formalMin: formal?.word_limit_min ?? 120,
    formalMax: formal?.word_limit_max ?? 150,
    informalSample: informal?.sample_answer,
    formalSample: formal?.sample_answer,
  };
};
