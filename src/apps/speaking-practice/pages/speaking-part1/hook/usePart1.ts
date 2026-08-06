import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { mapSpeakingP1, SpeakingP1Item } from '../../../services/mappers';
import { flattenSpeakingExam } from '../../../services/speakingExamMapper';
import { usePartPracticeExam } from '../../../../../shared/services/student-exam';
import { usePerQuestionGrading } from '../../../hooks/usePerQuestionGrading';

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

  const { grades, gradingKey, gradeOne } = usePerQuestionGrading();

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

  const handleRecordComplete = (audioUrl: string | null) => {
    setAnswers((prev) => ({ ...prev, [safeIndex]: audioUrl ?? '' }));
  };

  // Chấm ngay câu hiện tại (P1: 1 câu = 1 URL). Khoá theo questionId thật để giữ kết quả.
  const currentQ = questions[safeIndex - 1];
  const currentGradeKey = currentQ?.questionId != null ? `p1-${currentQ.questionId}` : '';
  const currentGrade = currentGradeKey ? grades[currentGradeKey] : undefined;
  const isGradingCurrent = !!currentGradeKey && gradingKey === currentGradeKey;
  const currentAudio = answers[safeIndex];
  const canGradeCurrent = !!currentAudio && currentQ?.questionId != null;
  const gradeCurrent = () => {
    if (!currentQ?.questionId || !currentAudio) return;
    gradeOne({ key: currentGradeKey, examId, questionId: currentQ.questionId, response: currentAudio });
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
    handleRecordComplete,
    currentQuestion,
    currentGrade,
    isGradingCurrent,
    canGradeCurrent,
    gradeCurrent,
    answeredCount,
    progressPercent,
    mockQuestions: questions,
    total,
    hasNext: safeIndex < total,
    hasPrev: safeIndex > 1,
  };
};
