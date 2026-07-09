import { IExamSetDetail } from '../../admin/pages/admin-exams/services/types';
import { IQuestion } from '../../admin/pages/admin-questions/services/types';
import { mapSpeakingP1, mapSpeakingSets, SpeakingP1Item, SpeakingSet } from './mappers';

export interface SpeakingExamPartData {
  partNumber: number;
  questions: IQuestion[];
}

export interface SpeakingExamData {
  part1: SpeakingP1Item[];
  part2: SpeakingSet[];
  part3: SpeakingSet[];
  part4: SpeakingSet[];
}

export const flattenSpeakingExam = (exam: IExamSetDetail): SpeakingExamPartData[] => {
  const byPart = new Map<number, SpeakingExamPartData>();

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

export const buildSpeakingExam = (exam: IExamSetDetail): SpeakingExamData => {
  const parts = flattenSpeakingExam(exam);
  const getPart = (partNumber: number) => parts.find((part) => part.partNumber === partNumber)?.questions ?? [];

  return {
    part1: mapSpeakingP1(getPart(1)),
    part2: mapSpeakingSets(getPart(2)),
    part3: mapSpeakingSets(getPart(3)),
    part4: mapSpeakingSets(getPart(4)),
  };
};
