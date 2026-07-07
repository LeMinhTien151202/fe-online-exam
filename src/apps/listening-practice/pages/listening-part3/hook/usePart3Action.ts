import { message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useListeningQuestionsQuery } from '../../../services/listeningQuery';
import { mapLPart3 } from '../../../services/mappers';

export const SPEAKER_OPTIONS = [
  { value: 'MAN', label: 'Man' },
  { value: 'WOMAN', label: 'Woman' },
  { value: 'BOTH', label: 'Both' },
];

export const usePart3Action = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(19 * 60 + 58);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const { data: res, isLoading } = useListeningQuestionsQuery(3);
  const sets = useMemo(() => mapLPart3(res?.data ?? []), [res]);
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
  const currentSet = sets[safeSet] ?? { id: 0, mediaUrl: null, instruction: '', statements: [] };

  const keyOf = (statementId: number) => `${safeSet}-${statementId}`;
  const handleSelectChange = (statementId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [keyOf(statementId)]: value }));
  };
  const getAnswer = (statementId: number) => answers[keyOf(statementId)];

  const handleNext = () => { if (safeSet < setCount - 1) setCurrentSetIndex(safeSet + 1); };
  const handlePrev = () => { if (safeSet > 0) setCurrentSetIndex(safeSet - 1); else navigate({ to: '/listening' }); };

  const handleSubmit = () => {
    const saved = localStorage.getItem('aptis_listening_progress');
    let progressObj: Record<string, number> = {};
    if (saved) { try { progressObj = JSON.parse(saved); } catch { /* bỏ qua lỗi */ } }
    progressObj['l3'] = 100;
    localStorage.setItem('aptis_listening_progress', JSON.stringify(progressObj));
    message.success('Đã ghi nhận câu trả lời! Bạn có thể luyện bài tiếp theo.');
  };

  const totalStatements = currentSet.statements.length;
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
    timeLeft,
    currentSet,
    totalStatements,
    getAnswer,
    handleSelectChange,
    handleSubmit,
    answeredCount,
    progressPercent,
    formatTime
  };
};
