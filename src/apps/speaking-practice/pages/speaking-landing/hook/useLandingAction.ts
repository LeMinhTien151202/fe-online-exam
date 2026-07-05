import { useNavigate } from '@tanstack/react-router';
import React from 'react';

export const useLandingAction = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'parts' | 'mock-tests'>('parts');
  const navigate = useNavigate();

  const [speakingProgress, setSpeakingProgress] = React.useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('aptis_speaking_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return { s1: 0, s2: 0, s3: 0, s4: 0 };
  });

  const [mockProgress, setMockProgress] = React.useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('aptis_speaking_mock_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return { m1: 0, m2: 0, m3: 0 };
  });

  const completedCount = Object.values(speakingProgress).filter((prog) => prog === 100).length;

  const handlePartClick = (partId: string) => {
    const num = partId.replace('s', '');
    navigate({ to: `/speaking/part/${num}` });
  };

  const handleMockClick = (mockId: string) => {
    navigate({ to: `/speaking/mock-test/${mockId}` as any });
  };

  return {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    activeTab,
    setActiveTab,
    speakingProgress,
    mockProgress,
    completedCount,
    handlePartClick,
    handleMockClick,
  };
};
