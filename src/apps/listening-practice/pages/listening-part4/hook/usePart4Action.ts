import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { message } from 'antd';
import { mockGroups } from '../services/data';

export const usePart4Action = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(9 * 60 + 15); // 09:15 mock
  const [showTranscript, setShowTranscript] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<number>(16);
  const [answers, setAnswers] = useState<Record<string, string>>({});

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

  const handleSelectAnswer = (subQuestionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [subQuestionId]: answer }));
  };

  const handleNext = () => {
    if (activeQuestion === 16) {
      setActiveQuestion(17);
      setShowTranscript(false);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (activeQuestion === 17) {
      setActiveQuestion(16);
      setShowTranscript(false);
    } else {
      navigate({ to: '/listening/part/3' });
    }
  };

  const handleSubmit = () => {
    const saved = localStorage.getItem('aptis_listening_progress');
    let progressObj: Record<string, number> = {};
    if (saved) {
      try {
        progressObj = JSON.parse(saved);
      } catch (e) {}
    }
    progressObj['l4'] = 100;
    localStorage.setItem('aptis_listening_progress', JSON.stringify(progressObj));

    message.success('Đã nộp bài Part 4 và hoàn thành Listening!');
    navigate({ to: '/listening' });
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / 4) * 100;
  const currentGroup = mockGroups.find(g => g.id === activeQuestion) || mockGroups[0];

  return {
    timeLeft,
    showTranscript,
    setShowTranscript,
    activeQuestion,
    setActiveQuestion,
    answers,
    handleSelectAnswer,
    handleNext,
    handleBack,
    handleSubmit,
    answeredCount,
    progressPercent,
    currentGroup,
    formatTime
  };
};
