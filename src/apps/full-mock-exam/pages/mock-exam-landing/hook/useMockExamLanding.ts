import { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { IAttemptItem, useMyAttemptsQuery } from '@/shared/services/student-exam';
import { useMockExamSetsQuery } from '../../../services/mockExamQuery';

export type MockExamTab = 'all' | 'new' | 'taken';

// Mục tiêu mặc định: đạt CEFR C (85/100 điểm tổng)
export const TARGET_SCORE = 85;

// BE đổi examSetId -> examId (+ exam{}); đọc linh hoạt để tương thích ngược.
const attemptExamId = (att: IAttemptItem) => att.examSetId ?? att.examId ?? att.exam?.id;

export const useMockExamLanding = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<MockExamTab>('all');

  const { data: examRes, isLoading } = useMockExamSetsQuery();
  const mockExams = useMemo(() => examRes?.data ?? [], [examRes]);

  const { data: attemptsRes } = useMyAttemptsQuery({ type: 'MOCK_TEST' });
  const attempts = useMemo(() => attemptsRes?.result ?? [], [attemptsRes]);

  // Các đề đã từng nộp (kể cả attempt chưa có điểm)
  const takenExamIds = useMemo(() => {
    const set = new Set<number>();
    attempts.forEach((att) => {
      const id = attemptExamId(att);
      if (id != null) set.add(id);
    });
    return set;
  }, [attempts]);

  // Điểm lần thi GẦN NHẤT theo từng đề (duyệt tăng dần, lần sau ghi đè lần trước)
  const latestScores = useMemo(() => {
    const map = new Map<number, number>();
    [...attempts]
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .forEach((att) => {
        const id = attemptExamId(att);
        if (id != null && att.totalScore != null) map.set(id, att.totalScore);
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
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 6)
        .map((att) => {
          const id = attemptExamId(att);
          return {
            id: att.id,
            date: new Date(att.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
            name: att.exam?.title ?? (id != null ? titleById.get(id) : undefined) ?? `Đề #${id ?? '?'}`,
            score: att.totalScore,
            cefr: att.overallCefr ?? null, // CEFR thật từ BE (null nếu còn chờ chấm tay)
          };
        }),
    [attempts, titleById],
  );

  const averageScore = attemptsRes?.averageMockScore ?? null;
  // "Trình độ hiện tại" = CEFR tổng của lần thi gần nhất có xếp loại.
  const cefrLevel = useMemo(() => {
    const latest = [...attempts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
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
