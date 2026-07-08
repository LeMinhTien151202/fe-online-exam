import { IExamSetDetail } from '../../admin/pages/admin-exams/services/types';
import { IQuestion } from '../../admin/pages/admin-questions/services/types';
import { mapWPart1, mapWPart2, mapWPart3, mapWPart4 } from './mappers';

export interface WritingExamPartData {
  partNumber: number;
  instruction: string | null;
  questions: IQuestion[];
}

export interface WritingPromptItem {
  id: number;
  partNumber: number;
  partLabel: string;
  title: string;
  instruction: string;
  prompt: string;
  minWords: number;
  maxWords: number;
  sampleAnswer?: string;
}

export const flattenWritingExam = (exam: IExamSetDetail): WritingExamPartData[] => {
  const byPart = new Map<number, WritingExamPartData>();

  [...(exam.sections ?? [])]
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .forEach((section) => {
      [...(section.parts ?? [])]
        .sort((a, b) => a.partNumber - b.partNumber)
        .forEach((part) => {
          const existing = byPart.get(part.partNumber) ?? {
            partNumber: part.partNumber,
            instruction: part.instruction,
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

export const buildWritingPrompts = (exam: IExamSetDetail): WritingPromptItem[] => {
  const parts = flattenWritingExam(exam);
  const prompts: WritingPromptItem[] = [];

  parts.forEach((part) => {
    const firstQuestion = part.questions[0];
    if (!firstQuestion) return;

    if (part.partNumber === 1) {
      const data = mapWPart1(firstQuestion);
      if (!data) return;
      data.questions.forEach((question) => {
        prompts.push({
          id: prompts.length + 1,
          partNumber: 1,
          partLabel: 'Part 1',
          title: `Câu ${question.id}: Word-level writing`,
          instruction: data.instruction,
          prompt: question.questionText,
          minWords: data.wordMin,
          maxWords: data.wordMax,
          sampleAnswer: question.sampleAnswer,
        });
      });
      return;
    }

    if (part.partNumber === 2) {
      const data = mapWPart2(firstQuestion);
      if (!data) return;
      prompts.push({
        id: prompts.length + 1,
        partNumber: 2,
        partLabel: 'Part 2',
        title: 'Short text writing',
        instruction: 'Write a short response for the form or club prompt.',
        prompt: data.prompt,
        minWords: data.wordMin,
        maxWords: data.wordMax,
        sampleAnswer: data.sampleAnswer,
      });
      return;
    }

    if (part.partNumber === 3) {
      const data = mapWPart3(firstQuestion);
      if (!data) return;
      data.messages.forEach((message) => {
        prompts.push({
          id: prompts.length + 1,
          partNumber: 3,
          partLabel: 'Part 3',
          title: `${message.sender}: Chat response`,
          instruction: 'Reply to each member in the chat room.',
          prompt: message.messageText,
          minWords: data.wordMin,
          maxWords: data.wordMax,
          sampleAnswer: message.sampleAnswer,
        });
      });
      return;
    }

    if (part.partNumber === 4) {
      const data = mapWPart4(firstQuestion);
      if (!data) return;
      prompts.push({
        id: prompts.length + 1,
        partNumber: 4,
        partLabel: 'Part 4',
        title: 'Informal email',
        instruction: data.situation,
        prompt: data.informalPrompt,
        minWords: data.informalMin,
        maxWords: data.informalMax,
        sampleAnswer: data.informalSample,
      });
      prompts.push({
        id: prompts.length + 1,
        partNumber: 4,
        partLabel: 'Part 4',
        title: 'Formal email',
        instruction: data.situation,
        prompt: data.formalPrompt,
        minWords: data.formalMin,
        maxWords: data.formalMax,
        sampleAnswer: data.formalSample,
      });
    }
  });

  return prompts;
};
