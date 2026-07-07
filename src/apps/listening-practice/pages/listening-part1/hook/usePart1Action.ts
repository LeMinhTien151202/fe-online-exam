import { useNavigate } from '@tanstack/react-router';
import { message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useListeningQuestionsQuery } from '../../../services/listeningQuery';
import { mapLPart1 } from '../../../services/mappers';

export const usePart1Action = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(39 * 60 + 56);
  const [showTranscript, setShowTranscript] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const { data: res, isLoading } = useListeningQuestionsQuery(1);
  const questions = useMemo(() => mapLPart1(res?.data ?? []), [res]);
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

  const handleSelectAnswer = (option: string) => {
    setAnswers((prev) => ({ ...prev, [safeIndex]: option }));
  };

  const handleNext = () => {
    if (safeIndex < total) {
      setCurrentQuestionIndex(safeIndex + 1);
      setShowTranscript(false);
    }
  };

  const handleBack = () => {
    if (safeIndex > 1) {
      setCurrentQuestionIndex(safeIndex - 1);
      setShowTranscript(false);
    } else {
      navigate({ to: '/listening' });
    }
  };

  const handleSubmit = () => {
    const saved = localStorage.getItem('aptis_listening_progress');
    let progressObj: Record<string, number> = {};
    if (saved) {
      try { progressObj = JSON.parse(saved); } catch { /* bỏ qua lỗi */ }
    }
    progressObj['l1'] = 100;
    localStorage.setItem('aptis_listening_progress', JSON.stringify(progressObj));
    message.success('Đã ghi nhận câu trả lời! Bạn có thể luyện câu tiếp theo.');
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = total > 0 ? (answeredCount / total) * 100 : 0;
  const currentQuestion = questions[safeIndex - 1] ?? { id: 0, questionText: '', options: [], correctIndex: -1, mediaUrl: null };

  return {
    isLoading,
    hasData: total > 0,
    total,
    timeLeft,
    showTranscript,
    setShowTranscript,
    currentQuestionIndex: safeIndex,
    setCurrentQuestionIndex,
    answers,
    handleSelectAnswer,
    handleNext,
    handleBack,
    handleSubmit,
    answeredCount,
    progressPercent,
    currentQuestion,
    mockQuestions: questions,
    hasNext: safeIndex < total,
    formatTime,
  };
};
