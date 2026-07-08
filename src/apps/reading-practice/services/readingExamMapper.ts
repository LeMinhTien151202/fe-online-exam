import { IExamSetDetail } from '../../admin/pages/admin-exams/services/types';
import { IQuestion } from '../../admin/pages/admin-questions/services/types';

// Bộ đề đầy đủ Reading giữ cả 5 phần theo API (partNumber 1..5).
// P1 gap-fill, P2 & P3 cùng dạng ORDERING, P4 speaker-match, P5 heading-match.
// Flatten exam tree (sections → parts → questions.question), gom câu hỏi theo partNumber.
export interface ExamPartData {
  partNumber: number; // 1..5 theo API
  instruction: string | null;
  audioUrl: string | null;
  questions: IQuestion[];
}

export const flattenExam = (exam: IExamSetDetail): ExamPartData[] => {
  const byPart = new Map<number, ExamPartData>();

  [...(exam.sections ?? [])]
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .forEach((section) => {
      [...(section.parts ?? [])]
        .sort((a, b) => a.partNumber - b.partNumber)
        .forEach((part) => {
          const existing = byPart.get(part.partNumber) ?? {
            partNumber: part.partNumber,
            instruction: part.instruction,
            audioUrl: part.audioUrl,
            questions: [],
          };
          [...(part.questions ?? [])]
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .forEach((pq) => {
              if (pq.question) existing.questions.push(pq.question as unknown as IQuestion);
            });
          byPart.set(part.partNumber, existing);
        });
    });

  return Array.from(byPart.values()).sort((a, b) => a.partNumber - b.partNumber);
};
