import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { readingParts } from '../services/data';

export const useReadingLanding = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'parts' | 'mock-tests'>('parts');

  const [readingProgress] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('aptis_reading_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return { r1: 0, r2: 0, r3: 0, r4: 0 };
  });

  const [mockProgress] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('aptis_reading_mock_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return { m1: 0, m2: 0, m3: 0 };
  });

  const parts = readingParts.map((part) => ({
    ...part,
    progress: readingProgress[part.id] ?? 0,
  }));

  const completedCount = Object.values(readingProgress).filter((prog) => prog === 100).length;

  const handlePartClick = (partId: string) => {
    if (partId === 'r1') {
      navigate({ to: '/reading/part/1' });
    } else if (partId === 'r2') {
      navigate({ to: '/reading/part/2' });
    } else if (partId === 'r3') {
      navigate({ to: '/reading/part/3' });
    } else if (partId === 'r4') {
      navigate({ to: '/reading/part/4' });
    }
  };

  const handleMockClick = (mockId: string) => {
    navigate({ to: `/reading/mock-test/${mockId}` as any });
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
