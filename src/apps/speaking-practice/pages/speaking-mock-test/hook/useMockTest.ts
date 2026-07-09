import { useNavigate, useParams } from '@tanstack/react-router';
import { Modal, message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SpeakingSet } from '../../../services/mappers';
import { useSpeakingExamDetailQuery } from '../../../services/speakingExamQuery';
import { buildSpeakingExam } from '../../../services/speakingExamMapper';

export interface SpeakingNavItem {
  qNum: number;
  partNumber: number;
  setIndex: number;
  subIndex: number;
}

const keyOf = (partNumber: number, setIndex: number, subIndex: number) =>
  `p${partNumber}-${setIndex}-${subIndex}`;

export const useMockTest = () => {
  const { testId } = useParams({ strict: false }) as { testId: string };
  const examId = Number(testId);
  const navigate = useNavigate();
  const { data: examDetail, isLoading, isError } = useSpeakingExamDetailQuery(examId || null);

  const examData = useMemo(() => (examDetail ? buildSpeakingExam(examDetail) : null), [examDetail]);

  const navItems = useMemo<SpeakingNavItem[]>(() => {
    if (!examData) return [];
    const items: SpeakingNavItem[] = [];

    examData.part1.forEach((_, index) => {
      items.push({ qNum: items.length + 1, partNumber: 1, setIndex: 0, subIndex: index + 1 });
    });

    const pushSetQuestions = (partNumber: number, sets: SpeakingSet[]) => {
      sets.forEach((set, setIndex) => {
        set.questions.forEach((_, questionIndex) => {
          items.push({
            qNum: items.length + 1,
            partNumber,
            setIndex,
            subIndex: questionIndex + 1,
          });
        });
      });
    };

    pushSetQuestions(2, examData.part2);
    pushSetQuestions(3, examData.part3);
    pushSetQuestions(4, examData.part4);
    return items;
  }, [examData]);

  const totalQuestions = navItems.length;

  const [activePart, setActivePart] = useState(1);
  const [activeSetIndex, setActiveSetIndex] = useState(0);
  const [activeSubIndex, setActiveSubIndex] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showSampleMap, setShowSampleMap] = useState<Record<string, boolean>>({});

  const availableParts = useMemo(
    () => Array.from(new Set(navItems.map((item) => item.partNumber))).sort((a, b) => a - b),
    [navItems]
  );

  const activeNav = useMemo(() => {
    return navItems.find(
      (item) =>
        item.partNumber === activePart &&
        item.setIndex === activeSetIndex &&
        item.subIndex === activeSubIndex
    ) ?? navItems.find((item) => item.partNumber === activePart) ?? navItems[0] ?? null;
  }, [activePart, activeSetIndex, activeSubIndex, navItems]);

  const activeQuestionNum = activeNav?.qNum ?? 1;
  const activeNavIndex = activeNav ? navItems.findIndex((item) => item.qNum === activeNav.qNum) : -1;
  const prevNavItem = activeNavIndex > 0 ? navItems[activeNavIndex - 1] : null;
  const nextNavItem = activeNavIndex >= 0 && activeNavIndex < navItems.length - 1 ? navItems[activeNavIndex + 1] : null;
  const hasPrevStep = !!prevNavItem;
  const hasNextStep = !!nextNavItem;
  const prevStepIsSamePart = !!prevNavItem && prevNavItem.partNumber === activePart;
  const nextStepIsSamePart = !!nextNavItem && nextNavItem.partNumber === activePart;

  const answeredCount = useMemo(
    () => navItems.filter((item) => answers[keyOf(item.partNumber, item.setIndex, item.subIndex)]).length,
    [answers, navItems]
  );

  const saveProgressToLocalStorage = useCallback(() => {
    const saved = localStorage.getItem('aptis_speaking_mock_progress');
    let progressObj: Record<string, number> = {};
    if (saved) {
      try {
        progressObj = JSON.parse(saved);
      } catch {
        progressObj = {};
      }
    }
    progressObj[testId] = 100;
    localStorage.setItem('aptis_speaking_mock_progress', JSON.stringify(progressObj));
  }, [testId]);

  const handleAutoSubmit = useCallback(() => {
    setIsSubmitted(true);
    setShowReport(true);
    message.warning('Đã hết thời gian làm bài! Hệ thống tự động nộp bài.');
    saveProgressToLocalStorage();
  }, [saveProgressToLocalStorage]);

  useEffect(() => {
    if (timeLeft <= 0 || isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.setTimeout(handleAutoSubmit, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [handleAutoSubmit, isSubmitted, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const jumpTo = (item: SpeakingNavItem) => {
    setActivePart(item.partNumber);
    setActiveSetIndex(item.setIndex);
    setActiveSubIndex(item.subIndex);
  };

  const handleNavigateQuestion = (qNum: number) => {
    const item = navItems.find((nav) => nav.qNum === qNum);
    if (item) jumpTo(item);
  };

  const firstItemForPart = (partNumber: number) =>
    navItems.find((item) => item.partNumber === partNumber) ?? null;

  const handlePrevQuestion = () => {
    const idx = availableParts.indexOf(activePart);
    if (idx > 0) {
      const item = firstItemForPart(availableParts[idx - 1]);
      if (item) jumpTo(item);
    }
  };

  const handleNextQuestion = () => {
    const idx = availableParts.indexOf(activePart);
    if (idx >= 0 && idx < availableParts.length - 1) {
      const item = firstItemForPart(availableParts[idx + 1]);
      if (item) jumpTo(item);
    }
  };

  const handlePrevStep = () => {
    if (prevNavItem) jumpTo(prevNavItem);
  };

  const handleNextStep = () => {
    if (nextNavItem) jumpTo(nextNavItem);
  };

  const handleSubTabChange = (subIndex: number) => {
    setActiveSubIndex(subIndex);
  };

  const markRecorded = (audioUrl: string | null) => {
    const value = audioUrl || 'recorded_mock';
    if (activePart === 4) {
      const part4Items = navItems.filter(
        (item) => item.partNumber === 4 && item.setIndex === activeSetIndex
      );
      setAnswers((prev) => {
        const next = { ...prev };
        part4Items.forEach((item) => {
          next[keyOf(item.partNumber, item.setIndex, item.subIndex)] = value;
        });
        return next;
      });
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [keyOf(activePart, activeSetIndex, activeSubIndex)]: value,
    }));
  };

  const isSubDone = (partNumber: number, setIndex: number, subIndex: number) =>
    !!answers[keyOf(partNumber, setIndex, subIndex)];

  const handleManualSubmit = () => {
    setIsSubmitted(true);
    setShowReport(true);
    message.success('Bạn đã nộp bài thi nói thành công!');
    saveProgressToLocalStorage();
  };

  const handleRetry = () => {
    setAnswers({});
    setTimeLeft(20 * 60);
    setIsSubmitted(false);
    setShowReport(false);
    setActivePart(1);
    setActiveSetIndex(0);
    setActiveSubIndex(1);
    setShowSampleMap({});
  };

  const handleBackToLanding = () => {
    if (isSubmitted) {
      navigate({ to: '/speaking' });
      return;
    }
    Modal.confirm({
      title: 'Xác nhận thoát khỏi đề thi?',
      content: 'Tiến độ làm bài nói của bạn sẽ không được lưu nếu bạn thoát ra lúc này.',
      okText: 'Thoát ra',
      cancelText: 'Làm tiếp',
      onOk: () => navigate({ to: '/speaking' }),
    });
  };

  const handleSubmitClick = () => {
    const unansweredCount = totalQuestions - answeredCount;
    Modal.confirm({
      title: 'Xác nhận nộp bài thi nói?',
      content: unansweredCount > 0
        ? `Bạn còn ${unansweredCount} câu hỏi chưa trả lời ghi âm. Bạn có thực sự muốn nộp bài ngay bây giờ không?`
        : `Bạn đã hoàn thành ghi âm toàn bộ ${totalQuestions} câu hỏi. Bạn có chắc chắn muốn nộp bài không?`,
      okText: 'Nộp bài',
      cancelText: 'Làm tiếp',
      onOk: handleManualSubmit,
    });
  };

  const toggleSample = (key: string) => {
    setShowSampleMap((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return {
    isLoading,
    isError,
    testTitle: examDetail?.title ?? 'Đề thi Nói',
    examData,
    navItems,
    totalQuestions,
    answers,
    timeLeft,
    isSubmitted,
    showReport,
    setShowReport,
    showSampleMap,
    activeQuestionNum,
    activePart,
    activeSetIndex,
    activeSubIndex,
    availableParts,
    formatTime,
    answeredCount,
    handleRetry,
    handleBackToLanding,
    handleNavigateQuestion,
    handlePrevQuestion,
    handleNextQuestion,
    handlePrevStep,
    handleNextStep,
    handleSubmitClick,
    toggleSample,
    markRecorded,
    isSubDone,
    handleSubTabChange,
    hasPrevStep,
    hasNextStep,
    prevStepIsSamePart,
    nextStepIsSamePart,
    navigate,
  };
};
