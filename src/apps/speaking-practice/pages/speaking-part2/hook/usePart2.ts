import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { message } from 'antd';
import { mockSets } from '../services/mockData';

export const usePart2 = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(12 * 60); // Đếm ngược chung
  const [currentSubIndex, setCurrentSubIndex] = useState(1); // 1, 2, 3 (tương ứng sub-tab)
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
      navigate({ to: '/speaking/part/3' });
    }
  };

  const handleBack = () => {
    if (currentSubIndex > 1) {
      setCurrentSubIndex(prev => prev - 1);
      setShowSampleAnswer(false);
      setActiveSampleIdx(0);
    } else {
      navigate({ to: '/speaking/part/1' });
    }
  };

  const handleSubmit = () => {
    message.success('Đã hoàn thành luyện tập Part 2!');
    navigate({ to: '/speaking/part/3' });
  };

  const handleRecordComplete = (audioUrl: string | null) => {
    const key = `1-${currentSubIndex}`;
    setAnswers(prev => ({
      ...prev,
      [key]: audioUrl || 'recorded_mock'
    }));
  };

  const currentSet = mockSets[0];
  const activeQuestion = currentSet.questions[currentSubIndex - 1];

  // Tính tiến độ: Số sub-questions đã ghi âm (tối đa 3)
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
    currentSet,
    activeQuestion,
    totalSubQuestions,
    answeredCount,
    progressPercent,
  };
};
