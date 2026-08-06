import React from 'react';
import { useMyStreakQuery } from '@/shared/services/student-exam';

interface LearningStreakValueProps {
  suffix?: string;
}

/** Giá trị streak dùng chung; không thay lỗi API bằng một con số giả. */
export const LearningStreakValue: React.FC<LearningStreakValueProps> = ({ suffix = 'ngày' }) => {
  const { data, isPending, isError } = useMyStreakQuery();

  if (isPending || isError) return <>—</>;
  return <>{data.currentStreak} {suffix}</>;
};
