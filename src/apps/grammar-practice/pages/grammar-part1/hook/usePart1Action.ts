import { useState, useEffect } from 'react';
import { message } from 'antd';

export const usePart1Action = (
  onSubmit: (finalAnswers: Record<number, string>) => void,
  initialTime: number = 12 * 60 + 30,
  storagePrefix: string = 'aptis_grammar_part_1',
  totalQuestions: number = 25
) => {
  const EXAM_ANSWERS_KEY = `${storagePrefix}_answers`;
  const EXAM_TIME_KEY = `${storagePrefix}_time`;

  // 1. Initialize answers state from localStorage
  const [answers, setAnswers] = useState<Record<number, string>>(() => {
    const saved = localStorage.getItem(EXAM_ANSWERS_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  // 2. Initialize active question (1 -> 25)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(1);

  // 3. Initialize time left
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const saved = localStorage.getItem(EXAM_TIME_KEY);
    if (saved) {
      const parsed = parseInt(saved, 10);
      return parsed > 0 ? parsed : initialTime;
    }
    return initialTime;
  });

  const [isFinished, setIsFinished] = useState(false);

  // Sync answers to localStorage
  useEffect(() => {
    localStorage.setItem(EXAM_ANSWERS_KEY, JSON.stringify(answers));
  }, [answers]);

  // Countdown timer logic
  useEffect(() => {
    if (timeLeft <= 0 || isFinished) {
      if (timeLeft <= 0 && !isFinished) {
        handleAutoSubmit();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const nextTime = prev - 1;
        localStorage.setItem(EXAM_TIME_KEY, nextTime.toString());
        return nextTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isFinished]);

  const handleAutoSubmit = () => {
    setIsFinished(true);
    message.warning('Đã hết thời gian làm bài! Hệ thống tự động nộp bài của bạn.');
    clearStorage();
    onSubmit(answers);
  };

  const clearStorage = () => {
    localStorage.removeItem(EXAM_ANSWERS_KEY);
    localStorage.removeItem(EXAM_TIME_KEY);
  };

  const selectAnswer = (questionNumber: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionNumber]: value
    }));
  };

  const resetExam = () => {
    clearStorage();
    setAnswers({});
    setTimeLeft(initialTime);
    setCurrentQuestionIndex(1);
    setIsFinished(false);
  };

  const submitExamManual = () => {
    const answeredCount = Object.keys(answers).length;
    const confirmSubmit = () => {
      setIsFinished(true);
      clearStorage();
      onSubmit(answers);
    };

    if (answeredCount < totalQuestions) {
      const unanswered = totalQuestions - answeredCount;
      return {
        hasUnanswered: true,
        unansweredCount: unanswered,
        confirm: confirmSubmit
      };
    }

    return {
      hasUnanswered: false,
      unansweredCount: 0,
      confirm: confirmSubmit
    };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.round((Object.keys(answers).length / totalQuestions) * 100);

  return {
    answers,
    currentQuestionIndex,
    timeLeft,
    progressPercent,
    isFinished,
    setCurrentQuestionIndex,
    selectAnswer,
    submitExamManual,
    resetExam,
    formatTime,
    totalAnswered: Object.keys(answers).length
  };
};
