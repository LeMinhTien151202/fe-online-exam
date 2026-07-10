import {
  GapFillConfig,
  HeadingMatchConfig,
  IQuestion,
  OrderingConfig,
  ReadingSpeakerMatchConfig,
} from '../../admin/pages/admin-questions/services/types';

// ---------- Part 1: Gap fill ----------
export interface Part1Data {
  questionId?: number; // id thật trong DB
  content: string; // đoạn văn chứa ___(1)..(5)
  questions: { id: number; options: string[] }[];
  correctAnswers: Record<number, string>; // gap_id -> đáp án đúng (text)
}

export const mapPart1 = (q: IQuestion): Part1Data | null => {
  const cfg = q.extraConfig as unknown as GapFillConfig;
  if (!cfg?.gaps?.length) return null;
  return {
    questionId: q.id,
    content: q.content,
    questions: cfg.gaps.map((g) => ({ id: g.gap_id, options: g.options })),
    correctAnswers: Object.fromEntries(cfg.gaps.map((g) => [g.gap_id, g.options[g.correct_index]])),
  };
};

// ---------- Part 2: Ordering ----------
export interface Part2Sentence { id: string; text: string; }
export interface Part2Data {
  questionId?: number; // id thật trong DB
  fixedSentence: string;
  fixedPoolIndex: number; // index câu cố định trong options_pool (-1 nếu không cố định)
  initialSentences: Part2Sentence[]; // các câu cần sắp xếp (đã xáo)
  correctOrder: string[]; // id theo đúng thứ tự
}

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const mapPart2 = (q: IQuestion): Part2Data | null => {
  const cfg = q.extraConfig as unknown as OrderingConfig;
  if (!cfg?.options_pool?.length || !cfg?.correct_order?.length) return null;
  const order = cfg.correct_order;
  // Nếu fixed_first: câu đầu trong thứ tự đúng là câu cố định
  const fixedPoolIdx = cfg.fixed_first ? order[0] : -1;
  const restOrder = cfg.fixed_first ? order.slice(1) : order;
  const correctOrder = restOrder.map((idx) => `s${idx}`);
  const sentences = restOrder.map((idx) => ({ id: `s${idx}`, text: cfg.options_pool[idx] }));
  return {
    questionId: q.id,
    fixedSentence: fixedPoolIdx >= 0 ? cfg.options_pool[fixedPoolIdx] : '',
    fixedPoolIndex: fixedPoolIdx,
    initialSentences: shuffle(sentences),
    correctOrder,
  };
};

// ---------- Part 3: Opinion matching (SPEAKER_MATCH people/questions) ----------
export interface Part3Opinion { id: string; name: string; color: string; text: string; }
export interface Part3Question { id: number; text: string; }
export interface Part3Data {
  questionId?: number; // id thật trong DB
  opinions: Part3Opinion[];
  questions: Part3Question[];
  correctAnswers: Record<number, string>; // questionId -> person key
}

const OPINION_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#0ea5e9'];

export const mapPart3 = (q: IQuestion): Part3Data | null => {
  const cfg = q.extraConfig as unknown as ReadingSpeakerMatchConfig;
  if (!cfg?.people?.length || !cfg?.questions?.length) return null;
  return {
    questionId: q.id,
    opinions: cfg.people.map((p, i) => ({
      id: p.key,
      name: p.key,
      color: OPINION_COLORS[i % OPINION_COLORS.length],
      text: p.passage,
    })),
    questions: cfg.questions.map((qq, i) => ({ id: i + 1, text: qq.statement })),
    correctAnswers: Object.fromEntries(cfg.questions.map((qq, i) => [i + 1, qq.correct_person])),
  };
};

// ---------- Part 4: Heading matching ----------
export interface Part4Heading { value: string; label: string; }
export interface Part4Paragraph { num: number; text: string; }
export interface Part4Data {
  questionId?: number; // id thật trong DB
  headings: Part4Heading[];
  paragraphs: Part4Paragraph[];
  correctAnswers: Record<number, string>; // paragraph num -> heading value
}

export const mapPart4 = (q: IQuestion): Part4Data | null => {
  const cfg = q.extraConfig as unknown as HeadingMatchConfig;
  if (!cfg?.paragraphs?.length || !cfg?.headings_pool?.length) return null;
  const headings = cfg.headings_pool.map((label, i) => ({ value: `h${i}`, label }));
  const headingValueByText = new Map(cfg.headings_pool.map((label, i) => [label, `h${i}`]));
  const paragraphs = cfg.paragraphs.map((p) => ({ num: Number(p.label), text: p.text }));
  const correctAnswers: Record<number, string> = {};
  (cfg.answers ?? []).forEach((a) => {
    const value = headingValueByText.get(a.correct_heading);
    if (value) correctAnswers[Number(a.paragraph_label)] = value;
  });
  return { questionId: q.id, headings, paragraphs, correctAnswers };
};
