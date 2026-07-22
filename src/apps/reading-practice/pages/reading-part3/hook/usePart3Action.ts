import { message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { mapPart3, Part3Data } from '../../../services/mappers';
import { flattenExam } from '../../../services/readingExamMapper';
import { usePartPracticeExam, useSubmitExamMutation } from '../../../../../shared/services/student-exam';
import { confirmSubmitExam } from '../../../../../shared/utils/examDialogs';

export const usePart3Action = () => {
  // Luyện theo phần = đề PART_PRACTICE (skill 3, API part 4 — opinion/speaker match).
  const { examId, examDetail, isLoading } = usePartPracticeExam(3, 4);
  const list = useMemo(() => {
    if (!examDetail) return [];
    return flattenExam(examDetail).find((p) => p.partNumber === 4)?.questions ?? [];
  }, [examDetail]);
  const total = list.length;

  const submitMutation = useSubmitExamMutation();
  const [index, setIndex] = useState(0);
  const safeIndex = total > 0 ? Math.min(index, total - 1) : 0;
  const data: Part3Data | null = useMemo(() => {
    const q = list[safeIndex];
    return q ? mapPart3(q) : null;
  }, [list, safeIndex]);

  const questionCount = data?.questions.length ?? 0;
  const correctAnswers = data?.correctAnswers ?? {};

  const [timeLeft, setTimeLeft] = useState(900);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [doneSets, setDoneSets] = useState<Set<number>>(new Set());

  const resetForNewQuestion = () => {
    setAnswers({});
    setIsSubmitted(false);
    setTimeLeft(900);
  };
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

  useEffect(() => {
    if (timeLeft <= 0 || isSubmitted) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRadioChange = (questionId: number, val: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: val }));
  };

  const handleSubmit = () => {
    const answeredCount = Object.keys(answers).length;
    if (questionCount === 0) return;
    if (answeredCount < questionCount) {
      message.warning(`Bạn đã trả lời ${answeredCount}/${questionCount} ý kiến. Vui lòng chọn đáp án cho tất cả các câu!`);
      return;
    }
    confirmSubmitExam({ totalQuestions: questionCount, onOk: doSubmit });
  };

  const doSubmit = () => {
    setIsSubmitted(true);
    setDoneSets((prev) => new Set(prev).add(safeIndex));
    const correctCount = Object.keys(correctAnswers).filter(
      (id) => answers[Number(id)] === correctAnswers[Number(id)]
    ).length;

    const progressPercent = Math.round((correctCount / questionCount) * 100);
    const savedProgress = localStorage.getItem('aptis_reading_progress');
    let nextProgress = { r3: progressPercent };
    if (savedProgress) {
      try {
        nextProgress = { ...JSON.parse(savedProgress), r3: progressPercent };
      } catch { /* bỏ qua lỗi */ }
    }
    localStorage.setItem('aptis_reading_progress', JSON.stringify(nextProgress));

    message.success(`Chúc mừng! Bạn đã hoàn thành Part 3. Kết quả: ${correctCount}/${questionCount} câu đúng.`);

    // Nộp lên BE để tăng student_progress (skill 3, part 4). SPEAKER_MATCH = mảng person key theo từng ý.
    if (examId && data?.questionId != null) {
      const response = data.questions.map((q) => answers[q.id] ?? '');
      if (response.some((v) => v !== '')) {
        submitMutation.mutate({ examId, payload: { answers: [{ questionId: data.questionId, response }] } });
      }
    }
  };

  const handleRetry = () => resetForNewQuestion();

  const answeredCount = Object.keys(answers).length;
  const progressPercent = questionCount ? Math.round((answeredCount / questionCount) * 100) : 0;
  const correctCount = Object.keys(correctAnswers).filter(
    (id) => answers[Number(id)] === correctAnswers[Number(id)]
  ).length;

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
    questionCount,
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
    handleRadioChange,
    handleSubmit,
    handleRetry,
    answeredCount,
    progressPercent,
    correctCount,
    formatTime
  };
};
