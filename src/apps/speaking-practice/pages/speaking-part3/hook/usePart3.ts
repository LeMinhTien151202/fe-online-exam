import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { message } from 'antd';
import { mockCompareSets } from '../services/mockData';

export const usePart3 = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(12 * 60);
  const [currentSubIndex, setCurrentSubIndex] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
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

  const handleSubTabChange = (idx: number) => {
    setCurrentSubIndex(idx);
    setShowSampleAnswer(false);
    setActiveSampleIdx(0);
  };

  const handleNext = () => {
    if (currentSubIndex < 3) {
      setCurrentSubIndex(prev => prev + 1);
      setShowSampleAnswer(false);
      setActiveSampleIdx(0);
    } else {
      navigate({ to: '/speaking/part/4' });
    }
  };

  const handleBack = () => {
    if (currentSubIndex > 1) {
      setCurrentSubIndex(prev => prev - 1);
      setShowSampleAnswer(false);
      setActiveSampleIdx(0);
    } else {
      navigate({ to: '/speaking/part/2' });
    }
  };

  const handleSubmit = () => {
    message.success('Đã hoàn thành luyện tập Part 3!');
    navigate({ to: '/speaking/part/4' });
  };

  const handleRecordComplete = (audioUrl: string | null) => {
    const key = `1-${currentSubIndex}`;
    setAnswers(prev => ({
      ...prev,
      [key]: audioUrl || 'recorded_mock'
    }));
  };

  const currentCompareSet = mockCompareSets[0];
  const activeQuestion = currentCompareSet.questions[currentSubIndex - 1];

  const totalSubQuestions = 3;
  let answeredCount = 0;
  [1, 2, 3].forEach(sub => {
    if (answers[`1-${sub}`]) answeredCount++;
  });
  const progressPercent = Math.round((answeredCount / totalSubQuestions) * 100);

  return {
    navigate,
    timeLeft,
    currentSubIndex,
    setCurrentSubIndex,
    answers,
    showSampleAnswer,
    setShowSampleAnswer,
    activeSampleIdx,
    setActiveSampleIdx,
    formatTime,
    handleSubTabChange,
    handleNext,
    handleBack,
    handleSubmit,
    handleRecordComplete,
    currentCompareSet,
    activeQuestion,
    totalSubQuestions,
    answeredCount,
    progressPercent,
  };
};
