import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { mapSpeakingSets } from '../../../services/mappers';
import { flattenSpeakingExam } from '../../../services/speakingExamMapper';
import { usePartPracticeExam } from '../../../../../shared/services/student-exam';
import { usePerQuestionGrading } from '@/shared/hooks/usePerQuestionGrading';

export const usePart3 = () => {
  const navigate = useNavigate();
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [currentSubIndex, setCurrentSubIndex] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [activeSampleIdx, setActiveSampleIdx] = useState(0);

  // Luyện theo phần = đề PART_PRACTICE (skill 5, part 3 — RECORD theo bộ).
  const { examId, examDetail, isLoading } = usePartPracticeExam(5, 3);
  const sets = useMemo(() => {
    if (!examDetail) return [];
    const part = flattenSpeakingExam(examDetail).find((p) => p.partNumber === 3);
    return mapSpeakingSets(part?.questions ?? []);
  }, [examDetail]);
  const setCount = sets.length;

  const { grades, gradingKey, gradeOne } = usePerQuestionGrading();

  const safeSet = setCount > 0 ? Math.min(currentSetIndex, setCount - 1) : 0;
  const raw = sets[safeSet];
  const currentCompareSet = {
    image1Url: raw?.imageUrls?.[0] ?? '',
    image2Url: raw?.imageUrls?.[1] ?? '',
    questions: raw?.questions ?? [],
  };
  const totalSubQuestions = currentCompareSet.questions.length;
  const activeQuestion = currentCompareSet.questions[currentSubIndex - 1] ?? { id: 0, questionText: '', sampleAnswers: [] };

  const resetSub = () => { setShowSampleAnswer(false); setActiveSampleIdx(0); };
  const handleSubTabChange = (idx: number) => { setCurrentSubIndex(idx); resetSub(); };

  const handleNext = () => {
    if (currentSubIndex < totalSubQuestions) {
      setCurrentSubIndex(currentSubIndex + 1);
      resetSub();
    } else if (safeSet < setCount - 1) {
      setCurrentSetIndex(safeSet + 1);
      setCurrentSubIndex(1);
      resetSub();
    }
  };

  const handleBack = () => {
    if (currentSubIndex > 1) {
      setCurrentSubIndex(currentSubIndex - 1);
      resetSub();
    } else if (safeSet > 0) {
      const prevSet = safeSet - 1;
      setCurrentSetIndex(prevSet);
      setCurrentSubIndex(sets[prevSet]?.questions.length || 1);
      resetSub();
    } else {
      navigate({ to: '/speaking' });
    }
  };

  const keyOf = (sub: number) => `${safeSet}-${sub}`;
  const handleRecordComplete = (audioUrl: string | null) => {
    setAnswers((prev) => ({ ...prev, [keyOf(currentSubIndex)]: audioUrl ?? '' }));
  };
  const isSubDone = (sub: number) => !!answers[keyOf(sub)];

  // Chấm ngay CẢ BỘ hiện tại (P3: 1 bộ = 1 bản ghi = mảng URL theo thứ tự câu con).
  const currentGradeKey = raw?.questionId != null ? `p3-set${safeSet}` : '';
  const currentGrade = currentGradeKey ? grades[currentGradeKey] : undefined;
  const isGradingCurrent = !!currentGradeKey && gradingKey === currentGradeKey;
  const currentResponses = (raw?.questions ?? []).map((_, qi) => answers[`${safeSet}-${qi + 1}`] ?? '');
  const hasCompletedCurrentSet = currentResponses.length > 0 && currentResponses.every(Boolean);
  const canGradeCurrent = raw?.questionId != null && hasCompletedCurrentSet;
  const gradeCurrent = () => {
    if (raw?.questionId == null || !hasCompletedCurrentSet) return;
    gradeOne({ key: currentGradeKey, examId, questionId: raw.questionId, response: currentResponses });
  };

  const goTo = (setIdx: number) => {
    setCurrentSetIndex(setIdx);
    setCurrentSubIndex(1);
    resetSub();
  };
  // Bảng câu hỏi: mỗi bộ = 1 nút; trạng thái theo số câu con đã thu âm.
  const boardItems = sets.map((set, i) => {
    const filled = set.questions.filter((_, qi) => answers[`${i}-${qi + 1}`]).length;
    const status: 'unanswered' | 'partial' | 'answered' =
      filled === 0 ? 'unanswered' : filled >= set.questions.length ? 'answered' : 'partial';
    return { key: i, label: i + 1, status };
  });

  let answeredCount = 0;
  for (let s = 1; s <= totalSubQuestions; s++) if (isSubDone(s)) answeredCount++;
  const progressPercent = totalSubQuestions > 0 ? Math.round((answeredCount / totalSubQuestions) * 100) : 0;

  const isLast = safeSet >= setCount - 1 && currentSubIndex >= totalSubQuestions;
  const isFirst = safeSet === 0 && currentSubIndex === 1;

  return {
    navigate,
    isLoading,
    hasData: setCount > 0,
    currentSubIndex,
    setCurrentSubIndex,
    answers,
    isSubDone,
    showSampleAnswer,
    setShowSampleAnswer,
    activeSampleIdx,
    setActiveSampleIdx,
    handleSubTabChange,
    handleNext,
    handleBack,
    handleRecordComplete,
    currentCompareSet,
    activeQuestion,
    currentGrade,
    isGradingCurrent,
    canGradeCurrent,
    gradeCurrent,
    totalSubQuestions,
    answeredCount,
    progressPercent,
    setCount,
    currentSetNumber: safeSet + 1,
    hasNext: !isLast,
    hasPrev: !isFirst,
    goTo,
    boardItems,
    activeSetIndex: safeSet,
  };
};
