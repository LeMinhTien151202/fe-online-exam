import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { message } from 'antd';
import { mockAbstractSets } from '../services/mockData';

export const usePart4 = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(12 * 60);
  const [currentSetIndex, setCurrentSetIndex] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string | null>>({});

  const [showTips, setShowTips] = useState(false);
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [activeSampleIdx, setActiveSampleIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (currentSetIndex < mockAbstractSets.length) {
      setCurrentSetIndex(prev => prev + 1);
      setShowSampleAnswer(false);
    } else {
      message.info('Bạn đã hoàn thành bộ đề Speaking Practice!');
    }
  };

  const handleBack = () => {
    navigate({ to: '/speaking/part/3' });
  };

  const handleSubmit = () => {
    message.success('Xin chúc mừng! Bạn đã hoàn thành toàn bộ bài thi thử Speaking.');
    navigate({ to: '/speaking' });
  };

  const handleRecordComplete = (audioUrl: string | null) => {
    setAnswers(prev => ({
      ...prev,
      [1]: audioUrl || 'recorded_mock'
    }));
  };

  const currentSet = mockAbstractSets[0];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / mockAbstractSets.length) * 100);

  return {
    navigate,
    timeLeft,
    currentSetIndex,
    setCurrentSetIndex,
    answers,
    showTips,
    setShowTips,
    showSampleAnswer,
    setShowSampleAnswer,
    activeSampleIdx,
    setActiveSampleIdx,
    formatTime,
    handleNext,
    handleBack,
    handleSubmit,
    handleRecordComplete,
    currentSet,
    answeredCount,
    progressPercent,
  };
};
