import { useState } from 'react';
import { Form, message } from 'antd';
import { useNavigate, useParams } from '@tanstack/react-router';

export const useDetailGrading = () => {
  const navigate = useNavigate();
  const { resultId } = useParams({ from: '/admin/grading/$resultId' as any }) as any;
  const [form] = Form.useForm();

  // Score states
  const [taskAchievement, setTaskAchievement] = useState<number>(18);
  const [coherence, setCoherence] = useState<number>(15);
  const [lexical, setLexical] = useState<number>(17);
  const [grammar, setGrammar] = useState<number>(16);

  const totalScore = taskAchievement + coherence + lexical + grammar;

  const handleSave = () => {
    message.success(`Đã lưu điểm thành công: ${totalScore}/100!`);
    navigate({ to: '/admin/grading' });
  };

  const isSpeaking = resultId === '1';

  return {
    navigate,
    resultId,
    form,
    taskAchievement,
    setTaskAchievement,
    coherence,
    setCoherence,
    lexical,
    setLexical,
    grammar,
    setGrammar,
    totalScore,
    handleSave,
    isSpeaking,
  };
};
