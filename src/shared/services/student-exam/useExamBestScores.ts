import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { studentExamApi } from './studentExamApi';
import { ATTEMPTS_KEY } from './studentExamQuery';

/**
 * Điểm tốt nhất của các đề đã nộp, lấy hoàn toàn từ attempt trong database.
 * Dùng examId làm khóa để các landing page không còn phụ thuộc localStorage.
 */
export const useExamBestScores = () => {
  const query = useQuery({
    queryKey: [...ATTEMPTS_KEY, 'best-scores', 'SKILL_FULL_SET'],
    queryFn: async () => {
      const first = await studentExamApi.myAttempts({ type: 'SKILL_FULL_SET', page: 1, limit: 100 });
      const totalPages = first.metaData?.totalPage ?? 1;
      if (totalPages <= 1) return first.result;
      const remaining = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, index) =>
          studentExamApi.myAttempts({ type: 'SKILL_FULL_SET', page: index + 2, limit: 100 }),
        ),
      );
      return first.result.concat(...remaining.map((page) => page.result));
    },
  });

  const scoreByExamId = useMemo(() => {
    const result: Record<string, number> = {};
    for (const attempt of query.data ?? []) {
      const examId = attempt.examId ?? attempt.examSetId ?? attempt.exam?.id;
      if (examId == null || attempt.totalScore == null) continue;
      const key = String(examId);
      result[key] = Math.max(result[key] ?? 0, attempt.totalScore);
    }
    return result;
  }, [query.data]);

  return { scoreByExamId, isLoading: query.isLoading };
};
