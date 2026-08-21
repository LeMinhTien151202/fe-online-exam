import { useMemo } from 'react';
import { ALL_PART_PRACTICE_PARTS, pickPartPracticeExam, SKILL_ID } from './partPracticeParts';
import { normalizeExamProgress, useMyExamProgressQuery, usePartPracticeListQuery } from './studentExamQuery';
import { IStudentExamSummary } from './types';

/**
 * "Tiến độ Tổng quan" ngoài trang chủ — CHỈ tính phần luyện theo phần (PART_PRACTICE).
 *
 * Cách tính: với MỖI phần luyện (18 phần của 5 kỹ năng), lấy đúng đề mà trang luyện của phần đó
 * sẽ mở rồi tra % của đề đó trong `GET /progress/exams/me`; phần chưa làm tính 0%. Tổng quan là
 * TRUNG BÌNH các %.
 *
 * Vì sao không cộng dồn `GET /progress/me` như trước:
 *  - `student_progress` chỉ có dòng cho phần đã từng nộp, nên mẫu số cũ chỉ gồm các phần đã đụng
 *    tới. Làm 1/9 bộ Reading P1 và chưa đụng gì khác ra ngay 11% thay vì ~0.6%.
 *  - Câu truy vấn tổng quan GROUP BY (skill, part) rồi SUM qua MỌI đề, nên một phần có nhiều đề
 *    sẽ cộng cả những đề mà trang luyện không hề mở -> lệch hẳn với % trên thẻ phần.
 *  - Cộng dồn answered/total còn khiến phần nhiều câu (vd 195 câu) nuốt trọn phần ít câu (9 câu);
 *    trung bình theo phần mới khớp với những gì học viên nhìn thấy trên trang kỹ năng.
 */
export const useOverallPartPracticeProgress = (enabled: boolean = true) => {
  // 5 kỹ năng = 5 truy vấn danh sách đề, dùng chung cache với các trang kỹ năng.
  const grammar = usePartPracticeListQuery(enabled ? SKILL_ID.GRAMMAR : null);
  const listening = usePartPracticeListQuery(enabled ? SKILL_ID.LISTENING : null);
  const reading = usePartPracticeListQuery(enabled ? SKILL_ID.READING : null);
  const writing = usePartPracticeListQuery(enabled ? SKILL_ID.WRITING : null);
  const speaking = usePartPracticeListQuery(enabled ? SKILL_ID.SPEAKING : null);
  const { data: progressRaw, isPending: isProgressPending } = useMyExamProgressQuery(enabled);

  const listBySkill = useMemo(
    () =>
      new Map<number, IStudentExamSummary[] | undefined>([
        [SKILL_ID.GRAMMAR, grammar.data?.data],
        [SKILL_ID.LISTENING, listening.data?.data],
        [SKILL_ID.READING, reading.data?.data],
        [SKILL_ID.WRITING, writing.data?.data],
        [SKILL_ID.SPEAKING, speaking.data?.data],
      ]),
    [grammar.data, listening.data, reading.data, writing.data, speaking.data]
  );

  const percentByExamId = useMemo(() => normalizeExamProgress(progressRaw), [progressRaw]);

  const { percent, partsCounted } = useMemo(() => {
    const percents: number[] = [];
    ALL_PART_PRACTICE_PARTS.forEach(({ skillId, apiPart }) => {
      const exam = pickPartPracticeExam(listBySkill.get(skillId), apiPart);
      // Phần chưa có đề nào thì không có gì để luyện -> không đưa vào mẫu số.
      if (!exam) return;
      percents.push(percentByExamId.get(exam.id) ?? 0);
    });
    const sum = percents.reduce((total, value) => total + value, 0);
    return {
      percent: percents.length > 0 ? Math.round(sum / percents.length) : 0,
      partsCounted: percents.length,
    };
  }, [listBySkill, percentByExamId]);

  const isPending =
    isProgressPending
    || grammar.isPending
    || listening.isPending
    || reading.isPending
    || writing.isPending
    || speaking.isPending;

  return { percent, partsCounted, isPending: enabled && isPending };
};
