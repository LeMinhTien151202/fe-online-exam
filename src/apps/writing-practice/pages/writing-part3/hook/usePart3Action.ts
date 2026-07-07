import { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { message } from 'antd';
import { countWords } from '../../../utils/wordCounter';
import { useWritingTimer } from '../../writing-part1/hook/useWritingTimer';
import { useWritingQuestionsQuery } from '../../../services/writingQuery';
import { mapWPart3 } from '../../../services/mappers';

export const usePart3Action = () => {
  const navigate = useNavigate();
  const timer = useWritingTimer(10 * 60);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const { data: res, isLoading } = useWritingQuestionsQuery(3);
  const list = useMemo(() => res?.data ?? [], [res]);
  const total = list.length;
  const [index, setIndex] = useState(0);
  const safeIndex = total > 0 ? Math.min(index, total - 1) : 0;
  const data = useMemo(() => {
    const q = list[safeIndex];
    return q ? mapWPart3(q) : null;
  }, [list, safeIndex]);

  const messages = data?.messages ?? [];
  const wordMin = data?.wordMin ?? 30;
  const wordMax = data?.wordMax ?? 40;

  const getWordCount = (text: string) => countWords(text);
  const isWordCountValid = (text: string) => {
    const wc = getWordCount(text);
    return wc >= wordMin && wc <= wordMax;
  };

  const handleAnswerChange = (id: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    if (!messages.length) return;
    const hasEmpty = messages.some((m) => !(answers[m.id] || '').trim());
    const hasInvalid = messages.some((m) => {
      const wc = getWordCount(answers[m.id] || '');
      return wc < wordMin || wc > wordMax;
    });
    if (hasEmpty) {
      message.warning(`Vui lòng trả lời đầy đủ cả ${messages.length} tin nhắn trong đoạn chat!`);
      return;
    }
    if (hasInvalid) {
      message.error(`Có câu trả lời chưa đạt giới hạn ${wordMin}-${wordMax} từ! Vui lòng kiểm tra lại.`);
      return;
    }
    message.success('Đã hoàn thành câu hỏi này! Bạn có thể luyện câu tiếp theo.');
  };

  const handleBack = () => navigate({ to: '/writing' });

  const handleNext = () => {
    if (safeIndex >= total - 1) return;
    setIndex(safeIndex + 1);
    setAnswers({});
  };
  const handlePrev = () => {
    if (safeIndex <= 0) return;
    setIndex(safeIndex - 1);
    setAnswers({});
  };

  return {
    isLoading,
    hasData: !!data,
    wordMin,
    wordMax,
    answers,
    timer,
    handleAnswerChange,
    isWordCountValid,
    getWordCount,
    handleSubmit,
    handleBack,
    messages,
    total,
    currentNumber: total > 0 ? safeIndex + 1 : 0,
    hasNext: safeIndex < total - 1,
    hasPrev: safeIndex > 0,
    handleNext,
    handlePrev,
  };
};
