import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { message } from 'antd';
import { useSpeakingQuestionsQuery } from '../../../services/speakingQuery';
import { mapSpeakingSets } from '../../../services/mappers';

export const usePart4 = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(12 * 60);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [showTips, setShowTips] = useState(false);
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [activeSampleIdx, setActiveSampleIdx] = useState(0);

  const { data: res, isLoading } = useSpeakingQuestionsQuery(4);
  const sets = useMemo(() => mapSpeakingSets(res?.data ?? []), [res]);
  const setCount = sets.length;

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
    message.success('Đã ghi nhận phần trả lời của bạn! Bạn có thể luyện bộ câu hỏi tiếp theo.');
  };

  const handleRecordComplete = (audioUrl: string | null) => {
    setAnswers((prev) => ({ ...prev, [safeSet]: audioUrl || 'recorded_mock' }));
  };

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
  };
};
