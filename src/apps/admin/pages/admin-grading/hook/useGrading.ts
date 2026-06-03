import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { initialGradingResults } from '../services/mockData';

export const useGrading = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [results] = useState(initialGradingResults);

  const handleGrade = (key: string) => {
    navigate({ to: `/admin/grading/${key}` as any });
  };

  const filteredData = results.filter(item => {
    if (activeTab === 'speaking') return item.skill.toLowerCase() === 'speaking';
    if (activeTab === 'writing') return item.skill.toLowerCase() === 'writing';
    if (activeTab === 'reading') return item.skill.toLowerCase() === 'reading';
    if (activeTab === 'listening') return item.skill.toLowerCase() === 'listening';
    return true;
  });

  return {
    activeTab,
    setActiveTab,
    filteredData,
    handleGrade,
  };
};
