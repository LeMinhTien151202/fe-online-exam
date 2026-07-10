import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { studentExamApi } from './studentExamApi';
import { IAttemptFilter, ISubmitExamPayload } from './types';

export const ATTEMPTS_KEY = ['student', 'attempts'];
export const PART_PRACTICE_KEY = ['student', 'part-practice'];
export const PROGRESS_KEY = ['student', 'progress'];
export const EXAM_PROGRESS_KEY = ['student', 'exam-progress'];

// % hoàn thành theo TỪNG ĐỀ. Chuẩn hoá về Map examId -> percent (0-100).
// Chấp nhận camelCase/snake_case + mảng hoặc bọc { data: [...] }; nếu thiếu percent thì suy từ answered/total.
export const normalizeExamProgress = (raw: unknown): Map<number, number> => {
  const map = new Map<number, number>();
  const rows = Array.isArray(raw)
    ? raw
    : Array.isArray((raw as { data?: unknown })?.data)
      ? (raw as { data: unknown[] }).data
      : [];
  (rows as Record<string, unknown>[]).forEach((row) => {
    const examId = row.examId ?? row.exam_id;
    if (examId == null) return;
    const answered = Number(row.answered ?? 0);
    const total = Number(row.total ?? 0);
    const percentRaw = row.percent;
    const percent =
      percentRaw != null ? Number(percentRaw) : total > 0 ? Math.round((answered / total) * 100) : 0;
    map.set(Number(examId), Number.isFinite(percent) ? percent : 0);
  });
  return map;
};

// Tiến độ tích lũy (skill, part) — dashboard. Map `${skillId}-${partNumber}` -> { answered, total }.
export const normalizeProgress = (raw: unknown): Map<string, { answered: number; total: number }> => {
  const map = new Map<string, { answered: number; total: number }>();
  const rows = Array.isArray(raw)
    ? raw
    : Array.isArray((raw as { data?: unknown })?.data)
      ? (raw as { data: unknown[] }).data
      : [];
  (rows as Record<string, unknown>[]).forEach((row) => {
    const skillId = row.skillId ?? row.skill_id;
    const partNumber = row.partNumber ?? row.part_number ?? row.part;
    const answered = Number(row.answered ?? row.questionsAnswered ?? row.questions_answered ?? 0);
    const total = Number(row.total ?? 0);
    if (skillId != null && partNumber != null) {
      map.set(`${skillId}-${partNumber}`, { answered: answered || 0, total: total || 0 });
    }
  });
  return map;
};

export const useMyExamProgressQuery = () => {
  return useQuery({
    queryKey: EXAM_PROGRESS_KEY,
    queryFn: () => studentExamApi.myExamProgress(),
  });
};

export const useMyProgressQuery = () => {
  return useQuery({
    queryKey: PROGRESS_KEY,
    queryFn: () => studentExamApi.myProgress(),
  });
};

// Tra đề PART_PRACTICE theo kỹ năng (để suy examId theo partNumber).
export const usePartPracticeListQuery = (skillId: number | null) => {
  return useQuery({
    queryKey: [...PART_PRACTICE_KEY, 'list', skillId],
    queryFn: () => studentExamApi.listPartPractice(skillId as number),
    enabled: skillId != null,
  });
};

// Chi tiết 1 đề (kèm đáp án) để build câu hỏi + chấm cục bộ.
export const useExamSetDetailQuery = (id: number | null) => {
  return useQuery({
    queryKey: [...PART_PRACTICE_KEY, 'detail', id],
    queryFn: () => studentExamApi.examSetDetail(id as number),
    enabled: id != null,
  });
};

// Nộp bài. onSuccess: làm mới lịch sử attempt + tập đã-làm để dashboard/landing cập nhật.
export const useSubmitExamMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ examId, payload }: { examId: number; payload: ISubmitExamPayload }) =>
      studentExamApi.submit(examId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ATTEMPTS_KEY });
      // Tiến độ đổi sau khi nộp -> làm mới cả % theo đề (card) lẫn tích lũy (dashboard).
      queryClient.invalidateQueries({ queryKey: EXAM_PROGRESS_KEY });
      queryClient.invalidateQueries({ queryKey: PROGRESS_KEY });
    },
  });
};

export const useMyAttemptsQuery = (filter: IAttemptFilter = {}) => {
  return useQuery({
    queryKey: [...ATTEMPTS_KEY, filter],
    queryFn: () => studentExamApi.myAttempts(filter),
  });
};

export const useMyDoneExamsQuery = () => {
  return useQuery({
    queryKey: [...ATTEMPTS_KEY, 'done'],
    queryFn: () => studentExamApi.myDone(),
  });
};
