import { useMemo } from 'react';
import { normalizeExamProgress, usePartPracticeListQuery, useMyExamProgressQuery } from './studentExamQuery';

// Ánh xạ phần hiển thị (feId) -> partNumber thật trên API của kỹ năng.
export interface PartMapEntry {
  feId: string;
  apiPart: number;
}

/**
 * Tiến độ luyện theo phần lấy từ server theo mô hình mới (FE_PROGRESS.md mục 1 & 3):
 *   % gắn theo TỪNG ĐỀ qua GET /progress/exams/me — BE tự tính percent = round(answered/total*100),
 *   total luôn theo đề hiện tại nên admin thêm câu -> % tự giảm; đề mới (id khác) chưa có dòng -> 0%.
 *
 * FE chỉ cần: chọn đúng đề PART_PRACTICE của (skill, part) rồi tra percent theo examId.
 * (Không còn tự đếm câu hay tự cap 100% ở FE — BE lo hết.)
 */
export const usePartPracticeProgress = (skillId: number, partMap: PartMapEntry[]) => {
  const { data: listRes, isLoading: isListLoading } = usePartPracticeListQuery(skillId);
  const { data: progressRaw, isLoading: isProgressLoading } = useMyExamProgressQuery();

  const percentByExamId = useMemo(() => normalizeExamProgress(progressRaw), [progressRaw]);

  // examId của đề PART_PRACTICE cho mỗi apiPart — CÙNG quy tắc chọn với usePartPracticeExam
  // (ưu tiên đề active, rồi tới đề mới nhất) để card khớp đúng đề mà trang luyện đang nộp.
  const examIdByPart = useMemo(() => {
    const items = listRes?.data ?? [];
    const map = new Map<number, number>();
    partMap.forEach(({ apiPart }) => {
      const match = items
        .filter((item) => item.partNumber === apiPart)
        .sort((a, b) => {
          if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
          return b.createdAt > a.createdAt ? 1 : -1;
        })[0];
      if (match) map.set(apiPart, match.id);
    });
    return map;
  }, [listRes, partMap]);

  const progress = useMemo(() => {
    const result: Record<string, number> = {};
    partMap.forEach(({ feId, apiPart }) => {
      const examId = examIdByPart.get(apiPart);
      result[feId] = examId != null ? percentByExamId.get(examId) ?? 0 : 0;
    });
    return result;
  }, [partMap, examIdByPart, percentByExamId]);

  return { progress, isLoading: isListLoading || isProgressLoading };
};
