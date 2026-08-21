import { IExamSubmitResult, SubmitResponseValue } from './types';

export interface IAutoGradeSummary {
  earned: number;
  total: number;
}

// Điểm trắc nghiệm phải lấy từ POST /exams/{id}/submit; response take không chứa đáp án.
// BE luôn chấm CẢ ĐỀ nên `details` gồm cả những câu chưa làm (earned 0 nhưng vẫn tính total).
// Luyện theo phần chỉ nộp 1 câu -> phải lọc theo `questionId`, nếu không sẽ ra kiểu "2/45".
export const summarizeAutoGrade = (
  result: IExamSubmitResult,
  filter: { skillId?: number; partNumber?: number; questionId?: number } = {}
): IAutoGradeSummary =>
  result.details
    .filter((detail) => filter.questionId == null || detail.questionId === filter.questionId)
    .filter((detail) => filter.skillId == null || detail.skillId === filter.skillId)
    .filter((detail) => filter.partNumber == null || detail.partNumber === filter.partNumber)
    .reduce(
      (summary, detail) => ({
        earned: summary.earned + detail.earned,
        total: summary.total + detail.total,
      }),
      { earned: 0, total: 0 }
    );

// Đáp án đúng của 1 câu, chỉ có sau khi nộp. Trả về undefined nếu BE chưa gửi kèm
// (đề chủ quan, hoặc backend chưa cập nhật) — nơi gọi phải tự ẩn phần review đáp án.
export const pickCorrectResponse = (
  result: IExamSubmitResult,
  questionId: number
): SubmitResponseValue | undefined => {
  const detail = result.details.find((item) => item.questionId === questionId);
  return detail?.correctResponse ?? undefined;
};

// Gap-fill / trắc nghiệm nhiều câu con: đáp án đúng là mảng index trong `options`.
// Đổi sang text để hiển thị, bỏ qua ô nào BE không có đáp án.
export const correctIndexesToText = (
  correctResponse: SubmitResponseValue | undefined,
  optionsByPosition: string[][]
): string[] | undefined => {
  if (!Array.isArray(correctResponse)) return undefined;
  return correctResponse.map((value, index) =>
    typeof value === 'number' && value >= 0 ? optionsByPosition[index]?.[value] ?? '' : ''
  );
};
