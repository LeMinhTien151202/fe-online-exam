import { useNavigate } from '@tanstack/react-router';
import React from 'react';

export const useLandingAction = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'parts' | 'mock-tests'>('parts');
  const navigate = useNavigate();

  const [writingProgress, setWritingProgress] = React.useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('aptis_writing_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return { w1: 0, w2: 0, w3: 0, w4: 0 };
  });

  const [mockProgress, setMockProgress] = React.useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('aptis_writing_mock_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return { m1: 0, m2: 0, m3: 0 };
  });

  const completedCount = Object.values(writingProgress).filter((prog) => prog === 100).length;

  const handlePartClick = (partId: string) => {
    const num = partId.replace('w', '');
    navigate({ to: `/writing/part/${num}` });
  };

  const handleMockClick = (mockId: string) => {
    navigate({ to: `/writing/mock-test/${mockId}` as any });
  };

  return {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    activeTab,
    setActiveTab,
    writingProgress,
    mockProgress,
    completedCount,
    handlePartClick,
    handleMockClick,
  };
};
