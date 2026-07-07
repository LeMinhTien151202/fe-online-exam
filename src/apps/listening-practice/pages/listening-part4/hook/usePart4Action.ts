import { message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useListeningQuestionsQuery } from '../../../services/listeningQuery';
import { mapLPart4 } from '../../../services/mappers';

export const usePart4Action = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(9 * 60 + 15);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const { data: res, isLoading } = useListeningQuestionsQuery(4);
  const groups = useMemo(() => mapLPart4(res?.data ?? []), [res]);
  const groupCount = groups.length;

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const safeGroup = groupCount > 0 ? Math.min(currentGroupIndex, groupCount - 1) : 0;
  const currentGroup = groups[safeGroup] ?? { id: 0, title: '', instruction: '', mediaUrl: null, subQuestions: [] };

  const handleSelectAnswer = (subQuestionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [subQuestionId]: answer }));
  };

  const handleNext = () => { if (safeGroup < groupCount - 1) setCurrentGroupIndex(safeGroup + 1); };
  const handlePrev = () => { if (safeGroup > 0) setCurrentGroupIndex(safeGroup - 1); else navigate({ to: '/listening' }); };

  const handleSubmit = () => {
    const saved = localStorage.getItem('aptis_listening_progress');
    let progressObj: Record<string, number> = {};
    if (saved) { try { progressObj = JSON.parse(saved); } catch { /* bỏ qua lỗi */ } }
    progressObj['l4'] = 100;
    localStorage.setItem('aptis_listening_progress', JSON.stringify(progressObj));
    message.success('Đã ghi nhận câu trả lời! Bạn có thể luyện bài tiếp theo.');
  };

  const totalSub = currentGroup.subQuestions.length;
  let answeredCount = 0;
  currentGroup.subQuestions.forEach((sq) => { if (answers[sq.id]) answeredCount++; });
  const progressPercent = totalSub > 0 ? (answeredCount / totalSub) * 100 : 0;

  return {
    isLoading,
    hasData: groupCount > 0,
    groupCount,
    currentGroupNumber: safeGroup + 1,
    hasNext: safeGroup < groupCount - 1,
    hasPrev: safeGroup > 0,
    handleNext,
    handlePrev,
    timeLeft,
    answers,
    handleSelectAnswer,
    handleSubmit,
    answeredCount,
    totalSub,
    progressPercent,
    currentGroup,
    formatTime
  };
};
