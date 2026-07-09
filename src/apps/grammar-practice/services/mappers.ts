import { IQuestion, McConfig, WordBankConfig } from '../../admin/pages/admin-questions/services/types';
import { IGrammarQuestion, IVocabularySet, IVocabularyType } from '../types';

// ---------- Part 1: Grammar (MC) ----------
export const mapGrammarQuestions = (records: IQuestion[]): IGrammarQuestion[] =>
  records.map((r, i) => {
    const cfg = r.extraConfig as unknown as McConfig;
    const options = (cfg?.options ?? []).map((o) => o.content);
    const correct = (cfg?.options ?? []).find((o) => o.is_correct)?.content ?? '';
    return {
      id: `g${i + 1}`,
      questionNumber: i + 1,
      sentence: r.content,
      options,
      correctAnswer: correct,
    };
  });

// ---------- Part 2: Vocabulary (WORD_BANK, 5 task) ----------
const VARIANT_LABEL: Record<string, string> = {
  DEFINITION: 'Word Definition (Ghép định nghĩa)',
  COLLOCATION: 'Word Collocation (Từ hay đi kèm)',
  SENTENCE: 'Word Use (Điền từ vào câu)',
  SYNONYM: 'Synonym (Từ đồng nghĩa)',
  ANTONYM: 'Antonym (Từ trái nghĩa)',
};

// Câu lệnh chuẩn APTIS cho từng task (fallback khi bản ghi không có content)
const VARIANT_INSTRUCTION: Record<string, string> = {
  DEFINITION: 'Complete each definition using a word from the list. Use each word once only. You will not need five of the words.',
  COLLOCATION: 'Select a word from the list that is most often used with the word on the left. Use each word once only. You will not need five of the words.',
  SENTENCE: 'Finish each sentence using a word from the list. Use each word once only. You will not need five of the words.',
  SYNONYM: 'Select a word from the list that has the most similar meaning to the word on the left.',
  ANTONYM: 'Select a word from the list that has the opposite meaning to the word on the left.',
};

// SENTENCE: dropdown nằm inline giữa câu (type 'context'); các task còn lại: dòng trái/phải
const variantType = (variant: string): IVocabularyType =>
  variant === 'SENTENCE' ? 'context' : 'synonym';

// Chuẩn hóa chỗ trống về đúng '_______' (7 gạch) mà VocabularySection dùng để split
const normalizeBlank = (prompt: string, variant: string): string => {
  if (variant !== 'SENTENCE') return prompt;
  if (/_{2,}/.test(prompt)) return prompt.replace(/_{2,}/g, '_______');
  return `${prompt} _______`; // câu không có chỗ trống -> thêm vào cuối
};

export const mapVocabularySets = (records: IQuestion[]): IVocabularySet[] => {
  let counter = 0; // đánh số câu chạy liên tục qua các task (bắt đầu từ 1)
  return records.map((r, i) => {
    const cfg = r.extraConfig as unknown as WordBankConfig;
    const variant = cfg?.task_variant ?? 'DEFINITION';
    const slots = cfg?.slots ?? [];
    return {
      id: `set${i + 1}`,
      type: variantType(variant),
      title: `Task ${i + 1}: ${VARIANT_LABEL[variant] ?? 'Từ vựng'}`,
      instruction: r.content || VARIANT_INSTRUCTION[variant] || 'Chọn từ phù hợp từ danh sách cho mỗi câu.',
      subQuestions: slots.map((s) => {
        counter += 1;
        return {
          id: s.slot_id || `v${counter}`,
          questionNumber: counter,
          leftLabel: normalizeBlank(s.prompt, variant),
          correctAnswer: s.correct_answer,
        };
      }),
      optionsList: cfg?.options_pool ?? [],
    };
  });
};
