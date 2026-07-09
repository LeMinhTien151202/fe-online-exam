import { useNavigate } from '@tanstack/react-router';
import React from 'react';
import { useSpeakingSetsQuery } from '../../../services/speakingExamQuery';

export const useLandingAction = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'parts' | 'mock-tests'>('parts');
  const navigate = useNavigate();

  const [speakingProgress] = React.useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('aptis_speaking_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return { s1: 0, s2: 0, s3: 0, s4: 0 };
  });

  const [mockProgress] = React.useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('aptis_speaking_mock_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return {};
  });

  const { data: examRes, isLoading: isExamsLoading } = useSpeakingSetsQuery();
  const examSets = React.useMemo(() => examRes?.data ?? [], [examRes]);

  const completedCount = Object.values(speakingProgress).filter((prog) => prog === 100).length;

  const handlePartClick = (partId: string) => {
    const num = partId.replace('s', '');
    navigate({ to: `/speaking/part/${num}` });
  };

  const handleMockClick = (examId: number) => {
    navigate({ to: '/speaking/mock-test/$testId', params: { testId: String(examId) } });
  };

  return {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    activeTab,
    setActiveTab,
    speakingProgress,
    mockProgress,
    completedCount,
    examSets,
    isExamsLoading,
    handlePartClick,
    handleMockClick,
  };
};
