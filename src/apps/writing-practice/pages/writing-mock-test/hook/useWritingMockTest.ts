import { message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { countWords } from '../../../utils/wordCounter';
import { useWritingExamDetailQuery } from '../../../services/writingExamQuery';
import { buildWritingPrompts } from '../../../services/writingExamMapper';

export const useWritingMockTest = (testId: string) => {
  const examId = Number(testId);
  const { data: examDetail, isLoading, isError } = useWritingExamDetailQuery(examId || null);

  const prompts = useMemo(() => (examDetail ? buildWritingPrompts(examDetail) : []), [examDetail]);
  const totalQuestions = prompts.length;

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(50 * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [activePart, setActivePart] = useState(1);
  const [showSampleMap, setShowSampleMap] = useState<Record<number, boolean>>({});

  const availableParts = useMemo(
    () => Array.from(new Set(prompts.map((prompt) => prompt.partNumber))).sort((a, b) => a - b),
    [prompts]
  );
  const activePartPrompts = useMemo(
    () => prompts.filter((prompt) => prompt.partNumber === activePart),
    [activePart, prompts]
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = useMemo(
    () => prompts.filter((prompt) => answers[prompt.id]?.trim()).length,
    [answers, prompts]
  );

  const saveProgressToLocalStorage = useCallback(() => {
    const saved = localStorage.getItem('aptis_writing_mock_progress');
    let progressObj: Record<string, number> = {};
    if (saved) {
      try {
        progressObj = JSON.parse(saved);
      } catch {
        progressObj = {};
      }
    }
    progressObj[testId] = 100;
    localStorage.setItem('aptis_writing_mock_progress', JSON.stringify(progressObj));
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

  const handleManualSubmit = () => {
    setIsSubmitted(true);
    setShowReport(true);
    message.success('Bạn đã nộp bài thi viết thành công!');
    saveProgressToLocalStorage();
  };

  const handleRetry = () => {
    setAnswers({});
    setTimeLeft(50 * 60);
    setIsSubmitted(false);
    setShowReport(false);
    setActivePart(1);
    setShowSampleMap({});
  };

  const handleAnswerChange = (questionId: number, value: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handlePrevPart = () => {
    const idx = availableParts.indexOf(activePart);
    if (idx > 0) setActivePart(availableParts[idx - 1]);
  };

  const handleNextPart = () => {
    const idx = availableParts.indexOf(activePart);
    if (idx >= 0 && idx < availableParts.length - 1) {
      setActivePart(availableParts[idx + 1]);
    }
  };

  const getWordCount = (questionId: number) => countWords(answers[questionId]);

  const isWordCountValid = (questionId: number) => {
    const prompt = prompts.find((item) => item.id === questionId);
    if (!prompt) return false;
    const wordCount = getWordCount(questionId);
    return wordCount >= prompt.minWords && wordCount <= prompt.maxWords;
  };

  const toggleSample = (questionId: number) => {
    setShowSampleMap((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  return {
    isLoading,
    isError,
    examTitle: examDetail?.title ?? 'Đề thi Viết',
    prompts,
    totalQuestions,
    activePart,
    activePartPrompts,
    availableParts,
    answers,
    answeredCount,
    timeLeft,
    isSubmitted,
    showReport,
    showSampleMap,
    setShowReport,
    setActivePart,
    handleAnswerChange,
    handlePrevPart,
    handleNextPart,
    handleManualSubmit,
    handleRetry,
    toggleSample,
    getWordCount,
    isWordCountValid,
    formatTime,
  };
};
