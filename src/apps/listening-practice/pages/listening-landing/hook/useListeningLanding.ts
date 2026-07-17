import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useLandingTab } from '@/shared/hooks/useLandingTab';
import { useListeningSetsQuery } from '../../../services/listeningExamQuery';
import { listeningPartsData } from '../services/data';
import { usePartPracticeProgress } from '../../../../../shared/services/student-exam';

// Listening: l1..l4 = API part 1..4.
const LISTENING_PART_MAP = [
  { feId: 'l1', apiPart: 1 },
  { feId: 'l2', apiPart: 2 },
  { feId: 'l3', apiPart: 3 },
  { feId: 'l4', apiPart: 4 },
];

export const useListeningLanding = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { activeTab, setActiveTab } = useLandingTab();

  // Tiến độ luyện theo phần lấy từ server (answered/total).
  const { progress: listeningProgress } = usePartPracticeProgress(2, LISTENING_PART_MAP);

  const [mockProgress] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('aptis_listening_mock_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return { m1: 0, m2: 0, m3: 0 };
  });

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
