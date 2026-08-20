import {
  useMemo,
  useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { toast } from '../../../../../configs/toast';
import { countWords } from '../../../utils/wordCounter';
import { mapWPart2 } from '../../../services/mappers';
import { flattenWritingExam } from '../../../services/writingExamMapper';
import { usePartPracticeExam } from '../../../../../shared/services/student-exam';
import { usePerQuestionGrading } from '../../../../../shared/hooks/usePerQuestionGrading';
import { confirmSubmitExam } from '../../../../../shared/utils/examDialogs';

export const usePart2Action = () => {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState('');

  // Luyện theo phần = đề PART_PRACTICE (skill 4, part 2 — ESSAY).
  const { examId, examDetail, isLoading } = usePartPracticeExam(4, 2);
  const list = useMemo(() => {
    if (!examDetail) return [];
    return flattenWritingExam(examDetail).find((p) => p.partNumber === 2)?.questions ?? [];
  }, [examDetail]);
  const total = list.length;

  // Chấm ngay từng đề: nộp riêng đề đang làm, AI trả điểm/nhận xét liền.
  const { grades, gradingKey, gradeOne, resetGrade } = usePerQuestionGrading();
  const [index, setIndex] = useState(0);
  const safeIndex = total > 0 ? Math.min(index, total - 1) : 0;
  const data = useMemo(() => {
    const q = list[safeIndex];
    return q ? mapWPart2(q) : null;
  }, [list, safeIndex]);

  const wordMin = data?.wordMin ?? 20;
  const wordMax = data?.wordMax ?? 30;

  const getWordCount = (text: string) => countWords(text);
  const isWordCountValid = (text: string) => {
    const wc = getWordCount(text);
    return wc >= wordMin && wc <= wordMax;
  };

  const gradeKey = String(safeIndex);
  const currentGrade = grades[gradeKey] ?? null;
  const isSubmitted = currentGrade != null;
  const isGrading = gradingKey === gradeKey;

  const handleAnswerChange = (value: string) => {
    if (isSubmitted) return;
    setAnswer(value);
  };

  const handleSubmit = () => {
    if (isSubmitted) return;
    const wc = countWords(answer);
    if (!answer.trim()) {
      toast.warning('Vui lòng nhập câu trả lời của bạn!');
      return;
    }
    if (wc < wordMin || wc > wordMax) {
      toast.error(`Số lượng từ hiện tại (${wc}) chưa nằm trong khoảng quy định ${wordMin}-${wordMax} từ!`);
      return;
    }
    confirmSubmitExam({ totalQuestions: 1, onOk: doSubmit });
  };

  // Nộp RIÊNG đề đang làm để AI chấm và trả kết quả ngay. ESSAY = mảng 1 bài viết.
  const doSubmit = () => {
    const dbQuestion = list[safeIndex];
    gradeOne({ key: gradeKey, examId, questionId: dbQuestion?.id, response: [answer] });
  };

  // Làm lại đúng đề này: xoá bài viết + kết quả cũ để mở khoá ô nhập.
  const handleRetry = () => {
    setAnswer('');
    resetGrade(gradeKey);
  };

  const handleBack = () => navigate({ to: '/writing' });

  const handleNext = () => {
    if (safeIndex >= total - 1) return;
    setIndex(safeIndex + 1);
    setAnswer('');
  };
  const handlePrev = () => {
    if (safeIndex <= 0) return;
    setIndex(safeIndex - 1);
    setAnswer('');
  };
  const goTo = (idx: number) => {
    if (idx === safeIndex) return;
    setIndex(idx);
    setAnswer('');
  };

  const boardItems = Array.from({ length: total }, (_, i) => {
    const status: 'unanswered' | 'partial' | 'answered' = grades[String(i)]
      ? 'answered'
      : i === safeIndex && answer.trim()
        ? 'partial'
        : 'unanswered';
    return { key: i, label: i + 1, status };
  });

  return {
    isLoading,
    hasData: !!data,
    prompt: data?.prompt ?? '',
    sampleAnswer: data?.sampleAnswer,
    wordMin,
    wordMax,
    answer,
    handleAnswerChange,
    isWordCountValid,
    getWordCount,
    handleSubmit,
    handleRetry,
    isSubmitted,
    isGrading,
    grade: currentGrade,
    handleBack,
    total,
    currentNumber: total > 0 ? safeIndex + 1 : 0,
    hasNext: safeIndex < total - 1,
    hasPrev: safeIndex > 0,
    handleNext,
    handlePrev,
    goTo,
    boardItems,
    activeSetIndex: safeIndex,
  };
};
