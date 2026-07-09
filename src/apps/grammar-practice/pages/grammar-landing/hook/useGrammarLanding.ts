import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useGrammarSetsQuery } from '../../../services/grammarExamQuery';
import { grammarParts } from '../services/data';

export const useGrammarLanding = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'parts' | 'mock-tests'>('parts');
  const navigate = useNavigate();

  const [partsProgress] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('aptis_grammar_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return { g1: 0, g2: 0 };
  });

  const [mockProgress] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('aptis_grammar_mock_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return {};
  });

  const { data: examRes, isLoading: isExamsLoading } = useGrammarSetsQuery();
  const examSets = examRes?.data ?? [];

  const parts = grammarParts.map((part) => ({
    ...part,
    progress: partsProgress[part.id] ?? 0,
  }));

  const completedCount = Object.values(partsProgress).filter((prog) => prog === 100).length;

  const handlePartClick = (partId: string) => {
    if (partId === 'g1') {
      navigate({ to: '/grammar/part/1' });
    } else {
      navigate({ to: '/grammar/part/2' });
    }
  };

  const handleMockClick = (examId: number) => {
    navigate({ to: '/grammar/mock-test/$testId', params: { testId: String(examId) } });
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
    handleMockClick,
  };
};
