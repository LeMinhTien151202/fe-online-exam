import { useMemo, useState } from 'react';
import { timelineProgress, correctVsIncorrect, skillGauges } from '../services/mockData';
import { useUsersQuery } from '../../admin-users/services/userQuery';

export const useProgress = () => {
  const [filterType, setFilterType] = useState('all');
  const usersQuery = useUsersQuery({ page: 1, limit: 500, role: 'STUDENT' });

  // Chỉ streak là dữ liệu thật ở bảng này; các thống kê chưa có API được hiển thị bằng dấu —.
  const leaderboard = useMemo(() => {
    const users = [...(usersQuery.data?.data ?? [])];
    users.sort((left, right) => {
      const currentDiff = (right.streak?.currentStreak ?? 0) - (left.streak?.currentStreak ?? 0);
      if (currentDiff !== 0) return currentDiff;
      const longestDiff = (right.streak?.longestStreak ?? 0) - (left.streak?.longestStreak ?? 0);
      if (longestDiff !== 0) return longestDiff;
      const rightActivity = right.streak?.lastActivity ? Date.parse(right.streak.lastActivity) : 0;
      const leftActivity = left.streak?.lastActivity ? Date.parse(left.streak.lastActivity) : 0;
      if (rightActivity !== leftActivity) return rightActivity - leftActivity;
      return left.id - right.id;
    });
    return users.map((user, index) => ({
      key: user.id,
      rank: index + 1,
      name: user.profile?.fullName || user.email,
      progress: null as number | null,
      streak: user.streak?.currentStreak ?? 0,
      avgScore: null as string | null,
      level: null as string | null,
    }));
  }, [usersQuery.data?.data]);

  const getGaugeData = (value: number, color: string) => [
    { name: 'Value', value, fill: color },
    { name: 'Placeholder', value: 100, fill: '#f1f5f9' },
  ];

  return {
    filterType,
    setFilterType,
    timelineProgress,
    correctVsIncorrect,
    leaderboard,
    leaderboardLoading: usersQuery.isLoading,
    skillGauges,
    getGaugeData,
  };
};
