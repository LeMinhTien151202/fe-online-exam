import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { message } from 'antd';
import { countWords } from '../../../utils/wordCounter';
import { useWritingTimer } from '../../writing-part1/hook/useWritingTimer';
import { mockPart2Question } from '../services/data';

export const usePart2Action = () => {
  const navigate = useNavigate();
  const timer = useWritingTimer(3 * 60); // 3 minutes
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [answer, setAnswer] = useState('');

  const getWordCount = (text: string) => countWords(text);

  const isWordCountValid = (text: string) => {
    const wc = getWordCount(text);
    return wc >= 20 && wc <= 30;
  };

  const handleAnswerChange = (value: string) => {
    setAnswer(value);
  };

  const handleSubmit = () => {
    const wc = countWords(answer);
    if (!answer.trim()) {
      message.warning("Vui lòng nhập câu trả lời của bạn!");
      return;
    }
    if (wc < 20 || wc > 30) {
      message.error(`Số lượng từ hiện tại (${wc}) chưa nằm trong khoảng quy định 20-30 từ!`);
      return;
    }

    message.success("Đã hoàn thành luyện tập Part 2!");
    navigate({ to: '/writing/part/3' });
  };

  const handleBack = () => {
    navigate({ to: '/writing/part/1' });
  };

  return {
    answer,
    timer,
    showSampleModal,
    setShowSampleModal,
    handleAnswerChange,
    isWordCountValid,
    getWordCount,
    handleSubmit,
    handleBack,
    question: mockPart2Question
  };
};
