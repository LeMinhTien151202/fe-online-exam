import { message } from 'antd';
import { useEffect,useState } from 'react';
import {
ISentence,
correctP1,
correctP2,
correctP3,
correctP4,
initialP2Sentences
} from '../services/data';

export const useMockTest = (testId: string) => {
  const [p1Answers, setP1Answers] = useState<Record<number, string>>({});
  const [p2Slots, setP2Slots] = useState<Record<number, ISentence | null>>({
    1: null, 2: null, 3: null, 4: null, 5: null
  });
  const [p3Answers, setP3Answers] = useState<Record<number, string>>({});
  const [p4Answers, setP4Answers] = useState<Record<number, string>>({});

  const [p2Pool, setP2Pool] = useState<ISentence[]>(initialP2Sentences);

  const [draggedItem, setDraggedItem] = useState<ISentence | null>(null);
  const [draggedFromSlot, setDraggedFromSlot] = useState<number | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);

  const [activeQuestionNum, setActiveQuestionNum] = useState<number>(1);
  const activePart = activeQuestionNum <= 5 ? 1 : activeQuestionNum <= 10 ? 2 : activeQuestionNum <= 17 ? 3 : 4;

  const [timeLeft, setTimeLeft] = useState(35 * 60); // 35 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showReport, setShowReport] = useState(false);

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

  const p1AnsweredCount = Object.keys(p1Answers).length;
  const p2AnsweredCount = Object.values(p2Slots).filter(Boolean).length;
  const p3AnsweredCount = Object.keys(p3Answers).length;
  const p4AnsweredCount = Object.keys(p4Answers).length;
  const totalAnsweredCount = p1AnsweredCount + p2AnsweredCount + p3AnsweredCount + p4AnsweredCount;

  const calculateScores = () => {
    const scoreP1 = Object.keys(correctP1).filter(id => p1Answers[Number(id)] === correctP1[Number(id)]).length;
    const scoreP2 = Object.keys(p2Slots).filter(key => {
      const idx = Number(key);
      const slotItem = p2Slots[idx];
      return slotItem && slotItem.id === correctP2[idx - 1];
    }).length;
    const scoreP3 = Object.keys(correctP3).filter(id => p3Answers[Number(id)] === correctP3[Number(id)]).length;
    const scoreP4 = Object.keys(correctP4).filter(id => p4Answers[Number(id)] === correctP4[Number(id)]).length;
    const totalScore = scoreP1 + scoreP2 + scoreP3 + scoreP4;

    return { scoreP1, scoreP2, scoreP3, scoreP4, totalScore };
  };

  const getAptisLevel = (score: number) => {
    if (score < 8) return 'A1/A2 (Dưới trung bình)';
    if (score < 15) return 'B1 (Trung cấp)';
    if (score < 21) return 'B2 (Trung cao cấp)';
    return 'C (Cao cấp)';
  };

  const saveProgressToLocalStorage = (score: number) => {
    const saved = localStorage.getItem('aptis_reading_mock_progress');
    let progressObj: Record<string, number> = {};
    if (saved) {
      try {
        progressObj = JSON.parse(saved);
      } catch (e) { /* bỏ qua lỗi */ }
    }
    const currentBest = progressObj[testId] ?? 0;
    progressObj[testId] = Math.max(currentBest, score);
    localStorage.setItem('aptis_reading_mock_progress', JSON.stringify(progressObj));
  };

  const handleAutoSubmit = () => {
    setIsSubmitted(true);
    setShowReport(true);
    message.warning('Đã hết thời gian làm bài! Hệ thống tự động nộp bài của bạn.');
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
    setP1Answers({});
    setP2Slots({ 1: null, 2: null, 3: null, 4: null, 5: null });
    setP2Pool(initialP2Sentences);
    setP3Answers({});
    setP4Answers({});
    setTimeLeft(35 * 60);
    setIsSubmitted(false);
    setShowReport(false);
    setActiveQuestionNum(1);
  };

  const handleDragStart = (item: ISentence, fromSlot: number | null = null) => {
    if (isSubmitted) return;
    setDraggedItem(item);
    setDraggedFromSlot(fromSlot);
  };

  const handleDragOver = (e: React.DragEvent, slotId: number) => {
    e.preventDefault();
    if (isSubmitted) return;
    setDragOverSlot(slotId);
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  const handleDrop = (slotId: number) => {
    if (isSubmitted || !draggedItem) return;
    setP2Slots(prev => {
      const nextSlots = { ...prev };
      const currentInSlot = nextSlots[slotId];
      if (currentInSlot) {
        setP2Pool(prevPool => [...prevPool, currentInSlot]);
      }
      if (draggedFromSlot !== null) {
        nextSlots[draggedFromSlot] = null;
      } else {
        setP2Pool(prevPool => prevPool.filter(item => item.id !== draggedItem.id));
      }
      nextSlots[slotId] = draggedItem;
      return nextSlots;
    });
    setDraggedItem(null);
    setDraggedFromSlot(null);
    setDragOverSlot(null);
  };

  const handleRemoveFromSlot = (slotId: number, item: ISentence) => {
    if (isSubmitted) return;
    setP2Slots(prev => ({ ...prev, [slotId]: null }));
    setP2Pool(prevPool => [...prevPool, item]);
  };

  const handleAutoPlace = (item: ISentence) => {
    if (isSubmitted) return;
    const firstEmptySlot = Object.keys(p2Slots).find(key => !p2Slots[Number(key)]);
    if (firstEmptySlot) {
      const slotNum = Number(firstEmptySlot);
      setP2Slots(prev => ({ ...prev, [slotNum]: item }));
      setP2Pool(prevPool => prevPool.filter(p => p.id !== item.id));
    }
  };

  const handleNavigateQuestion = (qNum: number) => {
    setActiveQuestionNum(qNum);
  };

  const handlePrevQuestion = () => {
    if (activePart === 2) {
      handleNavigateQuestion(1);
    } else if (activePart === 3) {
      handleNavigateQuestion(6);
    } else if (activePart === 4) {
      handleNavigateQuestion(11);
    }
  };

  const handleNextQuestion = () => {
    if (activePart === 1) {
      handleNavigateQuestion(6);
    } else if (activePart === 2) {
      handleNavigateQuestion(11);
    } else if (activePart === 3) {
      handleNavigateQuestion(18);
    }
  };

  return {
    p1Answers,
    setP1Answers,
    p2Slots,
    setP2Slots,
    p3Answers,
    setP3Answers,
    p4Answers,
    setP4Answers,
    p2Pool,
    activeQuestionNum,
    setActiveQuestionNum,
    activePart,
    timeLeft,
    isSubmitted,
    showReport,
    setShowReport,
    dragOverSlot,
    formatTime,
    p1AnsweredCount,
    p2AnsweredCount,
    p3AnsweredCount,
    p4AnsweredCount,
    totalAnsweredCount,
    calculateScores,
    getAptisLevel,
    handleManualSubmit,
    handleRetry,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemoveFromSlot,
    handleAutoPlace,
    handleNavigateQuestion,
    handlePrevQuestion,
    handleNextQuestion
  };
};
