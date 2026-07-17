import type { ActivitySeriesPoint, DashboardSummary } from './dashboardApi';

/**
 * Dữ liệu mock dự phòng cho 2 khối "Học viên hoạt động 30 ngày qua" và
 * "Phân bổ kỹ năng ôn luyện" — chỉ dùng khi API trả về rỗng (BE chưa đủ dữ liệu).
 * Khi BE có dữ liệu thật, hook sẽ tự động ưu tiên dữ liệu thật.
 */

// Sinh 30 mốc ngày gần nhất với xu hướng tăng nhẹ + dao động ổn định (không random)
const buildMockActivity = (): ActivitySeriesPoint[] => {
  const points: ActivitySeriesPoint[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dayIndex = 30 - i; // 1..30
    const wave = Math.sin(dayIndex / 3) * 0.15 + 1; // dao động nhẹ
    const growth = 0.7 + (dayIndex / 30) * 0.6; // tăng dần theo thời gian

    points.push({
      date: d.toISOString().slice(0, 10),
      label: `Ngày ${dayIndex}`,
      grammar: Math.round(40 * growth * wave),
      reading: Math.round(26 * growth * wave),
      listening: Math.round(30 * growth * wave),
      speaking: Math.round(14 * growth * wave),
      writing: Math.round(18 * growth * wave),
    });
  }

  return points;
};

export const MOCK_ACTIVITY_SERIES: ActivitySeriesPoint[] = buildMockActivity();

// Mock 5 thẻ KPI — chỉ dùng khi API summary không trả về (undefined)
export const MOCK_KPIS: DashboardSummary['kpis'] = {
  totalStudents: { value: 128, trendPercent: 12.5, trendType: 'up' },
  totalQuestions: { value: 1250, trendType: 'neutral' },
  dailyActivity: { value: 34, trendPercent: 6.2, trendType: 'up' },
  totalExams: { value: 45, trendType: 'neutral' },
  completedTests: { value: 328, trendPercent: 8.0, trendType: 'up' },
  pendingGrading: { value: 0 },
};

export const MOCK_SKILL_DISTRIBUTION = [
  { skillId: 1, name: 'Grammar', value: 35 },
  { skillId: 3, name: 'Reading', value: 25 },
  { skillId: 2, name: 'Listening', value: 20 },
  { skillId: 5, name: 'Speaking', value: 10 },
  { skillId: 4, name: 'Writing', value: 10 },
];
