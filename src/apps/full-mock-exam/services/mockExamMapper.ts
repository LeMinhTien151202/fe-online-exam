import { IExamSetDetail } from '../../admin/pages/admin-exams/services/types';
import { buildGrammarExam, GrammarExamData } from '../../grammar-practice/services/grammarExamMapper';
import { buildListeningExam, ListeningExamData } from '../../listening-practice/services/listeningExamMapper';
import { flattenExam as flattenReadingExam } from '../../reading-practice/services/readingExamMapper';
import {
  mapPart1 as mapRPart1,
  mapPart2 as mapRPart2,
  mapPart3 as mapRPart3,
  mapPart4 as mapRPart4,
  Part1Data,
  Part2Data,
  Part3Data,
  Part4Data,
} from '../../reading-practice/services/mappers';
import { buildWritingPrompts, WritingPromptItem } from '../../writing-practice/services/writingExamMapper';
import { buildSpeakingExam, SpeakingExamData } from '../../speaking-practice/services/speakingExamMapper';

// Đề MOCK_TEST: mỗi section 1 kỹ năng (skillId 1..5). Cắt exam theo skill rồi
// tái dùng builder của từng app luyện tập để giữ shape dữ liệu nhất quán.
const sliceBySkill = (exam: IExamSetDetail, skillId: number): IExamSetDetail => ({
  ...exam,
  sections: (exam.sections ?? []).filter((s) => s.skillId === skillId),
});

// Reading trong bộ đề: đủ 5 phần API (P2 & P3 cùng dạng ORDERING)
export interface ReadingExamData {
  part1: Part1Data[];
  orderingP2: Part2Data | null;
  orderingP3: Part2Data | null;
  speakerP4: Part3Data | null;
  headingP5: Part4Data | null;
}

const buildReadingExam = (exam: IExamSetDetail): ReadingExamData => {
  const parts = flattenReadingExam(exam);
  const getPart = (n: number) => parts.find((p) => p.partNumber === n)?.questions ?? [];
  const firstOf = (n: number) => getPart(n)[0];

  return {
    part1: getPart(1).map(mapRPart1).filter((x): x is Part1Data => !!x),
    orderingP2: firstOf(2) ? mapRPart2(firstOf(2)) : null,
    orderingP3: firstOf(3) ? mapRPart2(firstOf(3)) : null,
    speakerP4: firstOf(4) ? mapRPart3(firstOf(4)) : null,
    headingP5: firstOf(5) ? mapRPart4(firstOf(5)) : null,
  };
};

export interface FullMockExamData {
  title: string;
  // thời lượng phút theo section (skillId -> durationMinutes)
  durations: Record<number, number>;
  grammar: GrammarExamData; // skill 1
  listening: ListeningExamData; // skill 2
  reading: ReadingExamData; // skill 3
  writing: WritingPromptItem[]; // skill 4
  speaking: SpeakingExamData; // skill 5
}

export const buildFullMockExam = (exam: IExamSetDetail): FullMockExamData => {
  const durations: Record<number, number> = {};
  (exam.sections ?? []).forEach((s) => {
    if (s.skillId != null) durations[s.skillId] = s.durationMinutes;
  });

  return {
    title: exam.title,
    durations,
    grammar: buildGrammarExam(sliceBySkill(exam, 1)),
    listening: buildListeningExam(sliceBySkill(exam, 2)),
    reading: buildReadingExam(sliceBySkill(exam, 3)),
    writing: buildWritingPrompts(sliceBySkill(exam, 4)),
    speaking: buildSpeakingExam(sliceBySkill(exam, 5)),
  };
};
