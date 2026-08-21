import { useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { useLandingTab } from '@/shared/hooks/useLandingTab';
import { readingParts } from '../services/data';
import { useReadingSetsQuery } from '../../../services/readingExamQuery';
import {
  READING_PART_MAP,
  SKILL_ID,
  useExamBestScores,
  usePartPracticeProgress,
} from '../../../../../shared/services/student-exam';

export const useReadingLanding = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { activeTab, setActiveTab } = useLandingTab();

  // Tiến độ luyện theo phần lấy từ server (answered/total) — thêm câu hỏi thì tiến độ giảm.
  const { progress: readingProgress } = usePartPracticeProgress(SKILL_ID.READING, READING_PART_MAP);

  const { scoreByExamId: mockProgress } = useExamBestScores();

  // Fetch đề thi Reading đã publish
  const { data: examRes, isLoading: isExamsLoading } = useReadingSetsQuery();
  const examSets = useMemo(() => examRes?.data ?? [], [examRes]);

  const parts = readingParts.map((part) => ({
    ...part,
    progress: readingProgress[part.id] ?? 0,
  }));

  const completedCount = Object.values(readingProgress).filter((prog) => prog >= 100).length;

  const handlePartClick = (partId: string) => {
    if (partId === 'r1') navigate({ to: '/reading/part/1' });
    else if (partId === 'r2') navigate({ to: '/reading/part/2' });
    else if (partId === 'r3') navigate({ to: '/reading/part/3' });
    else if (partId === 'r4') navigate({ to: '/reading/part/4' });
  };

  const handleMockClick = (examId: number) => {
    navigate({ to: '/reading/mock-test/$testId', params: { testId: String(examId) } });
  };

  return {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    activeTab,
    setActiveTab,
    parts,
    completedCount,
    mockProgress,
    handlePartClick,
    handleMockClick,
    examSets,
    isExamsLoading,
  };
};
