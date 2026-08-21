import { useNavigate } from '@tanstack/react-router';
import React from 'react';
import { useLandingTab } from '@/shared/hooks/useLandingTab';
import { useWritingSetsQuery } from '../../../services/writingExamQuery';
import {
  SKILL_ID,
  useExamBestScores,
  usePartPracticeProgress,
  WRITING_PART_MAP,
} from '../../../../../shared/services/student-exam';

export const useLandingAction = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { activeTab, setActiveTab } = useLandingTab();
  const navigate = useNavigate();

  // Tiến độ luyện theo phần lấy từ server (answered/total).
  const { progress: writingProgress } = usePartPracticeProgress(SKILL_ID.WRITING, WRITING_PART_MAP);

  const { scoreByExamId: mockProgress } = useExamBestScores();

  const { data: examRes, isLoading: isExamsLoading } = useWritingSetsQuery();
  const examSets = React.useMemo(() => examRes?.data ?? [], [examRes]);

  const completedCount = Object.values(writingProgress).filter((prog) => prog >= 100).length;

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
