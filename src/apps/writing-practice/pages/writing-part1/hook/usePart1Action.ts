import {
  useMemo,
  useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { toast } from '../../../../../configs/toast';
import { countWords } from '../../../utils/wordCounter';
import { mapWPart1 } from '../../../services/mappers';
import { flattenWritingExam } from '../../../services/writingExamMapper';
import { usePartPracticeExam } from '../../../../../shared/services/student-exam';
import { usePerQuestionGrading } from '../../../../../shared/hooks/usePerQuestionGrading';
import { confirmSubmitExam } from '../../../../../shared/utils/examDialogs';

export const usePart1Action = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // Luyện theo phần = đề PART_PRACTICE (skill 4, part 1 — ESSAY).
  const { examId, examDetail, isLoading } = usePartPracticeExam(4, 1);
  const list = useMemo(() => {
    if (!examDetail) return [];
    return flattenWritingExam(examDetail).find((p) => p.partNumber === 1)?.questions ?? [];
  }, [examDetail]);
  const total = list.length;

  // Chấm ngay từng đề: nộp riêng đề đang làm, AI trả điểm/nhận xét liền.
  const { grades, gradingKey, gradeOne, resetGrade } = usePerQuestionGrading();
  const [index, setIndex] = useState(0);
  const safeIndex = total > 0 ? Math.min(index, total - 1) : 0;
  const data = useMemo(() => {
    const q = list[safeIndex];
    return q ? mapWPart1(q) : null;
  }, [list, safeIndex]);

  const questions = data?.questions ?? [];
  const wordMin = data?.wordMin ?? 1;
  const wordMax = data?.wordMax ?? 5;

  const getWordCount = (text: string) => countWords(text);
  const isWordCountValid = (text: string) => {
    const wc = getWordCount(text);
    return wc >= wordMin && wc <= wordMax;
  };

  const gradeKey = String(safeIndex);
  const currentGrade = grades[gradeKey] ?? null;
  const isSubmitted = currentGrade != null;
  const isGrading = gradingKey === gradeKey;

  const handleAnswerChange = (id: number, value: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    if (!questions.length || isSubmitted) return;
    const hasEmpty = questions.some((q) => !(answers[q.id] || '').trim());
    const hasInvalid = questions.some((q) => getWordCount(answers[q.id] || '') > wordMax);
    if (hasEmpty) {
      toast.warning(`Vui lòng trả lời đầy đủ tất cả ${questions.length} câu hỏi!`);
      return;
    }
    if (hasInvalid) {
      toast.error(`Có câu hỏi vượt quá giới hạn ${wordMax} từ! Vui lòng chỉnh sửa lại.`);
      return;
    }
    confirmSubmitExam({ totalQuestions: questions.length, onOk: doSubmit });
  };

  // Nộp RIÊNG đề đang làm để AI chấm và trả kết quả ngay (giống luyện theo phần của Reading/Speaking).
  // ESSAY = mảng bài viết theo thứ tự câu con.
  const doSubmit = () => {
    const dbQuestion = list[safeIndex];
    const response = questions.map((q) => answers[q.id] ?? '');
    if (!response.some((v) => v.trim() !== '')) return;
    gradeOne({ key: gradeKey, examId, questionId: dbQuestion?.id, response });
  };

  // Làm lại đúng đề này: xoá bài viết để mở khoá ô nhập (kết quả cũ vẫn giữ tới khi chấm lại).
  const handleRetry = () => {
    setAnswers({});
    resetGrade(gradeKey);
  };

  const handleBack = () => navigate({ to: '/writing' });

  const handleNext = () => {
    if (safeIndex >= total - 1) return;
    setIndex(safeIndex + 1);
    setAnswers({});
  };
  const handlePrev = () => {
    if (safeIndex <= 0) return;
    setIndex(safeIndex - 1);
    setAnswers({});
  };
  const goTo = (idx: number) => {
    if (idx === safeIndex) return;
    setIndex(idx);
    setAnswers({});
  };

  const hasCurrentInput = questions.some((q) => (answers[q.id] || '').trim());
  const boardItems = Array.from({ length: total }, (_, i) => {
    const status: 'unanswered' | 'partial' | 'answered' = grades[String(i)]
      ? 'answered'
      : i === safeIndex && hasCurrentInput
        ? 'partial'
        : 'unanswered';
    return { key: i, label: i + 1, status };
  });

  return {
    isLoading,
    hasData: !!data,
    instruction: data?.instruction ?? '',
    wordMin,
    wordMax,
    answers,
    handleAnswerChange,
    isWordCountValid,
    getWordCount,
    handleSubmit,
    handleRetry,
    isSubmitted,
    isGrading,
    grade: currentGrade,
    handleBack,
    questions,
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
