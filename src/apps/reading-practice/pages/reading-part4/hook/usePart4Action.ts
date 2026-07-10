import { message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { mapPart4, Part4Data } from '../../../services/mappers';
import { flattenExam } from '../../../services/readingExamMapper';
import { usePartPracticeExam, useSubmitExamMutation } from '../../../../../shared/services/student-exam';
import { confirmSubmitExam } from '../../../../../shared/utils/examDialogs';

export const usePart4Action = () => {
  // Luyện theo phần = đề PART_PRACTICE (skill 3, API part 5 — heading match).
  const { examId, examDetail, isLoading } = usePartPracticeExam(3, 5);
  const list = useMemo(() => {
    if (!examDetail) return [];
    return flattenExam(examDetail).find((p) => p.partNumber === 5)?.questions ?? [];
  }, [examDetail]);
  const total = list.length;

  const submitMutation = useSubmitExamMutation();
  const [index, setIndex] = useState(0);
  const safeIndex = total > 0 ? Math.min(index, total - 1) : 0;
  const data: Part4Data | null = useMemo(() => {
    const q = list[safeIndex];
    return q ? mapPart4(q) : null;
  }, [list, safeIndex]);

  const paragraphCount = data?.paragraphs.length ?? 0;
  const correctAnswers = data?.correctAnswers ?? {};

  const [timeLeft, setTimeLeft] = useState(900);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleSelectChange = (paragraphNum: number, value: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [paragraphNum]: value }));
  };

  const handleSubmit = () => {
    const answeredCount = Object.keys(answers).length;
    if (paragraphCount === 0) return;
    if (answeredCount < paragraphCount) {
      message.warning(`Bạn đã trả lời ${answeredCount}/${paragraphCount} tiêu đề. Vui lòng gán tiêu đề cho cả ${paragraphCount} đoạn văn!`);
      return;
    }
    confirmSubmitExam({ totalQuestions: paragraphCount, onOk: doSubmit });
  };

  const doSubmit = () => {
    setIsSubmitted(true);
    const correctCount = Object.keys(correctAnswers).filter(
      (id) => answers[Number(id)] === correctAnswers[Number(id)]
    ).length;

    const progressPercent = Math.round((correctCount / paragraphCount) * 100);
    const savedProgress = localStorage.getItem('aptis_reading_progress');
    let nextProgress = { r4: progressPercent };
    if (savedProgress) {
      try {
        nextProgress = { ...JSON.parse(savedProgress), r4: progressPercent };
      } catch { /* bỏ qua lỗi */ }
    }
    localStorage.setItem('aptis_reading_progress', JSON.stringify(nextProgress));

    message.success(`Chúc mừng! Bạn đã hoàn thành Part 4. Kết quả: ${correctCount}/${paragraphCount} câu đúng.`);

    // Nộp lên BE để tăng student_progress (skill 3, part 5). HEADING = { paragraph_num: heading_label }.
    if (examId && data?.questionId != null) {
      const labelByValue = new Map(data.headings.map((h) => [h.value, h.label]));
      const response: Record<string, string> = {};
      data.paragraphs.forEach((pg) => {
        const val = answers[pg.num];
        if (val != null) response[String(pg.num)] = labelByValue.get(val) ?? val;
      });
      if (Object.keys(response).length > 0) {
        submitMutation.mutate({ examId, payload: { answers: [{ questionId: data.questionId, response }] } });
      }
    }
  };

  const handleRetry = () => resetForNewQuestion();

  const answeredCount = Object.keys(answers).length;
  const progressPercent = paragraphCount ? Math.round((answeredCount / paragraphCount) * 100) : 0;
  const correctCount = Object.keys(correctAnswers).filter(
    (id) => answers[Number(id)] === correctAnswers[Number(id)]
  ).length;

  return {
    isLoading,
    data,
    paragraphCount,
    correctAnswers,
    total,
    currentNumber: total > 0 ? safeIndex + 1 : 0,
    hasNext: safeIndex < total - 1,
    hasPrev: safeIndex > 0,
    handleNext,
    handlePrev,
    timeLeft,
    answers,
    isSubmitted,
    handleSelectChange,
    handleSubmit,
    handleRetry,
    answeredCount,
    progressPercent,
    correctCount,
    formatTime
  };
};
