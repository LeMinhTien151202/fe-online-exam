import { message } from 'antd';
import { useEffect,useState } from 'react';
import { correctAnswers } from '../services/data';

export const usePart4Action = () => {
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
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

  const handleSelectChange = (paragraphNum: number, value: string) => {
    if (isSubmitted) return;
    setAnswers(prev => ({
      ...prev,
      [paragraphNum]: value
    }));
  };

  const handleSubmit = () => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < 7) {
      message.warning(`Bạn đã trả lời ${answeredCount}/7 tiêu đề. Vui lòng gán tiêu đề cho cả 7 đoạn văn!`);
      return;
    }

    setIsSubmitted(true);
    const correctCount = Object.keys(correctAnswers).filter(
      (id) => answers[Number(id)] === correctAnswers[Number(id)]
    ).length;

    // Save progress to local storage
    const progressPercent = Math.round((correctCount / 7) * 100);
    const savedProgress = localStorage.getItem('aptis_reading_progress');
    let nextProgress = { r4: progressPercent };
    if (savedProgress) {
      try {
        nextProgress = { ...JSON.parse(savedProgress), r4: progressPercent };
      } catch (e) { /* bỏ qua lỗi */ }
    }
    localStorage.setItem('aptis_reading_progress', JSON.stringify(nextProgress));

    message.success(`Chúc mừng! Bạn đã hoàn thành Part 4. Kết quả: ${correctCount}/7 câu đúng.`);
  };

  const handleRetry = () => {
    setAnswers({});
    setIsSubmitted(false);
    setTimeLeft(900);
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / 7) * 100);
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
