import { useNavigate } from '@tanstack/react-router';
import React from 'react';
import { useSpeakingSetsQuery } from '../../../services/speakingExamQuery';
import { usePartPracticeProgress } from '../../../../../shared/services/student-exam';

// Speaking: s1..s4 = API part 1..4.
const SPEAKING_PART_MAP = [
  { feId: 's1', apiPart: 1 },
  { feId: 's2', apiPart: 2 },
  { feId: 's3', apiPart: 3 },
  { feId: 's4', apiPart: 4 },
];

export const useLandingAction = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'parts' | 'mock-tests'>('parts');
  const navigate = useNavigate();

  // Tiến độ luyện theo phần lấy từ server (answered/total).
  const { progress: speakingProgress } = usePartPracticeProgress(5, SPEAKING_PART_MAP);

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
