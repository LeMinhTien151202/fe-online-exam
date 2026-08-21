import { useMemo, useState } from 'react';
import { toast } from '../../../../../configs/toast';
import { mapPart3, Part3Data } from '../../../services/mappers';
import { flattenExam } from '../../../services/readingExamMapper';
import {
  pickCorrectResponse,
  summarizeAutoGrade,
  usePartPracticeExam,
  useSubmitExamMutation,
} from '../../../../../shared/services/student-exam';
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

  // Đáp án đúng do BE trả kèm kết quả chấm (đề lấy về đã bị cắt sạch đáp án).
  const [gradedAnswers, setGradedAnswers] = useState<Record<number, string>>({});
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [doneSets, setDoneSets] = useState<Set<number>>(new Set());
  const [scoreResult, setScoreResult] = useState<{ earned: number; total: number } | null>(null);

  const resetForNewQuestion = () => {
    setAnswers({});
    setIsSubmitted(false);
    setScoreResult(null);
    setGradedAnswers({});
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

  const handleRadioChange = (questionId: number, val: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: val }));
  };

  const handleSubmit = () => {
    const answeredCount = Object.keys(answers).length;
    if (questionCount === 0) return;
    if (answeredCount < questionCount) {
      toast.warning(`Bạn đã trả lời ${answeredCount}/${questionCount} ý kiến. Vui lòng chọn đáp án cho tất cả các câu!`);
      return;
    }
    confirmSubmitExam({ totalQuestions: questionCount, onOk: doSubmit });
  };

  const doSubmit = async () => {
    setIsSubmitted(true);
    // Nộp lên BE để tăng student_progress (skill 3, part 4). SPEAKER_MATCH = mảng person key theo từng ý.
    if (examId && data?.questionId != null) {
      const response = data.questions.map((q) => answers[q.id] ?? '');
      if (response.some((v) => v !== '')) {
        try {
          const result = await submitMutation.mutateAsync({
            examId,
            payload: { answers: [{ questionId: data.questionId, response }] },
          });
          const score = summarizeAutoGrade(result, { questionId: data.questionId });
          setScoreResult(score);
          // SPEAKER_MATCH: đáp án đúng là mảng person key theo đúng thứ tự ý kiến.
          const correct = pickCorrectResponse(result, data.questionId);
          if (Array.isArray(correct)) {
            setGradedAnswers(
              Object.fromEntries(
                data.questions
                  .map((q, i) => [q.id, String(correct[i] ?? '')] as const)
                  .filter((entry) => !!entry[1])
              )
            );
          }
          setDoneSets((prev) => new Set(prev).add(safeIndex));
          toast.success(`Đã chấm xong câu ${safeIndex + 1}: ${score.earned}/${score.total} câu đúng.`);
        } catch {
          setIsSubmitted(false);
        }
      }
    }
  };

  const handleRetry = () => resetForNewQuestion();

  const answeredCount = Object.keys(answers).length;
  const progressPercent = questionCount ? Math.round((answeredCount / questionCount) * 100) : 0;
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
    questionCount,
    correctAnswers: gradedAnswers,
    hasAnswerReview: Object.keys(gradedAnswers).length > 0,
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
    handleRadioChange,
    handleSubmit,
    handleRetry,
    answeredCount,
    progressPercent,
    correctCount,
  };
};
