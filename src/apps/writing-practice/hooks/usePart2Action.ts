import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { message } from 'antd';
import { countWords } from '../utils/wordCounter';

export const usePart2Action = (
  answer: string,
  setAnswer: React.Dispatch<React.SetStateAction<string>>
) => {
  const navigate = useNavigate();
  const [showSampleModal, setShowSampleModal] = useState(false);

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
    showSampleModal,
    setShowSampleModal,
    handleAnswerChange,
    handleSubmit,
    handleBack
  };
};
