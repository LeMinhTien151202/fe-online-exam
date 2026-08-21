import { useState } from 'react';
import { toast } from '@/configs/toast';
import { studentExamApi } from './studentExamApi';
import type { IStudentExamTake } from './types';

export const EXAM_PREFILL_ENABLED =
  import.meta.env.DEV && import.meta.env.VITE_ENABLE_EXAM_PREFILL !== 'false';

export const useExamPrefill = (
  examId: number | null,
  applyAnswerKey: (exam: IStudentExamTake) => void | Promise<void>,
) => {
  const [isPrefilling, setIsPrefilling] = useState(false);

  const prefillAnswers = async () => {
    if (!examId || isPrefilling) return;
    setIsPrefilling(true);
    try {
      const exam = await studentExamApi.answerKey(examId);
      await applyAnswerKey(exam);
      toast.success('Đã điền đáp án mẫu cho toàn bộ bộ đề.');
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      toast.error(message || 'Không thể tải đáp án mẫu của bộ đề này.');
    } finally {
      setIsPrefilling(false);
    }
  };

  return { isPrefilling, prefillAnswers };
};
