import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { message } from 'antd';
import { useWritingTimer } from './useWritingTimer';
import { countWords } from '../utils/wordCounter';

export interface IPart1Question {
  id: number;
  questionText: string;
  exampleText: string;
  sampleAnswers: string[];
}

export const mockPart1Questions: IPart1Question[] = [
  {
    id: 1,
    questionText: "What is your hobby?",
    exampleText: "I like listening to music.",
    sampleAnswers: [
      "I love reading novels.",
      "Playing football with friends.",
      "I enjoy cooking dinner."
    ]
  },
  {
    id: 2,
    questionText: "What is the weather like today?",
    exampleText: "It is very sunny.",
    sampleAnswers: [
      "It is rainy today.",
      "Cold and very windy.",
      "It is warm outside."
    ]
  },
  {
    id: 3,
    questionText: "How do you travel to school/work?",
    exampleText: "I travel by motorbike.",
    sampleAnswers: [
      "I take the bus.",
      "I walk every day.",
      "By private car."
    ]
  },
  {
    id: 4,
    questionText: "What is your favorite food?",
    exampleText: "My favorite is Pho.",
    sampleAnswers: [
      "I like eating pizza.",
      "Fried rice and chicken.",
      "I love seafood noodles."
    ]
  },
  {
    id: 5,
    questionText: "Why do you want to learn English?",
    exampleText: "To find a job.",
    sampleAnswers: [
      "For my future career.",
      "To travel the world.",
      "To study abroad."
    ]
  }
];

export const usePart1 = () => {
  const navigate = useNavigate();
  const timer = useWritingTimer(3 * 60); // 3 minutes recommended
  const [answers, setAnswers] = useState<Record<number, string>>({
    1: '',
    2: '',
    3: '',
    4: '',
    5: ''
  });
  const [showSampleModal, setShowSampleModal] = useState(false);

  const handleAnswerChange = (id: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const isWordCountValid = (text: string) => {
    const wc = countWords(text);
    return wc >= 1 && wc <= 5;
  };

  const getWordCount = (text: string) => countWords(text);

  const handleSubmit = () => {
    // Check if any answer has more than 5 words or is empty
    const keys = Object.keys(answers).map(Number);
    const hasEmpty = keys.some(k => !answers[k].trim());
    const hasInvalid = keys.some(k => {
      const wc = getWordCount(answers[k]);
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
