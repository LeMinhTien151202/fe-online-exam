import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { message } from 'antd';
import { mockQuestions } from '../services/mockData';

export const usePart1 = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(12 * 60); // 12 phút tổng thời gian Speaking
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  
  const [showTips, setShowTips] = useState(false);
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [activeSampleIdx, setActiveSampleIdx] = useState(0);

  // Global countdown timer
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
    if (currentQuestionIndex < mockQuestions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowSampleAnswer(false);
      setActiveSampleIdx(0);
    } else {
      navigate({ to: '/speaking/part/2' });
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 1) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowSampleAnswer(false);
      setActiveSampleIdx(0);
    } else {
      navigate({ to: '/speaking' });
    }
  };

  const handleSubmit = () => {
    message.success('Đã hoàn thành luyện tập Part 1!');
    navigate({ to: '/speaking/part/2' });
  };

  const handleRecordComplete = (audioUrl: string | null) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: audioUrl || 'recorded_mock'
    }));
  };

  const currentQuestion = mockQuestions[currentQuestionIndex - 1];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / mockQuestions.length) * 100);

  return {
    navigate,
    timeLeft,
    currentQuestionIndex,
    setCurrentQuestionIndex,
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
    currentQuestion,
    answeredCount,
    progressPercent,
    mockQuestions,
  };
};
