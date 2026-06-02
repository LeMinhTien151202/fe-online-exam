import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { message } from 'antd';
import { countWords } from '../../../utils/wordCounter';
import { useWritingTimer } from '../../writing-part1/hook/useWritingTimer';
import { mockPart4Scenario } from '../services/data';

export const usePart4Action = () => {
  const navigate = useNavigate();
  const timer = useWritingTimer(20 * 60); // 20 minutes
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [informalEmail, setInformalEmail] = useState('');
  const [formalEmail, setFormalEmail] = useState('');

  const getWordCount = (text: string) => countWords(text);

  const isInformalValid = (text: string) => {
    const wc = getWordCount(text);
    return wc >= 40 && wc <= 60; // range around 50 words
  };

  const isFormalValid = (text: string) => {
    const wc = getWordCount(text);
    return wc >= 120 && wc <= 150; // exact range
  };

  const handleInformalChange = (value: string) => {
    setInformalEmail(value);
  };

  const handleFormalChange = (value: string) => {
    setFormalEmail(value);
  };

  const handleSubmit = () => {
    const infWc = countWords(informalEmail);
    const formWc = countWords(formalEmail);

    if (!informalEmail.trim() || !formalEmail.trim()) {
      message.warning("Vui lòng hoàn thành cả 2 email!");
      return;
    }

    if (infWc < 40 || infWc > 60) {
      message.error(`Email thân mật (${infWc} từ) chưa đúng giới hạn khoảng 50 từ (40-60 từ)!`);
      return;
    }

    if (formWc < 120 || formWc > 150) {
      message.error(`Email trang trọng (${formWc} từ) chưa đúng giới hạn 120-150 từ!`);
      return;
    }

    message.success("Xin chúc mừng! Bạn đã hoàn thành xuất sắc toàn bộ bài thi viết (Writing Practice)!");
    navigate({ to: '/writing' });
  };

  const handleBack = () => {
    navigate({ to: '/writing/part/3' });
  };

  return {
    informalEmail,
    formalEmail,
    timer,
    showSampleModal,
    setShowSampleModal,
    handleInformalChange,
    handleFormalChange,
    isInformalValid,
    isFormalValid,
    getWordCount,
    handleSubmit,
    handleBack,
    scenario: mockPart4Scenario
  };
};
