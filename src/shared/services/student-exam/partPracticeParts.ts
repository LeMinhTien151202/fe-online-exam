import { IStudentExamSummary } from './types';

// Ánh xạ phần hiển thị (feId trên trang kỹ năng) -> partNumber thật trên API của kỹ năng.
export interface PartMapEntry {
  feId: string;
  apiPart: number;
}

export interface PartPracticePart extends PartMapEntry {
  skillId: number;
}

export const SKILL_ID = {
  GRAMMAR: 1,
  LISTENING: 2,
  READING: 3,
  WRITING: 4,
  SPEAKING: 5,
} as const;

export const GRAMMAR_PART_MAP: PartMapEntry[] = [
  { feId: 'g1', apiPart: 1 },
  { feId: 'g2', apiPart: 2 },
];

export const LISTENING_PART_MAP: PartMapEntry[] = [
  { feId: 'l1', apiPart: 1 },
  { feId: 'l2', apiPart: 2 },
  { feId: 'l3', apiPart: 3 },
  { feId: 'l4', apiPart: 4 },
];

// Reading: r1→API part 1, r2→2, r3→4, r4→5 (bỏ API part 3 vì trùng dạng với part 2).
export const READING_PART_MAP: PartMapEntry[] = [
  { feId: 'r1', apiPart: 1 },
  { feId: 'r2', apiPart: 2 },
  { feId: 'r3', apiPart: 4 },
  { feId: 'r4', apiPart: 5 },
];

export const WRITING_PART_MAP: PartMapEntry[] = [
  { feId: 'w1', apiPart: 1 },
  { feId: 'w2', apiPart: 2 },
  { feId: 'w3', apiPart: 3 },
  { feId: 'w4', apiPart: 4 },
];

export const SPEAKING_PART_MAP: PartMapEntry[] = [
  { feId: 's1', apiPart: 1 },
  { feId: 's2', apiPart: 2 },
  { feId: 's3', apiPart: 3 },
  { feId: 's4', apiPart: 4 },
];

// Toàn bộ các phần LUYỆN THEO PHẦN của nền tảng — nguồn sự thật duy nhất.
// Ô "Tiến độ Tổng quan" ngoài trang chủ phải đếm đúng tập này, nếu không nó sẽ lệch
// với các thẻ phần trên trang kỹ năng (mỗi bên tự định nghĩa mẫu số một kiểu).
export const ALL_PART_PRACTICE_PARTS: PartPracticePart[] = [
  ...GRAMMAR_PART_MAP.map((entry) => ({ ...entry, skillId: SKILL_ID.GRAMMAR })),
  ...LISTENING_PART_MAP.map((entry) => ({ ...entry, skillId: SKILL_ID.LISTENING })),
  ...READING_PART_MAP.map((entry) => ({ ...entry, skillId: SKILL_ID.READING })),
  ...WRITING_PART_MAP.map((entry) => ({ ...entry, skillId: SKILL_ID.WRITING })),
  ...SPEAKING_PART_MAP.map((entry) => ({ ...entry, skillId: SKILL_ID.SPEAKING })),
];

/**
 * Chọn đề PART_PRACTICE mà trang luyện của một (kỹ năng, phần) sẽ mở: ưu tiên đề đang active,
 * sau đó tới đề tạo gần nhất.
 *
 * Bắt buộc dùng CHUNG một hàm cho cả trang luyện, thẻ tiến độ và ô tổng quan — trước đây mỗi nơi
 * tự sort một kiểu nên khi một phần có nhiều đề thì % hiển thị lại là của đề khác với đề đang làm.
 */
export const pickPartPracticeExam = (
  items: IStudentExamSummary[] | undefined,
  partNumber: number
): IStudentExamSummary | null =>
  (items ?? [])
    .filter((item) => item.partNumber === partNumber)
    .sort((a, b) => {
      if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
      return b.createdAt > a.createdAt ? 1 : -1;
    })[0] ?? null;
