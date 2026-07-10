import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { message } from 'antd';
import { mapSpeakingSets } from '../../../services/mappers';
import { flattenSpeakingExam } from '../../../services/speakingExamMapper';
import { ISubmitAnswer, usePartPracticeExam, useSubmitExamMutation } from '../../../../../shared/services/student-exam';
import { confirmSubmitExam } from '../../../../../shared/utils/examDialogs';

export const usePart3 = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(12 * 60);
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

  const submitMutation = useSubmitExamMutation();

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

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

  const handleSubmit = () => {
    confirmSubmitExam({ onOk: doSubmit });
  };

  const doSubmit = () => {
    message.success('Đã ghi nhận phần trả lời của bạn! Bạn có thể luyện câu tiếp theo.');

    // Nộp lên BE để tăng student_progress (skill 5, part 3). RECORD = mảng URL theo thứ tự câu con mỗi bộ.
    if (examId) {
      const submitAnswers: ISubmitAnswer[] = [];
      sets.forEach((set, setIndex) => {
        if (set.questionId == null) return;
        const response = set.questions.map((_, qIndex) => answers[`${setIndex}-${qIndex + 1}`] ?? '');
        if (response.some((v) => v !== '')) submitAnswers.push({ questionId: set.questionId, response });
      });
      if (submitAnswers.length) submitMutation.mutate({ examId, payload: { answers: submitAnswers } });
    }
  };

  const keyOf = (sub: number) => `${safeSet}-${sub}`;
  const handleRecordComplete = (audioUrl: string | null) => {
    setAnswers((prev) => ({ ...prev, [keyOf(currentSubIndex)]: audioUrl || 'recorded_mock' }));
  };
  const isSubDone = (sub: number) => !!answers[keyOf(sub)];

  let answeredCount = 0;
  for (let s = 1; s <= totalSubQuestions; s++) if (isSubDone(s)) answeredCount++;
  const progressPercent = totalSubQuestions > 0 ? Math.round((answeredCount / totalSubQuestions) * 100) : 0;

  const isLast = safeSet >= setCount - 1 && currentSubIndex >= totalSubQuestions;
  const isFirst = safeSet === 0 && currentSubIndex === 1;

  return {
    navigate,
    isLoading,
    hasData: setCount > 0,
    timeLeft,
    currentSubIndex,
    setCurrentSubIndex,
    answers,
    isSubDone,
    showSampleAnswer,
    setShowSampleAnswer,
    activeSampleIdx,
    setActiveSampleIdx,
    formatTime,
    handleSubTabChange,
    handleNext,
    handleBack,
    handleSubmit,
    handleRecordComplete,
    currentCompareSet,
    activeQuestion,
    totalSubQuestions,
    answeredCount,
    progressPercent,
    setCount,
    currentSetNumber: safeSet + 1,
    hasNext: !isLast,
    hasPrev: !isFirst,
  };
};
