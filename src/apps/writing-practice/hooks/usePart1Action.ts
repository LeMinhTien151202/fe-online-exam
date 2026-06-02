import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { message } from 'antd';
import { countWords } from '../utils/wordCounter';

export const usePart1Action = (
  answers: Record<number, string>,
  setAnswers: React.Dispatch<React.SetStateAction<Record<number, string>>>
) => {
  const navigate = useNavigate();
  const [showSampleModal, setShowSampleModal] = useState(false);

  const handleAnswerChange = (id: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = () => {
    const keys = Object.keys(answers).map(Number);
    const hasEmpty = keys.some(k => !answers[k].trim());
    const hasInvalid = keys.some(k => {
      const wc = countWords(answers[k]);
      return wc > 5;
    });

    if (hasEmpty) {
      message.warning("Vui lòng trả lời đầy đủ tất cả 5 câu hỏi!");
      return;
    }

    if (hasInvalid) {
      message.error("Có câu hỏi vượt quá giới hạn 5 từ! Vui lòng chỉnh sửa lại.");
      return;
    }

    message.success("Đã hoàn thành luyện tập Part 1!");
    navigate({ to: '/writing/part/2' });
  };

  const handleBack = () => {
    navigate({ to: '/writing' });
  };

  return {
    showSampleModal,
    setShowSampleModal,
    handleAnswerChange,
    handleSubmit,
    handleBack
  };
};
