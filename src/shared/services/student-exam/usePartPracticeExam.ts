import { useMemo } from 'react';
import { IExamSetDetail } from '../../../apps/admin/pages/admin-exams/services/types';
import { useExamSetDetailQuery, usePartPracticeListQuery } from './studentExamQuery';

// Tra đề PART_PRACTICE đúng (skill, part) rồi tải chi tiết (kèm đáp án) để build + chấm cục bộ.
// Trả examId để nộp lên POST /exams/:id/submit (BE tăng student_progress theo part).
export const usePartPracticeExam = (skillId: number, partNumber: number) => {
  const { data: listRes, isLoading: isListLoading } = usePartPracticeListQuery(skillId);

  const examId = useMemo(() => {
    const items = listRes?.data ?? [];
    // Đề PART_PRACTICE gắn đúng partNumber; ưu tiên đề active, rồi tới đề mới nhất.
    // Không loại đề inactive để trang vẫn tải được đề khi admin chưa bật active.
    const matches = items
      .filter((item) => item.partNumber === partNumber)
      .sort((a, b) => {
        if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
        return b.createdAt > a.createdAt ? 1 : -1;
      });
    return matches[0]?.id ?? null;
  }, [listRes, partNumber]);

  const { data: examDetail, isLoading: isDetailLoading } = useExamSetDetailQuery(examId);

  return {
    examId,
    examDetail: (examDetail as IExamSetDetail | undefined) ?? null,
    isLoading: isListLoading || (examId != null && isDetailLoading),
  };
};
