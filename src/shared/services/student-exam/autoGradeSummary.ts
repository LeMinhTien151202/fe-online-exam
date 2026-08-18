import { IExamSubmitResult } from './types';

export interface IAutoGradeSummary {
  earned: number;
  total: number;
}

// Điểm trắc nghiệm phải lấy từ POST /exams/{id}/submit; response take không chứa đáp án.
export const summarizeAutoGrade = (
  result: IExamSubmitResult,
  filter: { skillId?: number; partNumber?: number } = {}
): IAutoGradeSummary =>
  result.details
    .filter((detail) => filter.skillId == null || detail.skillId === filter.skillId)
    .filter((detail) => filter.partNumber == null || detail.partNumber === filter.partNumber)
    .reduce(
      (summary, detail) => ({
        earned: summary.earned + detail.earned,
        total: summary.total + detail.total,
      }),
      { earned: 0, total: 0 }
    );
