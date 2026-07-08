import { useNavigate } from '@tanstack/react-router';
import React from 'react';
import { useWritingSetsQuery } from '../../../services/writingExamQuery';

export const useLandingAction = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'parts' | 'mock-tests'>('parts');
  const navigate = useNavigate();

  const [writingProgress] = React.useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('aptis_writing_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return { w1: 0, w2: 0, w3: 0, w4: 0 };
  });

  const [mockProgress] = React.useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('aptis_writing_mock_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return {};
  });

  const { data: examRes, isLoading: isExamsLoading } = useWritingSetsQuery();
  const examSets = React.useMemo(() => examRes?.data ?? [], [examRes]);

  const completedCount = Object.values(writingProgress).filter((prog) => prog === 100).length;

  const handlePartClick = (partId: string) => {
    const num = partId.replace('w', '');
    navigate({ to: `/writing/part/${num}` });
  };

  const handleMockClick = (examId: number) => {
    navigate({ to: '/writing/mock-test/$testId', params: { testId: String(examId) } });
  };

  return {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    activeTab,
    setActiveTab,
    writingProgress,
    mockProgress,
    completedCount,
    examSets,
    isExamsLoading,
    handlePartClick,
    handleMockClick,
  };
};
