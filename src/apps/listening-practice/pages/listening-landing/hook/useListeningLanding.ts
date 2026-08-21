import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useLandingTab } from '@/shared/hooks/useLandingTab';
import { useListeningSetsQuery } from '../../../services/listeningExamQuery';
import { listeningPartsData } from '../services/data';
import {
  LISTENING_PART_MAP,
  SKILL_ID,
  useExamBestScores,
  usePartPracticeProgress,
} from '../../../../../shared/services/student-exam';

export const useListeningLanding = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { activeTab, setActiveTab } = useLandingTab();

  // Tiến độ luyện theo phần lấy từ server (answered/total).
  const { progress: listeningProgress } = usePartPracticeProgress(SKILL_ID.LISTENING, LISTENING_PART_MAP);

  const { scoreByExamId: mockProgress } = useExamBestScores();

  const { data: examRes, isLoading: isExamsLoading } = useListeningSetsQuery();
  const examSets = examRes?.data ?? [];

  const parts = listeningPartsData.map((part) => ({
    ...part,
    progress: listeningProgress[part.id] ?? 0,
  }));

  const completedCount = Object.values(listeningProgress).filter((prog) => prog >= 100).length;

  const handlePartClick = (partId: string) => {
    if (partId === 'l1') {
      navigate({ to: '/listening/part/1' });
    } else if (partId === 'l2') {
      navigate({ to: '/listening/part/2' });
    } else if (partId === 'l3') {
      navigate({ to: '/listening/part/3' });
    } else if (partId === 'l4') {
      navigate({ to: '/listening/part/4' });
    }
  };

  const handleMockClick = (examId: number) => {
    navigate({ to: '/listening/mock-test/$testId', params: { testId: String(examId) } });
  };

  return {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    activeTab,
    setActiveTab,
    parts,
    completedCount,
    mockProgress,
    examSets,
    isExamsLoading,
    handlePartClick,
    handleMockClick
  };
};
