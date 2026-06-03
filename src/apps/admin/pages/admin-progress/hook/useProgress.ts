import { useState } from 'react';
import { timelineProgress, correctVsIncorrect, leaderboard, skillGauges } from '../services/mockData';

export const useProgress = () => {
  const [filterType, setFilterType] = useState('all');

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
    skillGauges,
    getGaugeData,
  };
};
