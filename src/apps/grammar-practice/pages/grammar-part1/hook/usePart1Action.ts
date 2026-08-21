import { useMemo, useState } from 'react';
import { toast } from '../../../../../configs/toast';
import { flattenGrammarExam } from '../../../services/grammarExamMapper';
import { mapGrammarQuestions } from '../../../services/mappers';
import {
  pickCorrectResponse,
  summarizeAutoGrade,
  usePartPracticeExam,
  useSubmitExamMutation,
} from '../../../../../shared/services/student-exam';
import { confirmSubmitExam } from '../../../../../shared/utils/examDialogs';

export const usePart1Action = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  // Chấm từng câu: kết quả BE trả về của câu nào lưu theo questionNumber câu đó.
  const [results, setResults] = useState<Record<number, { earned: number; total: number }>>({});
  // Đáp án đúng do BE trả kèm kết quả chấm (đề lấy về đã bị cắt sạch đáp án).
  const [gradedIndexes, setGradedIndexes] = useState<Record<number, number>>({});

  // Luyện theo phần = đề PART_PRACTICE (skill 1, part 1 — Grammar MC).
  const { examId, examDetail, isLoading } = usePartPracticeExam(1, 1);
  const questions = useMemo(() => {
    if (!examDetail) return [];
    const part = flattenGrammarExam(examDetail).find((p) => p.partNumber === 1);
    return mapGrammarQuestions(part?.questions ?? []);
  }, [examDetail]);
  const total = questions.length;

  const submitMutation = useSubmitExamMutation();

  const safeIndex = total > 0 ? Math.min(currentQuestionIndex, total) : 1;
  const currentQuestion = questions[safeIndex - 1] ?? null;
  const scoreResult = results[safeIndex] ?? null;
  const isSubmitted = scoreResult != null;

  const selectAnswer = (questionNumber: number, value: string) => {
    if (results[questionNumber]) return;
    setAnswers((prev) => ({ ...prev, [questionNumber]: value }));
  };

  const handleNextQuestion = () => { if (safeIndex < total) setCurrentQuestionIndex(safeIndex + 1); };
  const handlePrevQuestion = () => { if (safeIndex > 1) setCurrentQuestionIndex(safeIndex - 1); };

  const handleSubmitClick = () => {
    if (isSubmitted) return;
    if (!answers[safeIndex]) {
      toast.warning('Bạn chưa chọn đáp án cho câu này.');
      return;
    }
    confirmSubmitExam({ totalQuestions: 1, onOk: doSubmit });
  };

  // Nộp RIÊNG câu đang làm để BE chấm và trả điểm ngay (giống luyện theo phần của Reading).
  // Grammar P1 = MC, response là index 0-based của đáp án đã chọn.
  const doSubmit = async () => {
    if (!examId || !currentQuestion || currentQuestion.questionId == null) return;
    const response = currentQuestion.options.indexOf(answers[safeIndex]);
    if (response < 0) return;

    try {
      const result = await submitMutation.mutateAsync({
        examId,
        payload: { answers: [{ questionId: currentQuestion.questionId, response }] },
      });
      const score = summarizeAutoGrade(result, { questionId: currentQuestion.questionId });
      setResults((prev) => ({ ...prev, [safeIndex]: score }));
      const correct = pickCorrectResponse(result, currentQuestion.questionId);
      if (typeof correct === 'number') setGradedIndexes((prev) => ({ ...prev, [safeIndex]: correct }));
      toast.success(`Đã chấm xong câu ${safeIndex}: ${score.earned}/${score.total} câu đúng.`);
    } catch {
      // Interceptor axios đã hiện thông báo lỗi; không tự chấm ở FE để tránh sai điểm.
    }
  };

  // Làm lại đúng câu này: bỏ kết quả + đáp án đã chọn để mở khoá lựa chọn.
  const handleRetry = () => {
    setResults((prev) => {
      const next = { ...prev };
      delete next[safeIndex];
      return next;
    });
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[safeIndex];
      return next;
    });
    setGradedIndexes((prev) => {
      const next = { ...prev };
      delete next[safeIndex];
      return next;
    });
  };

  const gradedCount = Object.keys(results).length;
  const progressPercent = total > 0 ? Math.round((gradedCount / total) * 100) : 0;

  return {
    isLoading,
    questions,
    total,
    answers,
    results,
    currentQuestionIndex: safeIndex,
    setCurrentQuestionIndex,
    currentQuestion,
    selectAnswer,
    handleNextQuestion,
    handlePrevQuestion,
    handleSubmitClick,
    handleRetry,
    isSubmitted,
    isGrading: submitMutation.isPending,
    correctCount: scoreResult?.earned ?? 0,
    correctIndex: gradedIndexes[safeIndex] ?? -1,
    scoreTotal: scoreResult?.total ?? 0,
    gradedCount,
    progressPercent,
    totalAnswered: Object.keys(answers).length,
  };
};
