import { useState } from 'react';
import { Form, message } from 'antd';
import { useNavigate } from '@tanstack/react-router';
import { mockBankQuestions } from '../services/mockData';

export const useCreateExam = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState<any[]>([]);

  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        await form.validateFields(['name', 'type', 'skill', 'part', 'duration']);
      }
      setCurrentStep(prev => prev + 1);
    } catch (err) {
      message.error('Vui lòng điền đủ các thông tin bắt buộc!');
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleAddQuestion = (record: any) => {
    if (selectedQuestions.some(q => q.key === record.key)) {
      message.warning('Câu hỏi này đã được chọn!');
      return;
    }
    setSelectedQuestions([...selectedQuestions, record]);
  };

  const handleRemoveQuestion = (key: string) => {
    setSelectedQuestions(selectedQuestions.filter(q => q.key !== key));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newQuestions = [...selectedQuestions];
    const temp = newQuestions[index];
    newQuestions[index] = newQuestions[index - 1];
    newQuestions[index - 1] = temp;
    setSelectedQuestions(newQuestions);
  };

  const handleMoveDown = (index: number) => {
    if (index === selectedQuestions.length - 1) return;
    const newQuestions = [...selectedQuestions];
    const temp = newQuestions[index];
    newQuestions[index] = newQuestions[index + 1];
    newQuestions[index + 1] = temp;
    setSelectedQuestions(newQuestions);
  };

  const handleAddRandom = (count: number) => {
    const available = mockBankQuestions.filter(bq => !selectedQuestions.some(sq => sq.key === bq.key));
    if (available.length === 0) {
      message.info('Không còn câu hỏi ngẫu nhiên trong ngân hàng!');
      return;
    }
    const shuffle = [...available].sort(() => 0.5 - Math.random());
    const slice = shuffle.slice(0, Math.min(count, shuffle.length));
    setSelectedQuestions([...selectedQuestions, ...slice]);
    message.success(`Đã thêm ${slice.length} câu hỏi ngẫu nhiên!`);
  };

  const handlePublish = () => {
    message.success('Đã xuất bản bộ đề thi thành công!');
    navigate({ to: '/admin/exams' });
  };

  return {
    navigate,
    form,
    currentStep,
    setCurrentStep,
    selectedQuestions,
    setSelectedQuestions,
    mockBankQuestions,
    handleNext,
    handleBack,
    handleAddQuestion,
    handleRemoveQuestion,
    handleMoveUp,
    handleMoveDown,
    handleAddRandom,
    handlePublish,
  };
};
