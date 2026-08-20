import { useMemo, useState } from 'react';
import { toast } from '../../../../../configs/toast';
import { useNavigate } from '@tanstack/react-router';
import { flattenListeningExam } from '../../../services/listeningExamMapper';
import { mapLPart3 } from '../../../services/mappers';
import { summarizeAutoGrade, usePartPracticeExam, useSubmitExamMutation } from '../../../../../shared/services/student-exam';
import { confirmSubmitExam } from '../../../../../shared/utils/examDialogs';

export const SPEAKER_OPTIONS = [
  { value: 'MAN', label: 'Man' },
  { value: 'WOMAN', label: 'Woman' },
  { value: 'BOTH', label: 'Both' },
];

export const usePart3Action = () => {
  const navigate = useNavigate();
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  // Chấm từng bộ: kết quả BE trả về của bộ nào lưu theo index bộ đó.
  const [results, setResults] = useState<Record<number, { earned: number; total: number }>>({});

  // Luyện theo phần = đề PART_PRACTICE (skill 2, part 3 — SPEAKER_AGREEMENT).
  const { examId, examDetail, isLoading } = usePartPracticeExam(2, 3);
  const sets = useMemo(() => {
    if (!examDetail) return [];
    const part = flattenListeningExam(examDetail).find((p) => p.partNumber === 3);
    return mapLPart3(part?.questions ?? []);
  }, [examDetail]);
  const setCount = sets.length;

  const submitMutation = useSubmitExamMutation();

  const safeSet = setCount > 0 ? Math.min(currentSetIndex, setCount - 1) : 0;
  const currentSet = sets[safeSet] ?? { id: 0, questionId: undefined, mediaUrl: null, instruction: '', statements: [] };
  const scoreResult = results[safeSet] ?? null;
  const isSubmitted = scoreResult != null;

  const keyOf = (statementId: number) => `${safeSet}-${statementId}`;
  const handleSelectChange = (statementId: number, value: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [keyOf(statementId)]: value }));
  };
  const getAnswer = (statementId: number) => answers[keyOf(statementId)];

  const handleNext = () => { if (safeSet < setCount - 1) setCurrentSetIndex(safeSet + 1); };
  const handlePrev = () => { if (safeSet > 0) setCurrentSetIndex(safeSet - 1); else navigate({ to: '/listening' }); };
  const goTo = (idx: number) => setCurrentSetIndex(idx);

  // Bảng câu hỏi: mỗi bộ = 1 nút. Bộ đã chấm -> "đã chấm"; bộ đang chọn dở -> "đang làm".
  const boardItems = sets.map((set, i) => {
    const filled = set.statements.filter((st) => answers[`${i}-${st.id}`]).length;
    const status: 'unanswered' | 'partial' | 'answered' =
      results[i] ? 'answered' : filled === 0 ? 'unanswered' : 'partial';
    return { key: i, label: i + 1, status };
  });

  const totalStatements = currentSet.statements.length;

  const handleSubmit = () => {
    if (isSubmitted) return;
    const filled = currentSet.statements.filter((st) => getAnswer(st.id)).length;
    if (filled < totalStatements) {
      toast.warning(`Bạn mới trả lời ${filled}/${totalStatements} câu. Hãy hoàn thành tất cả nhé!`);
      return;
    }
    confirmSubmitExam({ totalQuestions: totalStatements, onOk: doSubmit });
  };

  // Nộp RIÊNG bộ đang làm để BE chấm và trả điểm ngay.
  // P3 = mảng MAN/WOMAN/BOTH theo đúng thứ tự statements của bộ đó.
  const doSubmit = async () => {
    const questionId = currentSet.questionId;
    if (!examId || questionId == null) return;
    const response = currentSet.statements.map((st) => getAnswer(st.id) ?? '');
    if (!response.some((v) => v !== '')) return;

    try {
      const result = await submitMutation.mutateAsync({
        examId,
        payload: { answers: [{ questionId, response }] },
      });
      const score = summarizeAutoGrade(result, { skillId: 2, partNumber: 3 });
      setResults((prev) => ({ ...prev, [safeSet]: score }));
      toast.success(`Đã chấm xong bài ${safeSet + 1}: ${score.earned}/${score.total} câu đúng.`);
    } catch {
      // Interceptor axios đã hiện thông báo lỗi; không tự chấm ở FE để tránh sai điểm.
    }
  };

  // Làm lại đúng bộ này: bỏ kết quả + các lựa chọn của bộ để mở khoá.
  const handleRetry = () => {
    setResults((prev) => {
      const next = { ...prev };
      delete next[safeSet];
      return next;
    });
    setAnswers((prev) => {
      const next = { ...prev };
      currentSet.statements.forEach((st) => delete next[`${safeSet}-${st.id}`]);
      return next;
    });
  };

  let answeredCount = 0;
  currentSet.statements.forEach((st) => { if (getAnswer(st.id)) answeredCount++; });
  const progressPercent = totalStatements > 0 ? (answeredCount / totalStatements) * 100 : 0;

  return {
    isLoading,
    hasData: setCount > 0,
    setCount,
    currentSetNumber: safeSet + 1,
    hasNext: safeSet < setCount - 1,
    hasPrev: safeSet > 0,
    handleNext,
    handlePrev,
    currentSet,
    totalStatements,
    getAnswer,
    handleSelectChange,
    handleSubmit,
    handleRetry,
    isSubmitted,
    isGrading: submitMutation.isPending,
    correctCount: scoreResult?.earned ?? 0,
    scoreTotal: scoreResult?.total ?? 0,
    answeredCount,
    progressPercent,
    boardItems,
    activeSetIndex: safeSet,
    goTo,
  };
};
