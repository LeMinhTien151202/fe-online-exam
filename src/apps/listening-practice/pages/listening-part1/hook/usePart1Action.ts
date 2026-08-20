import {
  useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { toast } from '../../../../../configs/toast';
import { flattenListeningExam } from '../../../services/listeningExamMapper';
import { mapLPart1 } from '../../../services/mappers';
import { summarizeAutoGrade, usePartPracticeExam, useSubmitExamMutation } from '../../../../../shared/services/student-exam';
import { confirmSubmitExam } from '../../../../../shared/utils/examDialogs';

export const usePart1Action = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  // Chấm từng câu: kết quả BE trả về của câu nào lưu theo số thứ tự câu đó.
  const [results, setResults] = useState<Record<number, { earned: number; total: number }>>({});

  // Luyện theo phần = đề PART_PRACTICE (skill 2, part 1).
  const { examId, examDetail, isLoading } = usePartPracticeExam(2, 1);
  const questions = useMemo(() => {
    if (!examDetail) return [];
    const part = flattenListeningExam(examDetail).find((p) => p.partNumber === 1);
    return mapLPart1(part?.questions ?? []);
  }, [examDetail]);
  const total = questions.length;

  const submitMutation = useSubmitExamMutation();

  const safeIndex = total > 0 ? Math.min(currentQuestionIndex, total) : 1;
  const currentQuestion = questions[safeIndex - 1] ?? { id: 0, questionId: undefined, questionText: '', options: [], correctIndex: -1, mediaUrl: null };
  const scoreResult = results[safeIndex] ?? null;
  const isSubmitted = scoreResult != null;

  const handleSelectAnswer = (option: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [safeIndex]: option }));
  };

  const handleNext = () => {
    if (safeIndex < total) setCurrentQuestionIndex(safeIndex + 1);
  };

  const handleBack = () => {
    if (safeIndex > 1) setCurrentQuestionIndex(safeIndex - 1);
    else navigate({ to: '/listening' });
  };

  const handleSubmit = () => {
    if (isSubmitted || !answers[safeIndex]) {
      toast.warning('Bạn chưa chọn đáp án cho câu này.');
      return;
    }
    confirmSubmitExam({ totalQuestions: 1, onOk: doSubmit });
  };

  // Nộp RIÊNG câu đang làm để BE chấm và trả điểm ngay (giống luyện theo phần của Reading).
  // P1 = MC, response là index 0-based của đáp án đã chọn.
  const doSubmit = async () => {
    const questionId = currentQuestion.questionId;
    if (!examId || questionId == null) return;
    const response = currentQuestion.options.indexOf(answers[safeIndex]);
    if (response < 0) return;

    try {
      const result = await submitMutation.mutateAsync({
        examId,
        payload: { answers: [{ questionId, response }] },
      });
      const score = summarizeAutoGrade(result, { skillId: 2, partNumber: 1 });
      setResults((prev) => ({ ...prev, [safeIndex]: score }));
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
  };

  const gradedCount = Object.keys(results).length;
  const progressPercent = total > 0 ? (gradedCount / total) * 100 : 0;
  const correctCount = scoreResult?.earned ?? 0;

  return {
    isLoading,
    hasData: total > 0,
    total,
    currentQuestionIndex: safeIndex,
    setCurrentQuestionIndex,
    answers,
    results,
    isSubmitted,
    isGrading: submitMutation.isPending,
    correctCount,
    scoreTotal: scoreResult?.total ?? 0,
    handleSelectAnswer,
    handleNext,
    handleBack,
    handleSubmit,
    handleRetry,
    gradedCount,
    progressPercent,
    currentQuestion,
    mockQuestions: questions,
    hasNext: safeIndex < total,
  };
};
