import { useMemo } from 'react';
import {
  useActivitiesQuery,
  useActivityQuery,
  useRecentStudentsQuery,
  useRecentTestsQuery,
  useSummaryQuery,
} from '../services/dashboardQuery';
import type { ActivityType, KpiValue } from '../services/dashboardApi';
import { MOCK_ACTIVITY_SERIES, MOCK_KPIS, MOCK_SKILL_DISTRIBUTION } from '../services/mockFallback';

// Màu biểu đồ do FE quyết định (BE không trả color) — map theo skillId
export const SKILL_COLORS: Record<number, string> = {
  1: '#1a365d', // Grammar
  2: '#8b5cf6', // Listening
  3: '#0ea5e9', // Reading
  4: '#16a34a', // Writing
  5: '#f97316', // Speaking
};

const TIMELINE_COLOR: Record<ActivityType, string> = {
  EXAM_COMPLETED: 'green',
  QUESTION_ADDED: 'blue',
  EXAM_CREATED: 'cyan',
  NOTIFICATION_SENT: 'orange',
  STREAK_MILESTONE: 'green',
};

interface KpiDisplay {
  value: number;
  trend: string;
  trendType: 'up' | 'down' | 'neutral';
  trendLabel: string;
}

const toKpiDisplay = (kpi: KpiValue | undefined, label: string, neutralText = '—'): KpiDisplay => ({
  value: kpi?.value ?? 0,
  trend: kpi?.trendPercent != null ? `${kpi.trendPercent}%` : neutralText,
  trendType: kpi?.trendType ?? 'neutral',
  trendLabel: label,
});

const timeAgo = (iso: string): string => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'vừa xong';
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
};

export const useDashboard = () => {
  const summaryQuery = useSummaryQuery();
  const activityQuery = useActivityQuery(30, 'day');
  const recentStudentsQuery = useRecentStudentsQuery(5);
  const recentTestsQuery = useRecentTestsQuery(5);
  const activitiesQuery = useActivitiesQuery(5);

  const summary = summaryQuery.data;

  const kpis = useMemo(() => {
    // Fallback về mock khi BE không trả summary
    const k = summary?.kpis ?? MOCK_KPIS;
    return {
      totalStudents: toKpiDisplay(k?.totalStudents, 'so với hôm qua'),
      totalQuestions: toKpiDisplay(k?.totalQuestions, 'Xem chi tiết bên dưới'),
      dailyActivity: toKpiDisplay(k?.dailyActivity, 'so với hôm qua'),
      totalExams: toKpiDisplay(k?.totalExams, 'Xem chi tiết bên dưới'),
      completedTests: toKpiDisplay(k?.completedTests, 'so với hôm qua'),
    };
  }, [summary]);

  const questionStats = summary?.questionStats ?? { total: 0, skills: [] };
  const examCounts = summary?.examCounts ?? { total: 0, types: [] };

  const skillDistribution = useMemo(() => {
    // Fallback về mock khi BE chưa có dữ liệu phân bổ kỹ năng
    const source = summary?.skillDistribution?.length ? summary.skillDistribution : MOCK_SKILL_DISTRIBUTION;
    return source.map((s) => ({
      ...s,
      color: SKILL_COLORS[s.skillId] ?? '#94a3b8',
    }));
  }, [summary]);

  // Fallback về mock khi BE chưa có chuỗi hoạt động
  const activitySeries = activityQuery.data?.series ?? [];
  const activityData = activitySeries.length ? activitySeries : MOCK_ACTIVITY_SERIES;

  const timelineItems = useMemo(
    () =>
      (activitiesQuery.data ?? []).map((item) => ({
        color: TIMELINE_COLOR[item.type] ?? 'gray',
        children: `${item.message} (${timeAgo(item.createdAt)})`,
      })),
    [activitiesQuery.data],
  );

  return {
    kpis,
    questionStats,
    examCounts,
    skillDistribution,
    activityData,
    recentStudents: recentStudentsQuery.data ?? [],
    recentTests: recentTestsQuery.data ?? [],
    timelineItems,
    isSummaryLoading: summaryQuery.isLoading,
    isActivityLoading: activityQuery.isLoading,
    isStudentsLoading: recentStudentsQuery.isLoading,
    isTestsLoading: recentTestsQuery.isLoading,
    isActivitiesLoading: activitiesQuery.isLoading,
  };
};
