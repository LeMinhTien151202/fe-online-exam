import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { message } from 'antd';
import { mapSpeakingSets } from '../../../services/mappers';
import { flattenSpeakingExam } from '../../../services/speakingExamMapper';
import { ISubmitAnswer, usePartPracticeExam, useSubmitExamMutation } from '../../../../../shared/services/student-exam';
import { confirmSubmitExam } from '../../../../../shared/utils/examDialogs';

export const usePart4 = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(12 * 60);
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

  const handleSubmit = () => {
    confirmSubmitExam({ onOk: doSubmit });
  };

  const doSubmit = () => {
    message.success('Đã ghi nhận phần trả lời của bạn! Bạn có thể luyện bộ câu hỏi tiếp theo.');

    // Nộp lên BE để tăng student_progress (skill 5, part 4). 1 bản ghi/bộ, lặp URL cho mọi câu con.
    if (examId) {
      const submitAnswers: ISubmitAnswer[] = [];
      sets.forEach((set, setIndex) => {
        if (set.questionId == null) return;
        const url = answers[setIndex];
        if (!url) return;
        const response = set.questions.length ? set.questions.map(() => url) : [url];
        submitAnswers.push({ questionId: set.questionId, response });
      });
      if (submitAnswers.length) submitMutation.mutate({ examId, payload: { answers: submitAnswers } });
    }
  };

  const handleRecordComplete = (audioUrl: string | null) => {
    setAnswers((prev) => ({ ...prev, [safeSet]: audioUrl ?? '' }));
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
    timeLeft,
    currentSetIndex: safeSet,
    setCurrentSetIndex,
    answers,
    showTips,
    setShowTips,
    showSampleAnswer,
    setShowSampleAnswer,
    activeSampleIdx,
    setActiveSampleIdx,
    formatTime,
    handleNext,
    handleBack,
    handleSubmit,
    handleRecordComplete,
    currentSet,
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
