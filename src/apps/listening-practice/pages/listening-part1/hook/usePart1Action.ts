import { useNavigate } from '@tanstack/react-router';
import { message } from 'antd';
import { useEffect,useState } from 'react';
import { mockQuestions } from '../services/data';

export const usePart1Action = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(39 * 60 + 56);
  const [showTranscript, setShowTranscript] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});

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

  const handleSelectAnswer = (option: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: option }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < 13) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowTranscript(false);
    } else {
      navigate({ to: '/listening/part/2' });
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 1) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowTranscript(false);
    } else {
      navigate({ to: '/listening' });
    }
  };

  const handleSubmit = () => {
    // Save progress to local storage
    const saved = localStorage.getItem('aptis_listening_progress');
    let progressObj: Record<string, number> = {};
    if (saved) {
      try {
        progressObj = JSON.parse(saved);
      } catch (e) { /* bỏ qua lỗi */ }
    }
    progressObj['l1'] = 100;
    localStorage.setItem('aptis_listening_progress', JSON.stringify(progressObj));

    message.success('Đã nộp bài Part 1!');
    navigate({ to: '/listening/part/2' });
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / 13) * 100;
  const currentQuestion = mockQuestions[currentQuestionIndex - 1];

  return {
    timeLeft,
    showTranscript,
    setShowTranscript,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    handleSelectAnswer,
    handleNext,
    handleBack,
    handleSubmit,
    answeredCount,
    progressPercent,
    currentQuestion,
    formatTime
  };
};
