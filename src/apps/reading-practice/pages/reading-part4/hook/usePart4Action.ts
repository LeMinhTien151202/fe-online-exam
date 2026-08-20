import { useMemo, useState } from 'react';
import { toast } from '../../../../../configs/toast';
import { mapPart4, Part4Data } from '../../../services/mappers';
import { flattenExam } from '../../../services/readingExamMapper';
import { summarizeAutoGrade, usePartPracticeExam, useSubmitExamMutation } from '../../../../../shared/services/student-exam';
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

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [doneSets, setDoneSets] = useState<Set<number>>(new Set());
  const [scoreResult, setScoreResult] = useState<{ earned: number; total: number } | null>(null);

  const resetForNewQuestion = () => {
    setAnswers({});
    setIsSubmitted(false);
    setScoreResult(null);
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

  const handleSelectChange = (paragraphNum: number, value: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [paragraphNum]: value }));
  };

  const handleSubmit = () => {
    const answeredCount = Object.keys(answers).length;
    if (paragraphCount === 0) return;
    if (answeredCount < paragraphCount) {
      toast.warning(`Bạn đã trả lời ${answeredCount}/${paragraphCount} tiêu đề. Vui lòng gán tiêu đề cho cả ${paragraphCount} đoạn văn!`);
      return;
    }
    confirmSubmitExam({ totalQuestions: paragraphCount, onOk: doSubmit });
  };

  const doSubmit = async () => {
    setIsSubmitted(true);
    // Nộp lên BE để tăng student_progress (skill 3, part 5). HEADING = { paragraph_num: heading_label }.
    if (examId && data?.questionId != null) {
      const labelByValue = new Map(data.headings.map((h) => [h.value, h.label]));
      const response: Record<string, string> = {};
      data.paragraphs.forEach((pg) => {
        const val = answers[pg.num];
        if (val != null) response[String(pg.num)] = labelByValue.get(val) ?? val;
      });
      if (Object.keys(response).length > 0) {
        try {
          const result = await submitMutation.mutateAsync({
            examId,
            payload: { answers: [{ questionId: data.questionId, response }] },
          });
          const score = summarizeAutoGrade(result, { skillId: 3, partNumber: 5 });
          setScoreResult(score);
          setDoneSets((prev) => new Set(prev).add(safeIndex));
          toast.success(`Chúc mừng! Bạn đã hoàn thành Part 4. Kết quả: ${score.earned}/${score.total} câu đúng.`);
        } catch {
          setIsSubmitted(false);
        }
      }
    }
  };

  const handleRetry = () => resetForNewQuestion();

  const answeredCount = Object.keys(answers).length;
  const progressPercent = paragraphCount ? Math.round((answeredCount / paragraphCount) * 100) : 0;
  const correctCount = scoreResult?.earned ?? 0;

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
    paragraphCount,
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
