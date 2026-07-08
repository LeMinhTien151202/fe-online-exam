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

// ---------- Part 2: Vocabulary (WORD_BANK, 4-5 task) ----------
// task_variant -> nhãn tiếng Việt + kiểu render (chỉ 'context' render inline; còn lại render dạng dòng)
const VARIANT_LABEL: Record<string, string> = {
  DEFINITION: 'Ghép định nghĩa với từ',
  COLLOCATION: 'Cụm từ thường đi kèm',
  SENTENCE: 'Điền từ vào câu',
  SYNONYM: 'Tìm từ đồng nghĩa',
  ANTONYM: 'Tìm từ trái nghĩa',
};

// Dùng kiểu render dạng dòng (trái = đề, phải = dropdown) cho mọi task để hiển thị nhất quán
const variantType = (): IVocabularyType => 'synonym';

export const mapVocabularySets = (records: IQuestion[]): IVocabularySet[] => {
  let counter = 0; // đánh số câu chạy liên tục qua các task (bắt đầu từ 1)
  return records.map((r, i) => {
    const cfg = r.extraConfig as unknown as WordBankConfig;
    const variant = cfg?.task_variant ?? 'DEFINITION';
    const slots = cfg?.slots ?? [];
    return {
      id: `set${i + 1}`,
      type: variantType(),
      title: `Task ${i + 1}: ${VARIANT_LABEL[variant] ?? 'Từ vựng'}`,
      instruction: r.content || 'Chọn từ phù hợp từ danh sách cho mỗi câu. Mỗi từ chỉ dùng một lần.',
      subQuestions: slots.map((s) => {
        counter += 1;
        return {
          id: s.slot_id || `v${counter}`,
          questionNumber: counter,
          leftLabel: s.prompt,
          correctAnswer: s.correct_answer,
        };
      }),
      optionsList: cfg?.options_pool ?? [],
    };
  });
};
