import { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { message } from 'antd';
import { countWords } from '../../../utils/wordCounter';
import { useWritingTimer } from './useWritingTimer';
import { mapWPart1 } from '../../../services/mappers';
import { flattenWritingExam } from '../../../services/writingExamMapper';
import { usePartPracticeExam, useSubmitExamMutation } from '../../../../../shared/services/student-exam';
import { confirmSubmitExam } from '../../../../../shared/utils/examDialogs';

export const usePart1Action = () => {
  const navigate = useNavigate();
  const timer = useWritingTimer(3 * 60);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [doneSets, setDoneSets] = useState<Set<number>>(new Set());

  // Luyện theo phần = đề PART_PRACTICE (skill 4, part 1 — ESSAY).
  const { examId, examDetail, isLoading } = usePartPracticeExam(4, 1);
  const list = useMemo(() => {
    if (!examDetail) return [];
    return flattenWritingExam(examDetail).find((p) => p.partNumber === 1)?.questions ?? [];
  }, [examDetail]);
  const total = list.length;

  const submitMutation = useSubmitExamMutation();
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

  const handleAnswerChange = (id: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    if (!questions.length) return;
    const hasEmpty = questions.some((q) => !(answers[q.id] || '').trim());
    const hasInvalid = questions.some((q) => getWordCount(answers[q.id] || '') > wordMax);
    if (hasEmpty) {
      message.warning(`Vui lòng trả lời đầy đủ tất cả ${questions.length} câu hỏi!`);
      return;
    }
    if (hasInvalid) {
      message.error(`Có câu hỏi vượt quá giới hạn ${wordMax} từ! Vui lòng chỉnh sửa lại.`);
      return;
    }
    confirmSubmitExam({ totalQuestions: questions.length, onOk: doSubmit });
  };

  const doSubmit = () => {
    message.success('Đã hoàn thành câu hỏi này! Bạn có thể luyện câu tiếp theo.');
    setDoneSets((prev) => new Set(prev).add(safeIndex));

    // Nộp lên BE để tăng student_progress (skill 4, part 1). ESSAY = mảng bài viết theo thứ tự câu con.
    const dbQuestion = list[safeIndex];
    if (examId && dbQuestion) {
      const response = questions.map((q) => answers[q.id] ?? '');
      if (response.some((v) => v.trim() !== '')) {
        submitMutation.mutate({ examId, payload: { answers: [{ questionId: dbQuestion.id, response }] } });
      }
    }
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
    const status: 'unanswered' | 'partial' | 'answered' = doneSets.has(i)
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
    timer,
    handleAnswerChange,
    isWordCountValid,
    getWordCount,
    handleSubmit,
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
