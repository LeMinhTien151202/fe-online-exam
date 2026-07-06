import { IQuestion, WordBankConfig } from '../../admin-questions/services/types';
import { IBankQuestion, ID_TO_FE_SKILL } from './types';

const VARIANT_TO_TASK: Record<string, string> = {
  DEFINITION: 'Task 1',
  COLLOCATION: 'Task 2',
  SENTENCE: 'Task 3',
  SYNONYM: 'Task 4',
  ANTONYM: 'Task 5',
};

// Map câu hỏi từ ngân hàng (API) -> shape mà các Selection component đang dùng.
export const mapQuestionToBank = (q: IQuestion): IBankQuestion => {
  const feSkill = ID_TO_FE_SKILL[q.skillId] ?? 'Grammar';

  // Grammar P2 = Vocabulary (WORD_BANK) -> gắn task theo task_variant
  const isVocab = q.skillId === 1 && q.partNumber === 2;
  const type = isVocab ? 'Vocabulary' : feSkill;
  const task = isVocab
    ? VARIANT_TO_TASK[(q.extraConfig as WordBankConfig)?.task_variant] ?? 'Task 1'
    : undefined;

  return {
    key: String(q.id),
    id: q.id,
    content: q.content,
    type,
    part: `Part ${q.partNumber}`,
    task,
    skillId: q.skillId,
    partNumber: q.partNumber,
    raw: q,
  };
};
