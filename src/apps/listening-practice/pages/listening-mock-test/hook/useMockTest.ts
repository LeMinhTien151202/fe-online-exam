import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { message, Modal } from 'antd';
import { correctAnswersBank } from '../services/data';

export const useMockTest = (testId: string) => {
  const navigate = useNavigate();
  const totalQuestions = 25;

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(40 * 60); // 40 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [activeQuestionNum, setActiveQuestionNum] = useState<number>(1);

  const activePart = activeQuestionNum <= 13 ? 1 : activeQuestionNum <= 17 ? 2 : activeQuestionNum <= 21 ? 3 : 4;

  useEffect(() => {
    if (timeLeft <= 0 || isSubmitted) {
      if (timeLeft <= 0 && !isSubmitted) {
        handleAutoSubmit();
      }
      return;
    }
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

  const answeredCount = Object.keys(answers).length;

  const calculateScores = () => {
    let scoreP1 = 0;
    let scoreP2 = 0;
    let scoreP3 = 0;
    let scoreP4 = 0;

    Object.keys(correctAnswersBank).forEach((key) => {
      const qNum = Number(key);
      if (answers[qNum] === correctAnswersBank[qNum]) {
        if (qNum <= 13) scoreP1++;
        else if (qNum <= 17) scoreP2++;
        else if (qNum <= 21) scoreP3++;
        else scoreP4++;
      }
    });

    const totalScore = scoreP1 + scoreP2 + scoreP3 + scoreP4;
    return { scoreP1, scoreP2, scoreP3, scoreP4, totalScore };
  };

  const getAptisLevel = (score: number) => {
    if (score < 9) return 'A1/A2 (Dưới trung bình)';
    if (score < 16) return 'B1 (Trung cấp)';
    if (score < 22) return 'B2 (Trung cao cấp)';
    return 'C (Cao cấp)';
  };

  const saveProgressToLocalStorage = (totalScore: number) => {
    const saved = localStorage.getItem('aptis_listening_mock_progress');
    let progressObj: Record<string, number> = {};
    if (saved) {
      try {
        progressObj = JSON.parse(saved);
      } catch (e) {}
    }
    const currentBest = progressObj[testId] ?? 0;
    progressObj[testId] = Math.max(currentBest, totalScore);
    localStorage.setItem('aptis_listening_mock_progress', JSON.stringify(progressObj));
  };

  const handleAutoSubmit = () => {
    setIsSubmitted(true);
    setShowReport(true);
    message.warning('Đã hết thời gian làm bài! Hệ thống tự động nộp bài.');
    const { totalScore } = calculateScores();
    saveProgressToLocalStorage(totalScore);
  };

  const handleManualSubmit = () => {
    setIsSubmitted(true);
    setShowReport(true);
    message.success('Bạn đã nộp bài thi thành công!');
    const { totalScore } = calculateScores();
    saveProgressToLocalStorage(totalScore);
  };

  const handleRetry = () => {
    setAnswers({});
    setTimeLeft(40 * 60);
    setIsSubmitted(false);
    setShowReport(false);
    setActiveQuestionNum(1);
    setShowTranscript(false);
  };

  const handleBackToLanding = (onConfirmBack: () => void) => {
    if (isSubmitted) {
      onConfirmBack();
      return;
    }
    Modal.confirm({
      title: 'Xác nhận thoát khỏi đề thi?',
      content: 'Tiến độ làm bài của bạn sẽ không được lưu nếu bạn thoát ra lúc này.',
      okText: 'Thoát ra',
      cancelText: 'Làm tiếp',
      onOk: onConfirmBack
    });
  };

  const handleNavigateQuestion = (qNum: number) => {
    setActiveQuestionNum(qNum);
    setShowTranscript(false);
  };

  const handlePrevQuestion = () => {
    if (activePart === 2) {
      handleNavigateQuestion(1);
    } else if (activePart === 3) {
      handleNavigateQuestion(14);
    } else if (activePart === 4) {
      handleNavigateQuestion(18);
    }
  };

  const handleNextQuestion = () => {
    if (activePart === 1) {
      handleNavigateQuestion(14);
    } else if (activePart === 2) {
      handleNavigateQuestion(18);
    } else if (activePart === 3) {
      handleNavigateQuestion(22);
    }
  };

  const handleSelectAnswer = (questionNum: number, option: string) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [questionNum]: option }));
  };

  return {
    answers,
    timeLeft,
    isSubmitted,
    showReport,
    setShowReport,
    showTranscript,
    setShowTranscript,
    activeQuestionNum,
    setActiveQuestionNum,
    activePart,
    answeredCount,
    formatTime,
    calculateScores,
    getAptisLevel,
    handleManualSubmit,
    handleRetry,
    handleBackToLanding,
    handleNavigateQuestion,
    handlePrevQuestion,
    handleNextQuestion,
    handleSelectAnswer
  };
};
