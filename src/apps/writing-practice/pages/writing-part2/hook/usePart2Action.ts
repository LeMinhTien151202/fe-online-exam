import { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { message } from 'antd';
import { countWords } from '../../../utils/wordCounter';
import { useWritingTimer } from '../../writing-part1/hook/useWritingTimer';
import { mapWPart2 } from '../../../services/mappers';
import { flattenWritingExam } from '../../../services/writingExamMapper';
import { usePartPracticeExam, useSubmitExamMutation } from '../../../../../shared/services/student-exam';
import { confirmSubmitExam } from '../../../../../shared/utils/examDialogs';

export const usePart2Action = () => {
  const navigate = useNavigate();
  const timer = useWritingTimer(3 * 60);
  const [answer, setAnswer] = useState('');
  const [doneSets, setDoneSets] = useState<Set<number>>(new Set());

  // Luyện theo phần = đề PART_PRACTICE (skill 4, part 2 — ESSAY).
  const { examId, examDetail, isLoading } = usePartPracticeExam(4, 2);
  const list = useMemo(() => {
    if (!examDetail) return [];
    return flattenWritingExam(examDetail).find((p) => p.partNumber === 2)?.questions ?? [];
  }, [examDetail]);
  const total = list.length;

  const submitMutation = useSubmitExamMutation();
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

  const handleAnswerChange = (value: string) => setAnswer(value);

  const handleSubmit = () => {
    const wc = countWords(answer);
    if (!answer.trim()) {
      message.warning('Vui lòng nhập câu trả lời của bạn!');
      return;
    }
    if (wc < wordMin || wc > wordMax) {
      message.error(`Số lượng từ hiện tại (${wc}) chưa nằm trong khoảng quy định ${wordMin}-${wordMax} từ!`);
      return;
    }
    confirmSubmitExam({ totalQuestions: 1, onOk: doSubmit });
  };

  const doSubmit = () => {
    message.success('Đã hoàn thành câu hỏi này! Bạn có thể luyện câu tiếp theo.');
    setDoneSets((prev) => new Set(prev).add(safeIndex));

    // Nộp lên BE để tăng student_progress (skill 4, part 2). ESSAY = mảng 1 bài viết.
    const dbQuestion = list[safeIndex];
    if (examId && dbQuestion) {
      submitMutation.mutate({ examId, payload: { answers: [{ questionId: dbQuestion.id, response: [answer] }] } });
    }
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
    const status: 'unanswered' | 'partial' | 'answered' = doneSets.has(i)
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
    timer,
    handleAnswerChange,
    isWordCountValid,
    getWordCount,
    handleSubmit,
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
