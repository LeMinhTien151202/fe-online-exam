import { useState, useEffect } from 'react';
import { Form, message } from 'antd';
import { useParams, useNavigate } from '@tanstack/react-router';
import { initialQuestions } from '../services/mockData';

export const useQuestions = () => {
  const { skillId = 'grammar' } = useParams({ strict: false }) as any;
  const navigate = useNavigate();
  const [partTab, setPartTab] = useState('part1');
  const [questions, setQuestions] = useState(initialQuestions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);

  const [form] = Form.useForm();

  // Reset partTab when skillId changes
  useEffect(() => {
    setPartTab('part1');
  }, [skillId]);

  const handleNextStep = async () => {
    try {
      if (currentStep === 0) {
        await form.validateFields(['skill', 'part', 'difficulty']);
      }
      setCurrentStep(prev => prev + 1);
    } catch (err) {
      message.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleCreateQuestion = () => {
    form.resetFields();
    setSelectedQuestion(null);
    setCurrentStep(0);
    setIsModalOpen(true);
  };

  const handleSaveQuestion = () => {
    const values = form.getFieldsValue();
    const newQuestion = {
      key: String(questions.length + 1),
      content: values.content || 'Nội dung câu hỏi mẫu vừa tạo...',
      type: values.skill || 'Grammar',
      difficulty: values.difficulty || 'easy',
      tags: values.tags || ['General'],
      useCount: 0,
      successRate: 100,
      status: values.status || 'draft',
      updatedAt: '03/06/2026',
    };
    setQuestions([newQuestion, ...questions]);
    setIsModalOpen(false);
    message.success('Đã lưu câu hỏi thành công!');
  };

  return {
    skillTab: skillId,
    setSkillTab: (val: string) => navigate({ to: `/admin/questions/${val}` as any }),
    partTab,
    setPartTab,
    questions,
    isModalOpen,
    setIsModalOpen,
    currentStep,
    setCurrentStep,
    selectedQuestion,
    setSelectedQuestion,
    form,
    handleNextStep,
    handlePrevStep,
    handleCreateQuestion,
    handleSaveQuestion,
  };
};
