import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { message } from 'antd';
import { countWords } from '../../../utils/wordCounter';
import { useWritingTimer } from '../../writing-part1/hook/useWritingTimer';
import { mockPart3Messages } from '../services/data';

export const usePart3Action = () => {
  const navigate = useNavigate();
  const timer = useWritingTimer(10 * 60); // 10 minutes
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({
    1: '',
    2: '',
    3: ''
  });

  const getWordCount = (text: string) => countWords(text);

  const isWordCountValid = (text: string) => {
    const wc = getWordCount(text);
    return wc >= 30 && wc <= 40;
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
      return wc < 30 || wc > 40;
    });

    if (hasEmpty) {
      message.warning("Vui lòng trả lời đầy đủ cả 3 tin nhắn trong đoạn chat!");
      return;
    }

    if (hasInvalid) {
      message.error("Có câu trả lời chưa đạt giới hạn 30-40 từ! Vui lòng kiểm tra lại.");
      return;
    }

    message.success("Đã hoàn thành luyện tập Part 3!");
    navigate({ to: '/writing/part/4' });
  };

  const handleBack = () => {
    navigate({ to: '/writing/part/2' });
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
    messages: mockPart3Messages
  };
};
