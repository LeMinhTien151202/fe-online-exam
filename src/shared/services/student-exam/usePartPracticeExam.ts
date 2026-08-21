import { useMemo } from 'react';
import { pickPartPracticeExam } from './partPracticeParts';
import { usePartPracticeListQuery, useStudentExamTakeQuery } from './studentExamQuery';

// Tra đề PART_PRACTICE đúng (skill, part) rồi tải nội dung đã ẩn đáp án.
// Trả examId để nộp lên POST /exams/:id/submit (BE tăng student_progress theo part).
export const usePartPracticeExam = (skillId: number, partNumber: number) => {
  const { data: listRes, isLoading: isListLoading } = usePartPracticeListQuery(skillId);

  // Dùng CHUNG bộ chọn đề với card tiến độ & ô tổng quan, nếu không thì trang luyện nộp vào đề này
  // còn % lại hiển thị của đề khác.
  const examId = useMemo(
    () => pickPartPracticeExam(listRes?.data, partNumber)?.id ?? null,
    [listRes, partNumber]
  );

  const { data: examDetail, isLoading: isDetailLoading } = useStudentExamTakeQuery(examId);

  return {
    examId,
    examDetail: examDetail ?? null,
    isLoading: isListLoading || (examId != null && isDetailLoading),
  };
};
