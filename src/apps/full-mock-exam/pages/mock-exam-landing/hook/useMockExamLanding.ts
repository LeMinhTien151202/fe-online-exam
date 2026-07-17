import { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useMyAttemptsQuery } from '@/shared/services/student-exam';
import { useMockExamSetsQuery } from '../../../services/mockExamQuery';

export type MockExamTab = 'all' | 'new' | 'taken';

// Ngưỡng CEFR ước lượng theo thang điểm 0-100 của BE (score tổng khi nộp MOCK_TEST)
const cefrFromScore = (score: number | null): string | null => {
  if (score == null) return null;
  if (score >= 85) return 'C';
  if (score >= 70) return 'B2';
  if (score >= 55) return 'B1';
  if (score >= 40) return 'A2';
  return 'A1';
};

// Mục tiêu mặc định: đạt CEFR C (85/100)
export const TARGET_SCORE = 85;

export const useMockExamLanding = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<MockExamTab>('all');

  const { data: examRes, isLoading } = useMockExamSetsQuery();
  const mockExams = useMemo(() => examRes?.data ?? [], [examRes]);

  const { data: attemptsRes } = useMyAttemptsQuery({ type: 'MOCK_TEST' });
  const attempts = useMemo(() => attemptsRes?.result ?? [], [attemptsRes]);

  // Các đề đã từng nộp (kể cả attempt chưa có điểm)
  const takenExamIds = useMemo(() => new Set(attempts.map((att) => att.examSetId)), [attempts]);

  // Điểm lần thi GẦN NHẤT theo từng đề (duyệt tăng dần, lần sau ghi đè lần trước)
  const latestScores = useMemo(() => {
    const map = new Map<number, number>();
    [...attempts]
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .forEach((att) => {
        if (att.totalScore != null) map.set(att.examSetId, att.totalScore);
      });
    return map;
  }, [attempts]);

  const filteredExams = useMemo(() => {
    if (activeTab === 'new') return mockExams.filter((exam) => !takenExamIds.has(exam.id));
    if (activeTab === 'taken') return mockExams.filter((exam) => takenExamIds.has(exam.id));
    return mockExams;
  }, [mockExams, activeTab, takenExamIds]);

  // Lịch sử thi gần nhất (tối đa 6 dòng), gắn tên đề từ danh sách
  const titleById = useMemo(() => new Map(mockExams.map((exam) => [exam.id, exam.title])), [mockExams]);
  const history = useMemo(
    () =>
      [...attempts]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 6)
        .map((att) => ({
          id: att.id,
          date: new Date(att.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
          name: titleById.get(att.examSetId) ?? `Đề #${att.examSetId}`,
          score: att.totalScore,
          cefr: cefrFromScore(att.totalScore),
        })),
    [attempts, titleById],
  );

  const averageScore = attemptsRes?.averageMockScore ?? null;
  const cefrLevel = cefrFromScore(averageScore);
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
