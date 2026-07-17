import axiosInstance from '@/configs/axios';

export type TrendType = 'up' | 'down' | 'neutral';

export interface KpiValue {
  value: number;
  trendPercent?: number;
  trendType?: TrendType;
}

export interface DashboardSummary {
  kpis: {
    totalStudents: KpiValue;
    totalQuestions: KpiValue;
    dailyActivity: KpiValue;
    totalExams: KpiValue;
    completedTests: KpiValue;
    pendingGrading: KpiValue;
  };
  questionStats: {
    total: number;
    skills: { skillId: number; name: string; count: number }[];
  };
  examCounts: {
    total: number;
    types: { type: 'PART_PRACTICE' | 'SKILL_FULL_SET' | 'MOCK_TEST'; name: string; count: number }[];
  };
  skillDistribution: { skillId: number; name: string; value: number }[];
}

export interface ActivitySeriesPoint {
  date: string;
  label: string;
  grammar: number;
  reading: number;
  listening: number;
  speaking: number;
  writing: number;
}

export interface DashboardActivity {
  range: { from: string; to: string; bucket: 'day' | 'week' };
  series: ActivitySeriesPoint[];
}

export interface RecentStudent {
  id: number;
  fullName: string;
  email: string;
  registeredAt: string;
  status: 'ACTIVE' | 'LOCKED';
}

export interface RecentTest {
  resultId: number;
  studentName: string;
  skillId: number | null;
  skillName: string;
  score: number;
  maxScore: number;
  status: 'GRADED';
  durationSeconds: number;
}

export type ActivityType =
  | 'EXAM_COMPLETED'
  | 'QUESTION_ADDED'
  | 'EXAM_CREATED'
  | 'NOTIFICATION_SENT'
  | 'STREAK_MILESTONE';

export interface DashboardActivityItem {
  id: number;
  type: ActivityType;
  message: string;
  createdAt: string;
}

export const dashboardApi = {
  getSummary: () =>
    axiosInstance.get<DashboardSummary, DashboardSummary>('/admin/dashboard/summary'),

  getActivity: (days = 30, bucket: 'day' | 'week' = 'day') =>
    axiosInstance.get<DashboardActivity, DashboardActivity>('/admin/dashboard/activity', {
      params: { days, bucket },
    }),

  getRecentStudents: (limit = 5) =>
    axiosInstance.get<RecentStudent[], RecentStudent[]>('/admin/dashboard/recent-students', {
      params: { limit },
    }),

  getRecentTests: (limit = 5) =>
    axiosInstance.get<RecentTest[], RecentTest[]>('/admin/dashboard/recent-tests', {
      params: { limit },
    }),

  getActivities: (limit = 5) =>
    axiosInstance.get<DashboardActivityItem[], DashboardActivityItem[]>('/admin/dashboard/activities', {
      params: { limit },
    }),
};
