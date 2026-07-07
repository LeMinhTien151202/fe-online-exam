import { message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useListeningQuestionsQuery } from '../../../services/listeningQuery';
import { mapLPart2 } from '../../../services/mappers';

export const usePart2Action = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(19 * 60 + 58);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const { data: res, isLoading } = useListeningQuestionsQuery(2);
  const sets = useMemo(() => mapLPart2(res?.data ?? []), [res]);
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
  const currentSet = sets[safeSet] ?? { id: 0, mediaUrl: null, instruction: '', options: [], speakerCount: 4, correctBySpeaker: {} };

  const keyOf = (speaker: number) => `${safeSet}-${speaker}`;
  const handleSelectChange = (speaker: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [keyOf(speaker)]: value }));
  };
  const getAnswer = (speaker: number) => answers[keyOf(speaker)];

  const goSet = (idx: number) => setCurrentSetIndex(idx);
  const handleNext = () => { if (safeSet < setCount - 1) goSet(safeSet + 1); };
  const handlePrev = () => { if (safeSet > 0) goSet(safeSet - 1); else navigate({ to: '/listening' }); };

  const handleSubmit = () => {
    const saved = localStorage.getItem('aptis_listening_progress');
    let progressObj: Record<string, number> = {};
    if (saved) { try { progressObj = JSON.parse(saved); } catch { /* bỏ qua lỗi */ } }
    progressObj['l2'] = 100;
    localStorage.setItem('aptis_listening_progress', JSON.stringify(progressObj));
    message.success('Đã ghi nhận câu trả lời! Bạn có thể luyện bài tiếp theo.');
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
    timeLeft,
    currentSet,
    getAnswer,
    handleSelectChange,
    handleSubmit,
    answeredCount,
    progressPercent,
    formatTime
  };
};
