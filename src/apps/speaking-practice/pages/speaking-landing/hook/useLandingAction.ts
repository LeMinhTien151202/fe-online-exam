import { useNavigate } from '@tanstack/react-router';
import React from 'react';
import { useLandingTab } from '@/shared/hooks/useLandingTab';
import { useSpeakingSetsQuery } from '../../../services/speakingExamQuery';
import {
  SKILL_ID,
  SPEAKING_PART_MAP,
  useExamBestScores,
  usePartPracticeProgress,
} from '../../../../../shared/services/student-exam';

export const useLandingAction = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { activeTab, setActiveTab } = useLandingTab();
  const navigate = useNavigate();

  // Tiến độ luyện theo phần lấy từ server (answered/total).
  const { progress: speakingProgress } = usePartPracticeProgress(SKILL_ID.SPEAKING, SPEAKING_PART_MAP);

  const { scoreByExamId: mockProgress } = useExamBestScores();

  const { data: examRes, isLoading: isExamsLoading } = useSpeakingSetsQuery();
  const examSets = React.useMemo(() => examRes?.data ?? [], [examRes]);

  const completedCount = Object.values(speakingProgress).filter((prog) => prog >= 100).length;

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
