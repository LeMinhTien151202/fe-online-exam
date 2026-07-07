import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { message } from 'antd';
import { useSpeakingQuestionsQuery } from '../../../services/speakingQuery';
import { mapSpeakingP1, SpeakingP1Item } from '../../../services/mappers';

export const usePart1 = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(12 * 60);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [showTips, setShowTips] = useState(false);
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [activeSampleIdx, setActiveSampleIdx] = useState(0);

  const { data: res, isLoading } = useSpeakingQuestionsQuery(1);
  const questions = useMemo<SpeakingP1Item[]>(() => mapSpeakingP1(res?.data ?? []), [res]);
  const total = questions.length;

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const safeIndex = total > 0 ? Math.min(currentQuestionIndex, total) : 1;

  const handleNext = () => {
    if (safeIndex < total) {
      setCurrentQuestionIndex(safeIndex + 1);
      setShowSampleAnswer(false);
      setActiveSampleIdx(0);
    }
  };

  const handleBack = () => {
    if (safeIndex > 1) {
      setCurrentQuestionIndex(safeIndex - 1);
      setShowSampleAnswer(false);
      setActiveSampleIdx(0);
    } else {
      navigate({ to: '/speaking' });
    }
  };

  const handleSubmit = () => {
    message.success('Đã ghi nhận phần trả lời của bạn! Bạn có thể luyện câu tiếp theo.');
  };

  const handleRecordComplete = (audioUrl: string | null) => {
    setAnswers((prev) => ({ ...prev, [safeIndex]: audioUrl || 'recorded_mock' }));
  };

  const currentQuestion = questions[safeIndex - 1] ?? { id: 0, questionText: '', sampleAnswers: [] };
  const answeredCount = Object.keys(answers).length;
  const progressPercent = total > 0 ? Math.round((answeredCount / total) * 100) : 0;

  return {
    navigate,
    isLoading,
    hasData: total > 0,
    timeLeft,
    currentQuestionIndex: safeIndex,
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
    mockQuestions: questions,
    total,
    hasNext: safeIndex < total,
    hasPrev: safeIndex > 1,
  };
};
