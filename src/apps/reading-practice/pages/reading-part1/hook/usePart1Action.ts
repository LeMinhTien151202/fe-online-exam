import { message } from 'antd';
import { useEffect,useState } from 'react';
import { correctAnswers } from '../services/data';

export const usePart1Action = () => {
  const [timeLeft, setTimeLeft] = useState(598); // 09:58 -> 598 seconds
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0 || isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
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
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = () => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < 5) {
      message.warning(`Bạn mới trả lời ${answeredCount}/5 câu hỏi. Hãy hoàn thành tất cả nhé!`);
      return;
    }
    
    setIsSubmitted(true);
    const correctCount = Object.keys(correctAnswers).filter(
      (id) => answers[Number(id)] === correctAnswers[Number(id)]
    ).length;
    
    // Save progress to local storage
    const progressPercent = Math.round((correctCount / 5) * 100);
    const savedProgress = localStorage.getItem('aptis_reading_progress');
    let nextProgress = { r1: progressPercent };
    if (savedProgress) {
      try {
        nextProgress = { ...JSON.parse(savedProgress), r1: progressPercent };
      } catch (e) { /* bỏ qua lỗi */ }
    }
    localStorage.setItem('aptis_reading_progress', JSON.stringify(nextProgress));

    message.success(`Chúc mừng! Bạn đã hoàn thành Part 1. Kết quả: ${correctCount}/5 câu đúng.`);
  };

  const handleRetry = () => {
    setAnswers({});
    setIsSubmitted(false);
    setTimeLeft(598);
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / 5) * 100);
  const correctCount = Object.keys(correctAnswers).filter(
    (id) => answers[Number(id)] === correctAnswers[Number(id)]
  ).length;

  return {
    timeLeft,
    answers,
    isSubmitted,
    handleSelectChange,
    handleSubmit,
    handleRetry,
    answeredCount,
    progressPercent,
    correctCount,
    formatTime
  };
};
