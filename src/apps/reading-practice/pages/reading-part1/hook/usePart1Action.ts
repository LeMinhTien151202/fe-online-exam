import { useMemo, useState } from 'react';
import { toast } from '../../../../../configs/toast';
import { mapPart1 } from '../../../services/mappers';
import { flattenExam } from '../../../services/readingExamMapper';
import { summarizeAutoGrade, usePartPracticeExam, useSubmitExamMutation } from '../../../../../shared/services/student-exam';
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

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState<{ earned: number; total: number } | null>(null);
  // Reading reset đáp án khi đổi bộ, nên lưu riêng các bộ đã nộp để tô bảng câu hỏi.
  const [doneSets, setDoneSets] = useState<Set<number>>(new Set());

  const handleSelectChange = (questionId: number, value: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    const answeredCount = Object.keys(answers).length;
    if (gapCount === 0) return;
    if (answeredCount < gapCount) {
      toast.warning(`Bạn mới trả lời ${answeredCount}/${gapCount} câu hỏi. Hãy hoàn thành tất cả nhé!`);
      return;
    }
    confirmSubmitExam({ totalQuestions: gapCount, onOk: doSubmit });
  };

  const doSubmit = async () => {
    // Nộp lên BE để tăng student_progress (skill 3, part 1). P1 = mảng index đáp án theo từng gap.
    if (examId && data?.questionId != null) {
      const response = data.questions.map((q) => q.options.indexOf(answers[q.id] ?? ''));
      if (response.some((v) => v >= 0)) {
        setIsSubmitted(true);
        try {
          const result = await submitMutation.mutateAsync({
            examId,
            payload: { answers: [{ questionId: data.questionId, response }] },
          });
          const score = summarizeAutoGrade(result, { skillId: 3, partNumber: 1 });
          setScoreResult(score);
          setDoneSets((prev) => new Set(prev).add(safeIndex));
          toast.success(`Chúc mừng! Bạn đã hoàn thành câu ${safeIndex + 1}. Kết quả: ${score.earned}/${score.total} câu đúng.`);
        } catch {
          setIsSubmitted(false);
        }
      }
    }
  };

  const resetForNewQuestion = () => {
    setAnswers({});
    setIsSubmitted(false);
    setScoreResult(null);
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
  const correctCount = scoreResult?.earned ?? 0;

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
    hasAnswerReview: Object.keys(correctAnswers).length > 0,
    total,
    currentNumber: total > 0 ? safeIndex + 1 : 0,
    hasNext: safeIndex < total - 1,
    hasPrev: safeIndex > 0,
    handleNext,
    handlePrev,
    goTo,
    boardItems,
    activeSetIndex: safeIndex,
    answers,
    isSubmitted,
    handleSelectChange,
    handleSubmit,
    handleRetry,
    answeredCount,
    progressPercent,
    correctCount,
  };
};
