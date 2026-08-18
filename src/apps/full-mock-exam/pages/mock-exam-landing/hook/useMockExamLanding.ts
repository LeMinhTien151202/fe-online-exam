import { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { IAttemptItem, useMyAttemptsQuery, useMyDoneExamsQuery } from '@/shared/services/student-exam';
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
export const HISTORY_PAGE_SIZE = 6;

// Điểm tổng 0–200 của một attempt từ snapshot điểm từng kỹ năng (skillCefr). null nếu chưa có snapshot.
const attemptTotal = (att: IAttemptItem): number | null => mockTotalScaled(att.skillCefr);

// BE đổi examSetId -> examId (+ exam{}); đọc linh hoạt để tương thích ngược.
const attemptExamId = (att: IAttemptItem) => att.examSetId ?? att.examId ?? att.exam?.id;

// Thời điểm nộp: attempt có thể không có `createdAt` -> fallback finishedAt/startedAt (tránh "Invalid Date").
const attemptTime = (att: IAttemptItem) =>
  new Date(att.createdAt ?? att.finishedAt ?? att.startedAt ?? 0).getTime();

// Giữ thêm lớp lọc tương thích nếu FE tạm thời chạy với backend cũ chưa hỗ trợ query `type`.
const isMockAttempt = (att: IAttemptItem) => (att.type ?? att.exam?.type) === 'MOCK_TEST';

export const useMockExamLanding = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<MockExamTab>('all');
  const [historyPage, setHistoryPage] = useState(1);

  const { data: examRes, isLoading } = useMockExamSetsQuery();
  const mockExams = useMemo(() => examRes?.data ?? [], [examRes]);

  const { data: attemptsRes } = useMyAttemptsQuery({
    type: 'MOCK_TEST',
    page: historyPage,
    limit: HISTORY_PAGE_SIZE,
  });
  const attempts = useMemo(
    () => (attemptsRes?.result ?? []).filter(isMockAttempt),
    [attemptsRes],
  );
  const { data: doneExamIds = [] } = useMyDoneExamsQuery();

  // Các đề đã từng nộp (kể cả attempt chưa có điểm)
  const takenExamIds = useMemo(() => {
    const set = new Set<number>();
    doneExamIds.forEach((id) => set.add(id));
    return set;
  }, [doneExamIds]);

  const filteredExams = useMemo(() => {
    if (activeTab === 'new') return mockExams.filter((exam) => !takenExamIds.has(exam.id));
    if (activeTab === 'taken') return mockExams.filter((exam) => takenExamIds.has(exam.id));
    return mockExams;
  }, [mockExams, activeTab, takenExamIds]);

  // Một trang lịch sử từ backend, mới nhất trước; UI hiển thị 6 dòng/trang.
  const titleById = useMemo(() => new Map(mockExams.map((exam) => [exam.id, exam.title])), [mockExams]);
  const history = useMemo(
    () =>
      [...attempts]
        .sort((a, b) => attemptTime(b) - attemptTime(a))
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
  const averageScore = attemptsRes?.averageMockScore ?? null;
  // "Trình độ hiện tại" = CEFR tổng của lần thi gần nhất có xếp loại.
  const cefrLevel = attemptsRes?.latestOverallCefr ?? null;
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
    history,
    historyPage,
    historyTotal: attemptsRes?.metaData?.total ?? history.length,
    setHistoryPage,
    averageScore,
    cefrLevel,
    targetProgress,
    handleStartExam,
  };
};
