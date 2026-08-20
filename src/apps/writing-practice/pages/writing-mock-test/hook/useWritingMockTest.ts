import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from '../../../../../configs/toast';
import {
  IExamSubmitResult,
  ISubmitAnswer,
  useAttemptReviewQuery,
  useSubmitExamMutation,
} from '../../../../../shared/services/student-exam';
import { countWords } from '../../../utils/wordCounter';
import { useWritingExamDetailQuery } from '../../../services/writingExamQuery';
import { buildWritingPrompts } from '../../../services/writingExamMapper';

export const useWritingMockTest = (testId: string) => {
  const examId = Number(testId);
  const { data: examDetail, isLoading, isError } = useWritingExamDetailQuery(examId || null);
  const [reviewAttemptId, setReviewAttemptId] = useState<number | null>(null);
  const { data: reviewDetail } = useAttemptReviewQuery(reviewAttemptId);

  const prompts = useMemo(() => {
    const detail = reviewDetail ?? examDetail;
    return detail ? buildWritingPrompts(detail) : [];
  }, [examDetail, reviewDetail]);
  const totalQuestions = prompts.length;
  const submitMutation = useSubmitExamMutation();

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(50 * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [activePart, setActivePart] = useState(1);
  const [showSampleMap, setShowSampleMap] = useState<Record<number, boolean>>({});
  const [submitResult, setSubmitResult] = useState<IExamSubmitResult | null>(null);

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

  // Gom prompt theo questionId (1 câu DB có thể sinh nhiều prompt) -> response là mảng
  // bài viết theo đúng thứ tự subIndex. ESSAY: AI chấm và trả kết quả ngay.
  const collectAnswers = useCallback((): ISubmitAnswer[] => {
    const byQuestion = new Map<number, { subIndex: number; text: string }[]>();
    prompts.forEach((p) => {
      if (p.questionId == null) return;
      const list = byQuestion.get(p.questionId) ?? [];
      list.push({ subIndex: p.subIndex ?? 0, text: answers[p.id]?.trim() ?? '' });
      byQuestion.set(p.questionId, list);
    });
    const result: ISubmitAnswer[] = [];
    byQuestion.forEach((items, questionId) => {
      const response = [...items].sort((a, b) => a.subIndex - b.subIndex).map((i) => i.text);
      if (response.some((v) => v !== '')) result.push({ questionId, response });
    });
    return result;
  }, [answers, prompts]);

  const submitToServer = useCallback(async () => {
    if (!examId) return;
    try {
      const result = await submitMutation.mutateAsync({ examId, payload: { answers: collectAnswers() } });
      setSubmitResult(result);
      setReviewAttemptId(result.attemptId);
    } catch {
      // Interceptor đã hiện notification lỗi.
    }
  }, [collectAnswers, examId, submitMutation]);

  const handleAutoSubmit = useCallback(() => {
    setIsSubmitted(true);
    setShowReport(true);
    toast.warning('Đã hết thời gian làm bài! Hệ thống tự động nộp bài.');
    submitToServer();
  }, [submitToServer]);

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
    toast.success('Bạn đã nộp bài thi viết thành công!');
    submitToServer();
  };

  const handleRetry = () => {
    setAnswers({});
    setTimeLeft(50 * 60);
    setIsSubmitted(false);
    setShowReport(false);
    setActivePart(1);
    setShowSampleMap({});
    setSubmitResult(null);
    setReviewAttemptId(null);
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
    submitResult,
    isSubmitting: submitMutation.isPending,
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
