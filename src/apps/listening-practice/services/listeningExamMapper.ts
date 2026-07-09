import { IExamSetDetail } from '../../admin/pages/admin-exams/services/types';
import { IQuestion } from '../../admin/pages/admin-questions/services/types';
import {
  LPart1Question,
  LPart2Set,
  LPart3Set,
  LPart4Group,
  mapLPart1,
  mapLPart2,
  mapLPart3,
  mapLPart4,
} from './mappers';

export interface ListeningExamPartData {
  partNumber: number;
  questions: IQuestion[];
}

export interface ListeningExamData {
  part1: LPart1Question[];
  part2: LPart2Set[];
  part3: LPart3Set[];
  part4: LPart4Group[];
}

export const flattenListeningExam = (exam: IExamSetDetail): ListeningExamPartData[] => {
  const byPart = new Map<number, ListeningExamPartData>();

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

export const buildListeningExam = (exam: IExamSetDetail): ListeningExamData => {
  const parts = flattenListeningExam(exam);
  const getPart = (partNumber: number) => parts.find((part) => part.partNumber === partNumber)?.questions ?? [];

  return {
    part1: mapLPart1(getPart(1)),
    part2: mapLPart2(getPart(2)),
    part3: mapLPart3(getPart(3)),
    part4: mapLPart4(getPart(4)),
  };
};
