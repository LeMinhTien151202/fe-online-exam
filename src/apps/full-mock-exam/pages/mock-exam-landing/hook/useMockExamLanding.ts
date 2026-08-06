import { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { IAttemptItem, useMyAttemptsQuery } from '@/shared/services/student-exam';
import {
  mockTotalScaled,
  MOCK_MAX_SCORE,
  DEFAULT_TARGET_CEFR,
  cefrTargetTotal,
} from '@/shared/utils/cefrScale';
import { useMockExamSetsQuery } from '../../../services/mockExamQuery';

export type MockExamTab = 'all' | 'new' | 'taken';

// Thang điểm mock Aptis: 4 kỹ năng × 50 = 0–200 (xem cefrScale.mockTotalScaled).
export const MAX_SCORE = MOCK_MAX_SCORE;
// Mục tiêu trình độ mặc định của nền tảng = B2 (đồng bộ Home/AuthLayout/Sidebar).
export const TARGET_LEVEL = DEFAULT_TARGET_CEFR;
// Điểm cần đạt = ngưỡng điểm tối thiểu để đạt B2 trên cả 4 kỹ năng (tính từ bảng CEFR) = 153/200.
export const TARGET_SCORE = cefrTargetTotal(TARGET_LEVEL);

// Điểm tổng 0–200 của một attempt từ snapshot điểm từng kỹ năng (skillCefr). null nếu chưa có snapshot.
const attemptTotal = (att: IAttemptItem): number | null => mockTotalScaled(att.skillCefr);

// BE đổi examSetId -> examId (+ exam{}); đọc linh hoạt để tương thích ngược.
const attemptExamId = (att: IAttemptItem) => att.examSetId ?? att.examId ?? att.exam?.id;

// Thời điểm nộp: attempt có thể không có `createdAt` -> fallback finishedAt/startedAt (tránh "Invalid Date").
const attemptTime = (att: IAttemptItem) =>
  new Date(att.createdAt ?? att.finishedAt ?? att.startedAt ?? 0).getTime();

// Chỉ giữ attempt thực sự là MOCK_TEST — BE hiện không lọc đúng type nên trả cả SKILL_FULL_SET (vd "Speaking Test 10").
const isMockAttempt = (att: IAttemptItem) => (att.type ?? att.exam?.type) === 'MOCK_TEST';

export const useMockExamLanding = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<MockExamTab>('all');

  const { data: examRes, isLoading } = useMockExamSetsQuery();
  const mockExams = useMemo(() => examRes?.data ?? [], [examRes]);

  const { data: attemptsRes } = useMyAttemptsQuery({ type: 'MOCK_TEST' });
  const attempts = useMemo(
    () => (attemptsRes?.result ?? []).filter(isMockAttempt),
    [attemptsRes],
  );

  // Các đề đã từng nộp (kể cả attempt chưa có điểm)
  const takenExamIds = useMemo(() => {
    const set = new Set<number>();
    attempts.forEach((att) => {
      const id = attemptExamId(att);
      if (id != null) set.add(id);
    });
    return set;
  }, [attempts]);

  // Điểm lần thi GẦN NHẤT theo từng đề (duyệt tăng dần, lần sau ghi đè lần trước) — thang 0–200.
  const latestScores = useMemo(() => {
    const map = new Map<number, number>();
    [...attempts]
      .sort((a, b) => attemptTime(a) - attemptTime(b))
      .forEach((att) => {
        const id = attemptExamId(att);
        const total = attemptTotal(att);
        if (id != null && total != null) map.set(id, total);
      });
    return map;
  }, [attempts]);

  const filteredExams = useMemo(() => {
    if (activeTab === 'new') return mockExams.filter((exam) => !takenExamIds.has(exam.id));
    if (activeTab === 'taken') return mockExams.filter((exam) => takenExamIds.has(exam.id));
    return mockExams;
  }, [mockExams, activeTab, takenExamIds]);

  // Lịch sử thi gần nhất (tối đa 6 dòng), gắn tên đề từ danh sách hoặc `exam{}` của attempt
  const titleById = useMemo(() => new Map(mockExams.map((exam) => [exam.id, exam.title])), [mockExams]);
  const history = useMemo(
    () =>
      [...attempts]
        .sort((a, b) => attemptTime(b) - attemptTime(a))
        .slice(0, 6)
        .map((att) => {
          const id = attemptExamId(att);
          const ts = attemptTime(att);
          return {
            id: att.id,
            date: ts ? new Date(ts).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) : '',
            name: att.exam?.title ?? (id != null ? titleById.get(id) : undefined) ?? `Đề #${id ?? '?'}`,
            score: attemptTotal(att), // 0–200 từ snapshot skillCefr
            cefr: att.overallCefr ?? null, // CEFR thật từ BE (null nếu còn chờ chấm tay)
          };
        }),
    [attempts, titleById],
  );

  // Điểm trung bình 0–200: trung bình tổng scaled các lần thi ĐÃ có snapshot điểm (bỏ lần chưa chấm xong).
  const averageScore = useMemo(() => {
    const totals = attempts.map(attemptTotal).filter((t): t is number => t != null);
    if (totals.length === 0) return null;
    return totals.reduce((a, b) => a + b, 0) / totals.length;
  }, [attempts]);
  // "Trình độ hiện tại" = CEFR tổng của lần thi gần nhất có xếp loại.
  const cefrLevel = useMemo(() => {
    const latest = [...attempts]
      .sort((a, b) => attemptTime(b) - attemptTime(a))
      .find((att) => att.overallCefr);
    return latest?.overallCefr ?? null;
  }, [attempts]);
  const targetProgress =
    averageScore != null ? Math.min(100, Math.round((averageScore / TARGET_SCORE) * 100)) : 0;

  const handleStartExam = (id: number) => {
    navigate({ to: '/mock-exam/main/$testId', params: { testId: String(id) } });
  };

  return {
    isLoading,
    activeTab,
    setActiveTab,
    filteredExams,
    takenExamIds,
    latestScores,
    history,
    averageScore,
    cefrLevel,
    targetProgress,
    handleStartExam,
  };
};
