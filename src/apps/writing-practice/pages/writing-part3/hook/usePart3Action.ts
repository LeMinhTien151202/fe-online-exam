import { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { message } from 'antd';
import { countWords } from '../../../utils/wordCounter';
import { useWritingTimer } from '../../writing-part1/hook/useWritingTimer';
import { mapWPart3 } from '../../../services/mappers';
import { flattenWritingExam } from '../../../services/writingExamMapper';
import { usePartPracticeExam, useSubmitExamMutation } from '../../../../../shared/services/student-exam';
import { confirmSubmitExam } from '../../../../../shared/utils/examDialogs';

export const usePart3Action = () => {
  const navigate = useNavigate();
  const timer = useWritingTimer(10 * 60);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // Luyện theo phần = đề PART_PRACTICE (skill 4, part 3 — ESSAY chat).
  const { examId, examDetail, isLoading } = usePartPracticeExam(4, 3);
  const list = useMemo(() => {
    if (!examDetail) return [];
    return flattenWritingExam(examDetail).find((p) => p.partNumber === 3)?.questions ?? [];
  }, [examDetail]);
  const total = list.length;

  const submitMutation = useSubmitExamMutation();
  const [index, setIndex] = useState(0);
  const safeIndex = total > 0 ? Math.min(index, total - 1) : 0;
  const data = useMemo(() => {
    const q = list[safeIndex];
    return q ? mapWPart3(q) : null;
  }, [list, safeIndex]);

  const messages = data?.messages ?? [];
  const wordMin = data?.wordMin ?? 30;
  const wordMax = data?.wordMax ?? 40;

  const getWordCount = (text: string) => countWords(text);
  const isWordCountValid = (text: string) => {
    const wc = getWordCount(text);
    return wc >= wordMin && wc <= wordMax;
  };

  const handleAnswerChange = (id: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    if (!messages.length) return;
    const hasEmpty = messages.some((m) => !(answers[m.id] || '').trim());
    const hasInvalid = messages.some((m) => {
      const wc = getWordCount(answers[m.id] || '');
      return wc < wordMin || wc > wordMax;
    });
    if (hasEmpty) {
      message.warning(`Vui lòng trả lời đầy đủ cả ${messages.length} tin nhắn trong đoạn chat!`);
      return;
    }
    if (hasInvalid) {
      message.error(`Có câu trả lời chưa đạt giới hạn ${wordMin}-${wordMax} từ! Vui lòng kiểm tra lại.`);
      return;
    }
    confirmSubmitExam({ totalQuestions: messages.length, onOk: doSubmit });
  };

  const doSubmit = () => {
    message.success('Đã hoàn thành câu hỏi này! Bạn có thể luyện câu tiếp theo.');

    // Nộp lên BE để tăng student_progress (skill 4, part 3). ESSAY = mảng trả lời theo thứ tự tin nhắn.
    const dbQuestion = list[safeIndex];
    if (examId && dbQuestion) {
      const response = messages.map((m) => answers[m.id] ?? '');
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

  return {
    isLoading,
    hasData: !!data,
    wordMin,
    wordMax,
    answers,
    timer,
    handleAnswerChange,
    isWordCountValid,
    getWordCount,
    handleSubmit,
    handleBack,
    messages,
    total,
    currentNumber: total > 0 ? safeIndex + 1 : 0,
    hasNext: safeIndex < total - 1,
    hasPrev: safeIndex > 0,
    handleNext,
    handlePrev,
  };
};
