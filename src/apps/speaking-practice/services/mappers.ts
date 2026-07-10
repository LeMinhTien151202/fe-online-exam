import { IQuestion, RecordConfig } from '../../admin/pages/admin-questions/services/types';

// P1: mỗi bản ghi = 1 câu độc lập
export interface SpeakingP1Item {
  id: number;
  questionId?: number; // id thật trong DB (mỗi câu P1 = 1 bản ghi)
  questionText: string;
  sampleAnswers: string[];
}

export const mapSpeakingP1 = (records: IQuestion[]): SpeakingP1Item[] =>
  records.map((r, i) => ({ id: i + 1, questionId: r.id, questionText: r.content, sampleAnswers: [] }));

// P2/P3/P4: mỗi bản ghi = 1 bộ (ảnh + nhiều câu con)
export interface SpeakingSubQuestion {
  id: number;
  questionText: string;
  sampleAnswers: string[];
}
export interface SpeakingSet {
  id: number;
  questionId?: number; // id thật trong DB (mỗi bộ P2/P3/P4 = 1 bản ghi, nộp mảng URL)
  imageUrls: string[];
  prepTime: number;
  recordTime: number;
  questions: SpeakingSubQuestion[];
}

export const mapSpeakingSets = (records: IQuestion[]): SpeakingSet[] =>
  records.map((r, i) => {
    const cfg = r.extraConfig as unknown as RecordConfig;
    return {
      id: i + 1,
      questionId: r.id,
      imageUrls: cfg?.image_urls ?? [],
      prepTime: cfg?.prep_time_seconds ?? 0,
      recordTime: cfg?.response_time_seconds ?? 45,
      questions: (cfg?.questions ?? []).map((q, j) => ({
        id: j + 1,
        questionText: q.question,
        sampleAnswers: q.sample_answer ? [q.sample_answer] : [],
      })),
    };
  });
