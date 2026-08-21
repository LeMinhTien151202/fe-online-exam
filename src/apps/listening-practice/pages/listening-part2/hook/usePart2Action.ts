import { useMemo, useState } from 'react';
import { toast } from '../../../../../configs/toast';
import { useNavigate } from '@tanstack/react-router';
import { flattenListeningExam } from '../../../services/listeningExamMapper';
import { mapLPart2 } from '../../../services/mappers';
import {
  pickCorrectResponse,
  summarizeAutoGrade,
  usePartPracticeExam,
  useSubmitExamMutation,
} from '../../../../../shared/services/student-exam';
import { confirmSubmitExam } from '../../../../../shared/utils/examDialogs';

export const usePart2Action = () => {
  const navigate = useNavigate();
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  // Chấm từng bộ: kết quả BE trả về của bộ nào lưu theo index bộ đó.
  const [results, setResults] = useState<Record<number, { earned: number; total: number }>>({});
  // Đáp án đúng do BE trả kèm kết quả chấm (đề lấy về đã bị cắt sạch đáp án): { setIndex: { speaker: đáp án } }.
  const [gradedAnswers, setGradedAnswers] = useState<Record<number, Record<string, string>>>({});

  // Luyện theo phần = đề PART_PRACTICE (skill 2, part 2 — SPEAKER_MATCH).
  const { examId, examDetail, isLoading } = usePartPracticeExam(2, 2);
  const sets = useMemo(() => {
    if (!examDetail) return [];
    const part = flattenListeningExam(examDetail).find((p) => p.partNumber === 2);
    return mapLPart2(part?.questions ?? []);
  }, [examDetail]);
  const setCount = sets.length;

  const submitMutation = useSubmitExamMutation();

  const safeSet = setCount > 0 ? Math.min(currentSetIndex, setCount - 1) : 0;
  const currentSet = sets[safeSet] ?? { id: 0, questionId: undefined, mediaUrl: null, instruction: '', options: [], speakerCount: 4, correctBySpeaker: {} };
  const scoreResult = results[safeSet] ?? null;
  const isSubmitted = scoreResult != null;

  const keyOf = (speaker: number) => `${safeSet}-${speaker}`;
  const handleSelectChange = (speaker: number, value: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [keyOf(speaker)]: value }));
  };
  const getAnswer = (speaker: number) => answers[keyOf(speaker)];

  const goSet = (idx: number) => setCurrentSetIndex(idx);
  const handleNext = () => { if (safeSet < setCount - 1) goSet(safeSet + 1); };
  const handlePrev = () => { if (safeSet > 0) goSet(safeSet - 1); else navigate({ to: '/listening' }); };

  // Bảng câu hỏi: mỗi bộ = 1 nút. Bộ đã chấm -> "đã chấm"; bộ đang chọn dở -> "đang làm".
  const boardItems = sets.map((set, i) => {
    let filled = 0;
    for (let sp = 1; sp <= set.speakerCount; sp += 1) if (answers[`${i}-${sp}`]) filled += 1;
    const status: 'unanswered' | 'partial' | 'answered' =
      results[i] ? 'answered' : filled === 0 ? 'unanswered' : 'partial';
    return { key: i, label: i + 1, status };
  });

  const handleSubmit = () => {
    if (isSubmitted) return;
    let filled = 0;
    for (let sp = 1; sp <= currentSet.speakerCount; sp += 1) if (getAnswer(sp)) filled += 1;
    if (filled < currentSet.speakerCount) {
      toast.warning(`Bạn mới trả lời ${filled}/${currentSet.speakerCount} người nói. Hãy hoàn thành tất cả nhé!`);
      return;
    }
    confirmSubmitExam({ totalQuestions: currentSet.speakerCount, onOk: doSubmit });
  };

  // Nộp RIÊNG bộ đang làm để BE chấm và trả điểm ngay.
  // P2 = { speaker_index: answer } của đúng bộ đó.
  const doSubmit = async () => {
    const questionId = currentSet.questionId;
    if (!examId || questionId == null) return;
    const response: Record<string, string> = {};
    for (let speaker = 1; speaker <= currentSet.speakerCount; speaker += 1) {
      const chosen = getAnswer(speaker);
      if (chosen != null) response[String(speaker)] = chosen;
    }
    if (Object.keys(response).length === 0) return;

    try {
      const result = await submitMutation.mutateAsync({
        examId,
        payload: { answers: [{ questionId, response }] },
      });
      const score = summarizeAutoGrade(result, { questionId });
      setResults((prev) => ({ ...prev, [safeSet]: score }));
      const correct = pickCorrectResponse(result, questionId);
      if (correct && typeof correct === 'object' && !Array.isArray(correct)) {
        setGradedAnswers((prev) => ({
          ...prev,
          [safeSet]: Object.fromEntries(Object.entries(correct).map(([k, v]) => [k, String(v)])),
        }));
      }
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
      for (let speaker = 1; speaker <= currentSet.speakerCount; speaker += 1) delete next[`${safeSet}-${speaker}`];
      return next;
    });
    setGradedAnswers((prev) => {
      const next = { ...prev };
      delete next[safeSet];
      return next;
    });
  };

  let answeredCount = 0;
  for (let s = 1; s <= currentSet.speakerCount; s++) if (getAnswer(s)) answeredCount++;
  const progressPercent = currentSet.speakerCount > 0 ? (answeredCount / currentSet.speakerCount) * 100 : 0;

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
    getAnswer,
    getCorrectAnswer: (speaker: number) => gradedAnswers[safeSet]?.[String(speaker)],
    handleSelectChange,
    handleSubmit,
    handleRetry,
    isSubmitted,
    isGrading: submitMutation.isPending,
    correctCount: scoreResult?.earned ?? 0,
    scoreTotal: scoreResult?.total ?? 0,
    gradedCount: Object.keys(results).length,
    answeredCount,
    progressPercent,
    boardItems,
    activeSetIndex: safeSet,
    goTo: goSet,
  };
};
