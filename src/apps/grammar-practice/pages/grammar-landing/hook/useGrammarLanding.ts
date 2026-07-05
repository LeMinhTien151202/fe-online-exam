import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { grammarParts } from '../services/data';

export const useGrammarLanding = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'parts' | 'mock-tests'>('parts');
  const navigate = useNavigate();

  // Load progress from localStorage
  const [partsProgress] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('aptis_grammar_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) { /* bỏ qua lỗi */ }
    }
    return { g1: 0, g2: 0 };
  });

  const [mockProgress] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('aptis_grammar_mock_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) { /* bỏ qua lỗi */ }
    }
    return { m1: 0, m2: 0, m3: 0 };
  });

  const parts = grammarParts.map(part => ({
    ...part,
    progress: partsProgress[part.id] ?? 0
  }));

  const completedCount = Object.values(partsProgress).filter(prog => prog === 100).length;

  const handlePartClick = (partId: string) => {
    const num = partId === 'g1' ? '1' : '2';
    navigate({ to: `/grammar/part/${num}` as any });
  };

  const handleMockClick = (mockId: string) => {
    navigate({ to: `/grammar/mock-test/${mockId}` as any });
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
    handleMockClick
  };
};
