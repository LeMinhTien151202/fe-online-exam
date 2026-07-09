import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useListeningSetsQuery } from '../../../services/listeningExamQuery';
import { listeningPartsData } from '../services/data';

export const useListeningLanding = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'parts' | 'mock-tests'>('parts');

  const [listeningProgress] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('aptis_listening_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return { l1: 0, l2: 0, l3: 0, l4: 0 };
  });

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

  const completedCount = Object.values(listeningProgress).filter((prog) => prog === 100).length;

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
