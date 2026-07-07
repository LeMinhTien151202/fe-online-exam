import { message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useReadingQuestionsQuery } from '../../../services/readingQuery';
import { mapPart1 } from '../../../services/mappers';

export const usePart1Action = () => {
  const { data: res, isLoading } = useReadingQuestionsQuery(1);
  const questions = useMemo(() => res?.data ?? [], [res]);
  const total = questions.length;

  const [index, setIndex] = useState(0);
  const safeIndex = total > 0 ? Math.min(index, total - 1) : 0;
  const data = useMemo(() => {
    const q = questions[safeIndex];
    return q ? mapPart1(q) : null;
  }, [questions, safeIndex]);

  const gapCount = data?.questions.length ?? 0;
  const correctAnswers = data?.correctAnswers ?? {};

  const [timeLeft, setTimeLeft] = useState(598); // 09:58
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0 || isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectChange = (questionId: number, value: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    const answeredCount = Object.keys(answers).length;
    if (gapCount === 0) return;
    if (answeredCount < gapCount) {
      message.warning(`Bạn mới trả lời ${answeredCount}/${gapCount} câu hỏi. Hãy hoàn thành tất cả nhé!`);
      return;
    }

    setIsSubmitted(true);
    const correctCount = Object.keys(correctAnswers).filter(
      (id) => answers[Number(id)] === correctAnswers[Number(id)]
    ).length;

    const progressPercent = Math.round((correctCount / gapCount) * 100);
    const savedProgress = localStorage.getItem('aptis_reading_progress');
    let nextProgress = { r1: progressPercent };
    if (savedProgress) {
      try {
        nextProgress = { ...JSON.parse(savedProgress), r1: progressPercent };
      } catch { /* bỏ qua lỗi */ }
    }
    localStorage.setItem('aptis_reading_progress', JSON.stringify(nextProgress));

    message.success(`Chúc mừng! Bạn đã hoàn thành câu ${safeIndex + 1}. Kết quả: ${correctCount}/${gapCount} câu đúng.`);
  };

  const resetForNewQuestion = () => {
    setAnswers({});
    setIsSubmitted(false);
    setTimeLeft(598);
  };

  const handleRetry = () => resetForNewQuestion();

  // Chuyển sang bộ câu hỏi khác của cùng phần
  const handleNext = () => {
    if (safeIndex >= total - 1) return;
    setIndex(safeIndex + 1);
    resetForNewQuestion();
  };

  const handlePrev = () => {
    if (safeIndex <= 0) return;
    setIndex(safeIndex - 1);
    resetForNewQuestion();
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = gapCount ? Math.round((answeredCount / gapCount) * 100) : 0;
  const correctCount = Object.keys(correctAnswers).filter(
    (id) => answers[Number(id)] === correctAnswers[Number(id)]
  ).length;

  return {
    isLoading,
    data,
    gapCount,
    correctAnswers,
    total,
    currentNumber: total > 0 ? safeIndex + 1 : 0,
    hasNext: safeIndex < total - 1,
    hasPrev: safeIndex > 0,
    handleNext,
    handlePrev,
    timeLeft,
    answers,
    isSubmitted,
    handleSelectChange,
    handleSubmit,
    handleRetry,
    answeredCount,
    progressPercent,
    correctCount,
    formatTime,
  };
};
