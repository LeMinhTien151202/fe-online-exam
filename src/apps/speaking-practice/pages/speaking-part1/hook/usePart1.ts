import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { message } from 'antd';
import { mapSpeakingP1, SpeakingP1Item } from '../../../services/mappers';
import { flattenSpeakingExam } from '../../../services/speakingExamMapper';
import { ISubmitAnswer, usePartPracticeExam, useSubmitExamMutation } from '../../../../../shared/services/student-exam';
import { confirmSubmitExam } from '../../../../../shared/utils/examDialogs';

export const usePart1 = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(12 * 60);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [showTips, setShowTips] = useState(false);
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [activeSampleIdx, setActiveSampleIdx] = useState(0);

  // Luyện theo phần = đề PART_PRACTICE (skill 5, part 1 — RECORD).
  const { examId, examDetail, isLoading } = usePartPracticeExam(5, 1);
  const questions = useMemo<SpeakingP1Item[]>(() => {
    if (!examDetail) return [];
    const part = flattenSpeakingExam(examDetail).find((p) => p.partNumber === 1);
    return mapSpeakingP1(part?.questions ?? []);
  }, [examDetail]);
  const total = questions.length;

  const submitMutation = useSubmitExamMutation();

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const safeIndex = total > 0 ? Math.min(currentQuestionIndex, total) : 1;

  const handleNext = () => {
    if (safeIndex < total) {
      setCurrentQuestionIndex(safeIndex + 1);
      setShowSampleAnswer(false);
      setActiveSampleIdx(0);
    }
  };

  const handleBack = () => {
    if (safeIndex > 1) {
      setCurrentQuestionIndex(safeIndex - 1);
      setShowSampleAnswer(false);
      setActiveSampleIdx(0);
    } else {
      navigate({ to: '/speaking' });
    }
  };

  const handleSubmit = () => {
    confirmSubmitExam({
      unansweredCount: total - Object.values(answers).filter((v) => !!v).length,
      totalQuestions: total,
      onOk: doSubmit,
    });
  };

  const doSubmit = () => {
    message.success('Đã ghi nhận phần trả lời của bạn! Bạn có thể luyện câu tiếp theo.');

    // Nộp lên BE để tăng student_progress (skill 5, part 1). RECORD P1 = 1 URL cho mỗi câu.
    if (examId) {
      const submitAnswers: ISubmitAnswer[] = [];
      questions.forEach((q, i) => {
        if (q.questionId == null) return;
        const url = answers[i + 1];
        if (url) submitAnswers.push({ questionId: q.questionId, response: url });
      });
      if (submitAnswers.length) submitMutation.mutate({ examId, payload: { answers: submitAnswers } });
    }
  };

  const handleRecordComplete = (audioUrl: string | null) => {
    setAnswers((prev) => ({ ...prev, [safeIndex]: audioUrl ?? '' }));
  };

  const currentQuestion = questions[safeIndex - 1] ?? { id: 0, questionText: '', sampleAnswers: [] };
  const answeredCount = Object.values(answers).filter((v) => !!v).length;
  const progressPercent = total > 0 ? Math.round((answeredCount / total) * 100) : 0;

  return {
    navigate,
    isLoading,
    hasData: total > 0,
    timeLeft,
    currentQuestionIndex: safeIndex,
    setCurrentQuestionIndex,
    answers,
    showTips,
    setShowTips,
    showSampleAnswer,
    setShowSampleAnswer,
    activeSampleIdx,
    setActiveSampleIdx,
    formatTime,
    handleNext,
    handleBack,
    handleSubmit,
    handleRecordComplete,
    currentQuestion,
    answeredCount,
    progressPercent,
    mockQuestions: questions,
    total,
    hasNext: safeIndex < total,
    hasPrev: safeIndex > 1,
  };
};
