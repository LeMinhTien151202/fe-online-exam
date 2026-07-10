import { useNavigate } from '@tanstack/react-router';
import React from 'react';
import { useWritingSetsQuery } from '../../../services/writingExamQuery';
import { usePartPracticeProgress } from '../../../../../shared/services/student-exam';

// Writing: w1..w4 = API part 1..4.
const WRITING_PART_MAP = [
  { feId: 'w1', apiPart: 1 },
  { feId: 'w2', apiPart: 2 },
  { feId: 'w3', apiPart: 3 },
  { feId: 'w4', apiPart: 4 },
];

export const useLandingAction = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'parts' | 'mock-tests'>('parts');
  const navigate = useNavigate();

  // Tiến độ luyện theo phần lấy từ server (answered/total).
  const { progress: writingProgress } = usePartPracticeProgress(4, WRITING_PART_MAP);

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
