import { useMemo, useState } from 'react';
import { toast } from '../../../../../configs/toast';
import { flattenGrammarExam } from '../../../services/grammarExamMapper';
import { mapVocabularySets } from '../../../services/mappers';
import {
  pickCorrectResponse,
  summarizeAutoGrade,
  usePartPracticeExam,
  useSubmitExamMutation,
} from '../../../../../shared/services/student-exam';
import { confirmSubmitExam } from '../../../../../shared/utils/examDialogs';

export const usePart2Action = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  // Chấm từng task: kết quả BE trả về của task nào lưu theo index task đó.
  const [results, setResults] = useState<Record<number, { earned: number; total: number }>>({});
  // Đáp án đúng do BE trả kèm kết quả chấm (đề lấy về đã bị cắt sạch đáp án): { unit: { slot_id: từ đúng } }.
  const [gradedAnswers, setGradedAnswers] = useState<Record<number, Record<string, string>>>({});

  // Luyện theo phần = đề PART_PRACTICE (skill 1, part 2 — Vocabulary/WORD_BANK).
  const { examId, examDetail, isLoading } = usePartPracticeExam(1, 2);
  const sets = useMemo(() => {
    if (!examDetail) return [];
    const part = flattenGrammarExam(examDetail).find((p) => p.partNumber === 2);
    return mapVocabularySets(part?.questions ?? []);
  }, [examDetail]);
  const total = useMemo(() => sets.reduce((sum, s) => sum + s.subQuestions.length, 0), [sets]); // tổng số ý
  const totalUnits = sets.length; // mỗi task (bản ghi) = 1 câu trên bảng

  const submitMutation = useSubmitExamMutation();

  // Task đang mở = task chứa ý đang chọn.
  const activeUnit = useMemo(() => {
    const idx = sets.findIndex((s) => s.subQuestions.some((sub) => sub.questionNumber === currentQuestionIndex));
    return idx >= 0 ? idx + 1 : 1;
  }, [sets, currentQuestionIndex]);
  const currentSet = sets[activeUnit - 1] ?? null;
  const scoreResult = results[activeUnit] ?? null;
  const isSubmitted = scoreResult != null;

  const selectAnswer = (questionNumber: number, value: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [questionNumber]: value }));
  };

  const handleNavigateUnit = (unit: number) => {
    const first = sets[unit - 1]?.subQuestions[0]?.questionNumber;
    if (first != null) setCurrentQuestionIndex(first);
  };
  const handlePrevQuestion = () => { if (activeUnit > 1) handleNavigateUnit(activeUnit - 1); };
  const handleNextQuestion = () => { if (activeUnit < totalUnits) handleNavigateUnit(activeUnit + 1); };

  const navItems = useMemo(() => sets.map((set, i) => {
    const answeredCount = set.subQuestions.filter((sub) => !!answers[sub.questionNumber]).length;
    const graded = results[i + 1] != null;
    return {
      display: i + 1,
      answered: answeredCount > 0,
      graded,
      active: activeUnit === i + 1,
      tooltip: graded
        ? `Câu ${i + 1} — ${set.title}: đã chấm ${results[i + 1].earned}/${results[i + 1].total}`
        : `Câu ${i + 1} — ${set.title}: đã trả lời ${answeredCount}/${set.subQuestions.length} ý`,
    };
  }), [sets, answers, results, activeUnit]);

  const handleSubmitClick = () => {
    if (isSubmitted || !currentSet) return;
    const filled = currentSet.subQuestions.filter((sub) => !!answers[sub.questionNumber]).length;
    if (filled < currentSet.subQuestions.length) {
      toast.warning(`Bạn mới trả lời ${filled}/${currentSet.subQuestions.length} ý. Hãy hoàn thành cả task nhé!`);
      return;
    }
    confirmSubmitExam({ totalQuestions: currentSet.subQuestions.length, onOk: doSubmit });
  };

  // Nộp RIÊNG task đang làm để BE chấm và trả điểm ngay.
  // WORD_BANK = { slot_id: từ đã chọn } của đúng task đó.
  const doSubmit = async () => {
    if (!examId || !currentSet || currentSet.questionId == null) return;
    const response: Record<string, string> = {};
    currentSet.subQuestions.forEach((sub) => {
      const chosen = answers[sub.questionNumber];
      if (chosen != null) response[sub.id] = chosen;
    });
    if (Object.keys(response).length === 0) return;

    try {
      const result = await submitMutation.mutateAsync({
        examId,
        payload: { answers: [{ questionId: currentSet.questionId, response }] },
      });
      const score = summarizeAutoGrade(result, { questionId: currentSet.questionId });
      setResults((prev) => ({ ...prev, [activeUnit]: score }));
      const correct = pickCorrectResponse(result, currentSet.questionId);
      if (correct && typeof correct === 'object' && !Array.isArray(correct)) {
        setGradedAnswers((prev) => ({
          ...prev,
          [activeUnit]: Object.fromEntries(Object.entries(correct).map(([k, v]) => [k, String(v)])),
        }));
      }
      toast.success(`Đã chấm xong câu ${activeUnit}: ${score.earned}/${score.total} câu đúng.`);
    } catch {
      // Interceptor axios đã hiện thông báo lỗi; không tự chấm ở FE để tránh sai điểm.
    }
  };

  // Làm lại đúng task này: bỏ kết quả + các ý đã chọn để mở khoá.
  const handleRetry = () => {
    if (!currentSet) return;
    setResults((prev) => {
      const next = { ...prev };
      delete next[activeUnit];
      return next;
    });
    setAnswers((prev) => {
      const next = { ...prev };
      currentSet.subQuestions.forEach((sub) => delete next[sub.questionNumber]);
      return next;
    });
    setGradedAnswers((prev) => {
      const next = { ...prev };
      delete next[activeUnit];
      return next;
    });
  };

  const gradedUnits = Object.keys(results).length;
  const progressPercent = totalUnits > 0 ? Math.round((gradedUnits / totalUnits) * 100) : 0;

  return {
    isLoading,
    sets,
    total,
    totalUnits,
    answers,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    activeUnit,
    navItems,
    selectAnswer,
    handleNavigateUnit,
    handlePrevQuestion,
    handleNextQuestion,
    handleSubmitClick,
    handleRetry,
    isSubmitted,
    isGrading: submitMutation.isPending,
    correctCount: scoreResult?.earned ?? 0,
    correctAnswers: gradedAnswers[activeUnit] ?? {},
    scoreTotal: scoreResult?.total ?? 0,
    gradedUnits,
    progressPercent,
  };
};
