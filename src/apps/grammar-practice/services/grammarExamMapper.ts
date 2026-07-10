import { IExamSetDetail } from '../../admin/pages/admin-exams/services/types';
import { IQuestion } from '../../admin/pages/admin-questions/services/types';
import { ISubmitAnswer } from '../../../shared/services/student-exam';
import { IGrammarQuestion, IVocabularySet } from '../types';
import { mapGrammarQuestions, mapVocabularySets } from './mappers';

export interface GrammarExamPartData {
  partNumber: number;
  questions: IQuestion[];
}

export interface GrammarExamData {
  grammarQuestions: IGrammarQuestion[];
  vocabularySets: IVocabularySet[];
}

export const flattenGrammarExam = (exam: IExamSetDetail): GrammarExamPartData[] => {
  const byPart = new Map<number, GrammarExamPartData>();

  [...(exam.sections ?? [])]
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .forEach((section) => {
      [...(section.parts ?? [])]
        .sort((a, b) => a.partNumber - b.partNumber)
        .forEach((part) => {
          const existing = byPart.get(part.partNumber) ?? {
            partNumber: part.partNumber,
            questions: [],
          };

          [...(part.questions ?? [])]
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .forEach((partQuestion) => {
              if (partQuestion.question) {
                existing.questions.push(partQuestion.question as unknown as IQuestion);
              }
            });

          byPart.set(part.partNumber, existing);
        });
    });

  return Array.from(byPart.values()).sort((a, b) => a.partNumber - b.partNumber);
};

// Dịch state đáp án (key = questionNumber toàn cục) sang shape submit của API.
// Dùng chung cho trang bộ đề (SKILL_FULL_SET) và section trong thi thử.
export const collectGrammarAnswers = (
  data: GrammarExamData,
  answers: Record<number, string>,
): ISubmitAnswer[] => {
  const result: ISubmitAnswer[] = [];
  data.grammarQuestions.forEach((q) => {
    const chosen = answers[q.questionNumber];
    if (q.questionId == null || chosen == null) return;
    const idx = q.options.indexOf(chosen);
    if (idx >= 0) result.push({ questionId: q.questionId, response: idx });
  });
  data.vocabularySets.forEach((set) => {
    if (set.questionId == null) return;
    const response: Record<string, string> = {};
    set.subQuestions.forEach((sub) => {
      const chosen = answers[sub.questionNumber];
      if (chosen != null) response[sub.id] = chosen;
    });
    if (Object.keys(response).length > 0) result.push({ questionId: set.questionId, response });
  });
  return result;
};

const offsetVocabularyNumbers = (sets: IVocabularySet[], offset: number): IVocabularySet[] =>
  sets.map((set) => ({
    ...set,
    subQuestions: set.subQuestions.map((subQuestion) => ({
      ...subQuestion,
      questionNumber: subQuestion.questionNumber + offset,
    })),
  }));

export const buildGrammarExam = (exam: IExamSetDetail): GrammarExamData => {
  const parts = flattenGrammarExam(exam);
  const getPart = (partNumber: number) => parts.find((part) => part.partNumber === partNumber)?.questions ?? [];
  const grammarQuestions = mapGrammarQuestions(getPart(1));
  const vocabularySets = offsetVocabularyNumbers(mapVocabularySets(getPart(2)), grammarQuestions.length);

  return {
    grammarQuestions,
    vocabularySets,
  };
};
