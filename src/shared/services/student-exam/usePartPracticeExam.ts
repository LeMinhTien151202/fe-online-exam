import { useMemo } from 'react';
import { usePartPracticeListQuery, useStudentExamTakeQuery } from './studentExamQuery';

// Tra đề PART_PRACTICE đúng (skill, part) rồi tải nội dung đã ẩn đáp án.
// Trả examId để nộp lên POST /exams/:id/submit (BE tăng student_progress theo part).
export const usePartPracticeExam = (skillId: number, partNumber: number) => {
  const { data: listRes, isLoading: isListLoading } = usePartPracticeListQuery(skillId);

  const examId = useMemo(() => {
    const items = listRes?.data ?? [];
    // API học viên chỉ trả đề active; nếu có nhiều đề thì chọn đề mới nhất.
    const matches = items
      .filter((item) => item.partNumber === partNumber)
      .sort((a, b) => {
        return b.createdAt > a.createdAt ? 1 : -1;
      });
    return matches[0]?.id ?? null;
  }, [listRes, partNumber]);

  const { data: examDetail, isLoading: isDetailLoading } = useStudentExamTakeQuery(examId);

  return {
    examId,
    examDetail: examDetail ?? null,
    isLoading: isListLoading || (examId != null && isDetailLoading),
  };
};
