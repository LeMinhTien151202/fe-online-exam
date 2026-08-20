import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { mapSpeakingSets } from '../../../services/mappers';
import { flattenSpeakingExam } from '../../../services/speakingExamMapper';
import { usePartPracticeExam } from '../../../../../shared/services/student-exam';
import { usePerQuestionGrading } from '@/shared/hooks/usePerQuestionGrading';

export const usePart4 = () => {
  const navigate = useNavigate();
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [showTips, setShowTips] = useState(false);
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [activeSampleIdx, setActiveSampleIdx] = useState(0);

  // Luyện theo phần = đề PART_PRACTICE (skill 5, part 4 — RECORD, 1 bản ghi/bộ).
  const { examId, examDetail, isLoading } = usePartPracticeExam(5, 4);
  const sets = useMemo(() => {
    if (!examDetail) return [];
    const part = flattenSpeakingExam(examDetail).find((p) => p.partNumber === 4);
    return mapSpeakingSets(part?.questions ?? []);
  }, [examDetail]);
  const setCount = sets.length;

  const { grades, gradingKey, gradeOne } = usePerQuestionGrading();

  const safeSet = setCount > 0 ? Math.min(currentSetIndex, setCount - 1) : 0;
  const raw = sets[safeSet];
  // Gộp đáp án mẫu của từng câu thành 1 bài mẫu chung (P4 nói liên tục cả 3 câu)
  const combinedSample = (raw?.questions ?? [])
    .filter((q) => q.sampleAnswers[0])
    .map((q, i) => `${i + 1}. ${q.questionText}\n→ ${q.sampleAnswers[0]}`)
    .join('\n\n');
  const currentSet = {
    title: `Bộ ${safeSet + 1}`,
    imageUrl: raw?.imageUrls?.[0] ?? '',
    questions: (raw?.questions ?? []).map((q) => q.questionText),
    sampleAnswers: combinedSample ? [combinedSample] : [],
  };

  const handleNext = () => {
    if (safeSet < setCount - 1) {
      setCurrentSetIndex(safeSet + 1);
      setShowSampleAnswer(false);
      setActiveSampleIdx(0);
    }
  };

  const handleBack = () => {
    if (safeSet > 0) {
      setCurrentSetIndex(safeSet - 1);
      setShowSampleAnswer(false);
      setActiveSampleIdx(0);
    } else {
      navigate({ to: '/speaking' });
    }
  };

  const handleRecordComplete = (audioUrl: string | null) => {
    setAnswers((prev) => ({ ...prev, [safeSet]: audioUrl ?? '' }));
  };

  // Chấm ngay CẢ BỘ hiện tại (P4: 1 bản ghi/bộ, lặp URL cho mọi câu con).
  const currentGradeKey = raw?.questionId != null ? `p4-set${safeSet}` : '';
  const currentGrade = currentGradeKey ? grades[currentGradeKey] : undefined;
  const isGradingCurrent = !!currentGradeKey && gradingKey === currentGradeKey;
  const currentUrl = answers[safeSet];
  const canGradeCurrent = raw?.questionId != null && !!currentUrl;
  const gradeCurrent = () => {
    if (raw?.questionId == null || !currentUrl) return;
    const response = raw.questions.length ? raw.questions.map(() => currentUrl) : [currentUrl];
    gradeOne({ key: currentGradeKey, examId, questionId: raw.questionId, response });
  };

  const goTo = (idx: number) => {
    setCurrentSetIndex(idx);
    setShowSampleAnswer(false);
    setActiveSampleIdx(0);
  };
  // Bảng câu hỏi: mỗi bộ = 1 nút; trạng thái theo bản ghi âm của bộ đó.
  const boardItems = sets.map((_, i) => ({
    key: i,
    label: i + 1,
    status: (answers[i] ? 'answered' : 'unanswered') as 'unanswered' | 'partial' | 'answered',
  }));

  const answeredCount = answers[safeSet] ? 1 : 0;
  const progressPercent = answeredCount * 100;

  return {
    navigate,
    isLoading,
    hasData: setCount > 0,
    currentSetIndex: safeSet,
    setCurrentSetIndex,
    answers,
    showTips,
    setShowTips,
    showSampleAnswer,
    setShowSampleAnswer,
    activeSampleIdx,
    setActiveSampleIdx,
    handleNext,
    handleBack,
    handleRecordComplete,
    currentSet,
    currentGrade,
    isGradingCurrent,
    canGradeCurrent,
    gradeCurrent,
    answeredCount,
    progressPercent,
    setCount,
    currentSetNumber: safeSet + 1,
    hasNext: safeSet < setCount - 1,
    hasPrev: safeSet > 0,
    goTo,
    boardItems,
    activeSetIndex: safeSet,
  };
};
