import { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { message } from 'antd';
import { countWords } from '../../../utils/wordCounter';
import { useWritingTimer } from '../../writing-part1/hook/useWritingTimer';
import { useWritingQuestionsQuery } from '../../../services/writingQuery';
import { mapWPart2 } from '../../../services/mappers';

export const usePart2Action = () => {
  const navigate = useNavigate();
  const timer = useWritingTimer(3 * 60);
  const [answer, setAnswer] = useState('');

  const { data: res, isLoading } = useWritingQuestionsQuery(2);
  const list = useMemo(() => res?.data ?? [], [res]);
  const total = list.length;
  const [index, setIndex] = useState(0);
  const safeIndex = total > 0 ? Math.min(index, total - 1) : 0;
  const data = useMemo(() => {
    const q = list[safeIndex];
    return q ? mapWPart2(q) : null;
  }, [list, safeIndex]);

  const wordMin = data?.wordMin ?? 20;
  const wordMax = data?.wordMax ?? 30;

  const getWordCount = (text: string) => countWords(text);
  const isWordCountValid = (text: string) => {
    const wc = getWordCount(text);
    return wc >= wordMin && wc <= wordMax;
  };

  const handleAnswerChange = (value: string) => setAnswer(value);

  const handleSubmit = () => {
    const wc = countWords(answer);
    if (!answer.trim()) {
      message.warning('Vui lòng nhập câu trả lời của bạn!');
      return;
    }
    if (wc < wordMin || wc > wordMax) {
      message.error(`Số lượng từ hiện tại (${wc}) chưa nằm trong khoảng quy định ${wordMin}-${wordMax} từ!`);
      return;
    }
    message.success('Đã hoàn thành câu hỏi này! Bạn có thể luyện câu tiếp theo.');
  };

  const handleBack = () => navigate({ to: '/writing' });

  const handleNext = () => {
    if (safeIndex >= total - 1) return;
    setIndex(safeIndex + 1);
    setAnswer('');
  };
  const handlePrev = () => {
    if (safeIndex <= 0) return;
    setIndex(safeIndex - 1);
    setAnswer('');
  };

  return {
    isLoading,
    hasData: !!data,
    prompt: data?.prompt ?? '',
    sampleAnswer: data?.sampleAnswer,
    wordMin,
    wordMax,
    answer,
    timer,
    handleAnswerChange,
    isWordCountValid,
    getWordCount,
    handleSubmit,
    handleBack,
    total,
    currentNumber: total > 0 ? safeIndex + 1 : 0,
    hasNext: safeIndex < total - 1,
    hasPrev: safeIndex > 0,
    handleNext,
    handlePrev,
  };
};
