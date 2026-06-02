import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { message } from 'antd';
import { countWords } from '../../../utils/wordCounter';
import { useWritingTimer } from './useWritingTimer';
import { mockPart1Questions } from '../services/data';

export const usePart1Action = () => {
  const navigate = useNavigate();
  const timer = useWritingTimer(3 * 60); // 3 minutes recommended
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({
    1: '',
    2: '',
    3: '',
    4: '',
    5: ''
  });

  const getWordCount = (text: string) => countWords(text);

  const isWordCountValid = (text: string) => {
    const wc = getWordCount(text);
    return wc >= 1 && wc <= 5;
  };

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
    answers,
    timer,
    showSampleModal,
    setShowSampleModal,
    handleAnswerChange,
    isWordCountValid,
    getWordCount,
    handleSubmit,
    handleBack,
    questions: mockPart1Questions
  };
};
