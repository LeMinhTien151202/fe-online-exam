import { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { message } from 'antd';
import { countWords } from '../../../utils/wordCounter';
import { useWritingTimer } from '../../writing-part1/hook/useWritingTimer';
import { mapWPart4 } from '../../../services/mappers';
import { flattenWritingExam } from '../../../services/writingExamMapper';
import { usePartPracticeExam, useSubmitExamMutation } from '../../../../../shared/services/student-exam';
import { confirmSubmitExam } from '../../../../../shared/utils/examDialogs';

export const usePart4Action = () => {
  const navigate = useNavigate();
  const timer = useWritingTimer(20 * 60);
  const [informalEmail, setInformalEmail] = useState('');
  const [formalEmail, setFormalEmail] = useState('');

  // Luyện theo phần = đề PART_PRACTICE (skill 4, part 4 — ESSAY 2 email).
  const { examId, examDetail, isLoading } = usePartPracticeExam(4, 4);
  const list = useMemo(() => {
    if (!examDetail) return [];
    return flattenWritingExam(examDetail).find((p) => p.partNumber === 4)?.questions ?? [];
  }, [examDetail]);
  const total = list.length;

  const submitMutation = useSubmitExamMutation();
  const [index, setIndex] = useState(0);
  const safeIndex = total > 0 ? Math.min(index, total - 1) : 0;
  const data = useMemo(() => {
    const q = list[safeIndex];
    return q ? mapWPart4(q) : null;
  }, [list, safeIndex]);

  const informalMin = data?.informalMin ?? 50;
  const informalMax = data?.informalMax ?? 75;
  const formalMin = data?.formalMin ?? 120;
  const formalMax = data?.formalMax ?? 150;

  const getWordCount = (text: string) => countWords(text);
  const isInformalValid = (text: string) => {
    const wc = getWordCount(text);
    return wc >= informalMin && wc <= informalMax;
  };
  const isFormalValid = (text: string) => {
    const wc = getWordCount(text);
    return wc >= formalMin && wc <= formalMax;
  };

  const handleInformalChange = (value: string) => setInformalEmail(value);
  const handleFormalChange = (value: string) => setFormalEmail(value);

  const handleSubmit = () => {
    const infWc = countWords(informalEmail);
    const formWc = countWords(formalEmail);
    if (!informalEmail.trim() || !formalEmail.trim()) {
      message.warning('Vui lòng hoàn thành cả 2 email!');
      return;
    }
    if (infWc < informalMin || infWc > informalMax) {
      message.error(`Email thân mật (${infWc} từ) chưa đúng giới hạn ${informalMin}-${informalMax} từ!`);
      return;
    }
    if (formWc < formalMin || formWc > formalMax) {
      message.error(`Email trang trọng (${formWc} từ) chưa đúng giới hạn ${formalMin}-${formalMax} từ!`);
      return;
    }
    confirmSubmitExam({ totalQuestions: 2, onOk: doSubmit });
  };

  const doSubmit = () => {
    message.success('Đã hoàn thành câu hỏi này! Bạn có thể luyện câu tiếp theo.');

    // Nộp lên BE để tăng student_progress (skill 4, part 4). ESSAY = [email thân mật, email trang trọng].
    const dbQuestion = list[safeIndex];
    if (examId && dbQuestion) {
      submitMutation.mutate({
        examId,
        payload: { answers: [{ questionId: dbQuestion.id, response: [informalEmail, formalEmail] }] },
      });
    }
  };

  const handleBack = () => navigate({ to: '/writing' });

  const handleNext = () => {
    if (safeIndex >= total - 1) return;
    setIndex(safeIndex + 1);
    setInformalEmail('');
    setFormalEmail('');
  };
  const handlePrev = () => {
    if (safeIndex <= 0) return;
    setIndex(safeIndex - 1);
    setInformalEmail('');
    setFormalEmail('');
  };

  return {
    isLoading,
    hasData: !!data,
    total,
    currentNumber: total > 0 ? safeIndex + 1 : 0,
    hasNext: safeIndex < total - 1,
    hasPrev: safeIndex > 0,
    handleNext,
    handlePrev,
    situation: data?.situation ?? '',
    informalPrompt: data?.informalPrompt ?? '',
    formalPrompt: data?.formalPrompt ?? '',
    informalSample: data?.informalSample,
    formalSample: data?.formalSample,
    informalMin,
    informalMax,
    formalMin,
    formalMax,
    informalEmail,
    formalEmail,
    timer,
    handleInformalChange,
    handleFormalChange,
    isInformalValid,
    isFormalValid,
    getWordCount,
    handleSubmit,
    handleBack,
  };
};
