import { useMemo, useState } from 'react';
import { toast } from '../../../../../configs/toast';
import { useNavigate } from '@tanstack/react-router';
import { flattenListeningExam } from '../../../services/listeningExamMapper';
import { mapLPart4 } from '../../../services/mappers';
import { summarizeAutoGrade, usePartPracticeExam, useSubmitExamMutation } from '../../../../../shared/services/student-exam';
import { confirmSubmitExam } from '../../../../../shared/utils/examDialogs';

export const usePart4Action = () => {
  const navigate = useNavigate();
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  // Chấm từng bài: kết quả BE trả về của bài nào lưu theo index bài đó.
  const [results, setResults] = useState<Record<number, { earned: number; total: number }>>({});

  // Luyện theo phần = đề PART_PRACTICE (skill 2, part 4 — Monologue).
  const { examId, examDetail, isLoading } = usePartPracticeExam(2, 4);
  const groups = useMemo(() => {
    if (!examDetail) return [];
    const part = flattenListeningExam(examDetail).find((p) => p.partNumber === 4);
    return mapLPart4(part?.questions ?? []);
  }, [examDetail]);
  const groupCount = groups.length;

  const submitMutation = useSubmitExamMutation();

  const safeGroup = groupCount > 0 ? Math.min(currentGroupIndex, groupCount - 1) : 0;
  const currentGroup = groups[safeGroup] ?? { id: 0, questionId: undefined, title: '', instruction: '', mediaUrl: null, subQuestions: [] };
  const scoreResult = results[safeGroup] ?? null;
  const isSubmitted = scoreResult != null;

  const handleSelectAnswer = (subQuestionId: string, answer: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [subQuestionId]: answer }));
  };

  const handleNext = () => { if (safeGroup < groupCount - 1) setCurrentGroupIndex(safeGroup + 1); };
  const handlePrev = () => { if (safeGroup > 0) setCurrentGroupIndex(safeGroup - 1); else navigate({ to: '/listening' }); };
  const goTo = (idx: number) => setCurrentGroupIndex(idx);

  // Bảng câu hỏi: mỗi bài (group) = 1 nút. Bài đã chấm -> "đã chấm"; đang chọn dở -> "đang làm".
  const boardItems = groups.map((group, i) => {
    const filled = group.subQuestions.filter((sq) => answers[sq.id]).length;
    const status: 'unanswered' | 'partial' | 'answered' =
      results[i] ? 'answered' : filled === 0 ? 'unanswered' : 'partial';
    return { key: i, label: i + 1, status };
  });

  const totalSub = currentGroup.subQuestions.length;

  const handleSubmit = () => {
    if (isSubmitted) return;
    const filled = currentGroup.subQuestions.filter((sq) => answers[sq.id]).length;
    if (filled < totalSub) {
      toast.warning(`Bạn mới trả lời ${filled}/${totalSub} câu. Hãy hoàn thành tất cả nhé!`);
      return;
    }
    confirmSubmitExam({ totalQuestions: totalSub, onOk: doSubmit });
  };

  // Nộp RIÊNG bài đang làm để BE chấm và trả điểm ngay.
  // P4 = mảng index đáp án theo đúng thứ tự subQuestions của bài đó.
  const doSubmit = async () => {
    const questionId = currentGroup.questionId;
    if (!examId || questionId == null) return;
    const response = currentGroup.subQuestions.map((sq) => {
      const chosen = answers[sq.id];
      return chosen == null ? -1 : sq.options.indexOf(chosen);
    });
    if (!response.some((v) => v >= 0)) return;

    try {
      const result = await submitMutation.mutateAsync({
        examId,
        payload: { answers: [{ questionId, response }] },
      });
      const score = summarizeAutoGrade(result, { skillId: 2, partNumber: 4 });
      setResults((prev) => ({ ...prev, [safeGroup]: score }));
      toast.success(`Đã chấm xong bài ${safeGroup + 1}: ${score.earned}/${score.total} câu đúng.`);
    } catch {
      // Interceptor axios đã hiện thông báo lỗi; không tự chấm ở FE để tránh sai điểm.
    }
  };

  // Làm lại đúng bài này: bỏ kết quả + các lựa chọn của bài để mở khoá.
  const handleRetry = () => {
    setResults((prev) => {
      const next = { ...prev };
      delete next[safeGroup];
      return next;
    });
    setAnswers((prev) => {
      const next = { ...prev };
      currentGroup.subQuestions.forEach((sq) => delete next[sq.id]);
      return next;
    });
  };

  let answeredCount = 0;
  currentGroup.subQuestions.forEach((sq) => { if (answers[sq.id]) answeredCount++; });
  const progressPercent = totalSub > 0 ? (answeredCount / totalSub) * 100 : 0;

  return {
    isLoading,
    hasData: groupCount > 0,
    groupCount,
    currentGroupNumber: safeGroup + 1,
    hasNext: safeGroup < groupCount - 1,
    hasPrev: safeGroup > 0,
    handleNext,
    handlePrev,
    answers,
    handleSelectAnswer,
    handleSubmit,
    handleRetry,
    isSubmitted,
    isGrading: submitMutation.isPending,
    correctCount: scoreResult?.earned ?? 0,
    scoreTotal: scoreResult?.total ?? 0,
    answeredCount,
    totalSub,
    progressPercent,
    currentGroup,
    boardItems,
    activeGroupIndex: safeGroup,
    goTo,
  };
};
