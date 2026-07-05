import { useNavigate } from '@tanstack/react-router';
import { message } from 'antd';
import { useEffect,useState } from 'react';

export const usePart3Action = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(19 * 60 + 58); // 19:58 mock
  const [showTranscript, setShowTranscript] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectChange = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    const saved = localStorage.getItem('aptis_listening_progress');
    let progressObj: Record<string, number> = {};
    if (saved) {
      try {
        progressObj = JSON.parse(saved);
      } catch (e) { /* bỏ qua lỗi */ }
    }
    progressObj['l3'] = 100;
    localStorage.setItem('aptis_listening_progress', JSON.stringify(progressObj));

    message.success('Đã nộp bài Part 3!');
    navigate({ to: '/listening/part/4' });
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / 4) * 100;

  return {
    timeLeft,
    showTranscript,
    setShowTranscript,
    answers,
    handleSelectChange,
    handleSubmit,
    answeredCount,
    progressPercent,
    formatTime
  };
};
