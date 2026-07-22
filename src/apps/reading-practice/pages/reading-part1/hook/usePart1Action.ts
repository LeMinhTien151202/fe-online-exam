import { message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { mapPart1 } from '../../../services/mappers';
import { flattenExam } from '../../../services/readingExamMapper';
import { usePartPracticeExam, useSubmitExamMutation } from '../../../../../shared/services/student-exam';
import { confirmSubmitExam } from '../../../../../shared/utils/examDialogs';

export const usePart1Action = () => {
  // Luyện theo phần = đề PART_PRACTICE (skill 3, API part 1 — gap fill).
  const { examId, examDetail, isLoading } = usePartPracticeExam(3, 1);
  const questions = useMemo(() => {
    if (!examDetail) return [];
    return flattenExam(examDetail).find((p) => p.partNumber === 1)?.questions ?? [];
  }, [examDetail]);
  const total = questions.length;

  const submitMutation = useSubmitExamMutation();

  const [index, setIndex] = useState(0);
  const safeIndex = total > 0 ? Math.min(index, total - 1) : 0;
  const data = useMemo(() => {
    const q = questions[safeIndex];
    return q ? mapPart1(q) : null;
  }, [questions, safeIndex]);

  const gapCount = data?.questions.length ?? 0;
  const correctAnswers = data?.correctAnswers ?? {};

  const [timeLeft, setTimeLeft] = useState(598); // 09:58
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  // Reading reset đáp án khi đổi bộ, nên lưu riêng các bộ đã nộp để tô bảng câu hỏi.
  const [doneSets, setDoneSets] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (timeLeft <= 0 || isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectChange = (questionId: number, value: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    const answeredCount = Object.keys(answers).length;
    if (gapCount === 0) return;
    if (answeredCount < gapCount) {
      message.warning(`Bạn mới trả lời ${answeredCount}/${gapCount} câu hỏi. Hãy hoàn thành tất cả nhé!`);
      return;
    }
    confirmSubmitExam({ totalQuestions: gapCount, onOk: doSubmit });
  };

  const doSubmit = () => {
    setIsSubmitted(true);
    setDoneSets((prev) => new Set(prev).add(safeIndex));
    const correctCount = Object.keys(correctAnswers).filter(
      (id) => answers[Number(id)] === correctAnswers[Number(id)]
    ).length;

    const progressPercent = Math.round((correctCount / gapCount) * 100);
    const savedProgress = localStorage.getItem('aptis_reading_progress');
    let nextProgress = { r1: progressPercent };
    if (savedProgress) {
      try {
        nextProgress = { ...JSON.parse(savedProgress), r1: progressPercent };
      } catch { /* bỏ qua lỗi */ }
    }
    localStorage.setItem('aptis_reading_progress', JSON.stringify(nextProgress));

    message.success(`Chúc mừng! Bạn đã hoàn thành câu ${safeIndex + 1}. Kết quả: ${correctCount}/${gapCount} câu đúng.`);

    // Nộp lên BE để tăng student_progress (skill 3, part 1). P1 = mảng index đáp án theo từng gap.
    if (examId && data?.questionId != null) {
      const response = data.questions.map((q) => q.options.indexOf(answers[q.id] ?? ''));
      if (response.some((v) => v >= 0)) {
        submitMutation.mutate({ examId, payload: { answers: [{ questionId: data.questionId, response }] } });
      }
    }
  };

  const resetForNewQuestion = () => {
    setAnswers({});
    setIsSubmitted(false);
    setTimeLeft(598);
  };

  const handleRetry = () => resetForNewQuestion();

  // Chuyển sang bộ câu hỏi khác của cùng phần
  const handleNext = () => {
    if (safeIndex >= total - 1) return;
    setIndex(safeIndex + 1);
    resetForNewQuestion();
  };

  const handlePrev = () => {
    if (safeIndex <= 0) return;
    setIndex(safeIndex - 1);
    resetForNewQuestion();
  };

  const goTo = (idx: number) => {
    if (idx === safeIndex) return;
    setIndex(idx);
    resetForNewQuestion();
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = gapCount ? Math.round((answeredCount / gapCount) * 100) : 0;
  const correctCount = Object.keys(correctAnswers).filter(
    (id) => answers[Number(id)] === correctAnswers[Number(id)]
  ).length;

  // Bảng câu hỏi: mỗi bộ (đoạn văn) = 1 nút. Bộ đã nộp -> "đã trả lời"; bộ đang làm dở -> "làm dở".
  const boardItems = Array.from({ length: total }, (_, i) => {
    const status: 'unanswered' | 'partial' | 'answered' = doneSets.has(i)
      ? 'answered'
      : i === safeIndex && answeredCount > 0
        ? 'partial'
        : 'unanswered';
    return { key: i, label: i + 1, status };
  });

  return {
    isLoading,
    data,
    gapCount,
    correctAnswers,
    total,
    currentNumber: total > 0 ? safeIndex + 1 : 0,
    hasNext: safeIndex < total - 1,
    hasPrev: safeIndex > 0,
    handleNext,
    handlePrev,
    goTo,
    boardItems,
    activeSetIndex: safeIndex,
    timeLeft,
    answers,
    isSubmitted,
    handleSelectChange,
    handleSubmit,
    handleRetry,
    answeredCount,
    progressPercent,
    correctCount,
    formatTime,
  };
};
