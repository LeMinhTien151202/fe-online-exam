import {
  useMemo,
  useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { toast } from '../../../../../configs/toast';
import { countWords } from '../../../utils/wordCounter';
import { mapWPart4 } from '../../../services/mappers';
import { flattenWritingExam } from '../../../services/writingExamMapper';
import { usePartPracticeExam } from '../../../../../shared/services/student-exam';
import { usePerQuestionGrading } from '../../../../../shared/hooks/usePerQuestionGrading';
import { confirmSubmitExam } from '../../../../../shared/utils/examDialogs';

export const usePart4Action = () => {
  const navigate = useNavigate();
  const [informalEmail, setInformalEmail] = useState('');
  const [formalEmail, setFormalEmail] = useState('');

  // Luyện theo phần = đề PART_PRACTICE (skill 4, part 4 — ESSAY 2 email).
  const { examId, examDetail, isLoading } = usePartPracticeExam(4, 4);
  const list = useMemo(() => {
    if (!examDetail) return [];
    return flattenWritingExam(examDetail).find((p) => p.partNumber === 4)?.questions ?? [];
  }, [examDetail]);
  const total = list.length;

  // Chấm ngay từng đề: nộp riêng đề đang làm, AI trả điểm/nhận xét liền.
  const { grades, gradingKey, gradeOne, resetGrade } = usePerQuestionGrading();
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

  const gradeKey = String(safeIndex);
  const currentGrade = grades[gradeKey] ?? null;
  const isSubmitted = currentGrade != null;
  const isGrading = gradingKey === gradeKey;

  const handleInformalChange = (value: string) => { if (!isSubmitted) setInformalEmail(value); };
  const handleFormalChange = (value: string) => { if (!isSubmitted) setFormalEmail(value); };

  const handleSubmit = () => {
    if (isSubmitted) return;
    const infWc = countWords(informalEmail);
    const formWc = countWords(formalEmail);
    if (!informalEmail.trim() || !formalEmail.trim()) {
      toast.warning('Vui lòng hoàn thành cả 2 email!');
      return;
    }
    if (infWc < informalMin || infWc > informalMax) {
      toast.error(`Email thân mật (${infWc} từ) chưa đúng giới hạn ${informalMin}-${informalMax} từ!`);
      return;
    }
    if (formWc < formalMin || formWc > formalMax) {
      toast.error(`Email trang trọng (${formWc} từ) chưa đúng giới hạn ${formalMin}-${formalMax} từ!`);
      return;
    }
    confirmSubmitExam({ totalQuestions: 2, onOk: doSubmit });
  };

  // Nộp RIÊNG đề đang làm để AI chấm và trả kết quả ngay.
  // ESSAY = [email thân mật, email trang trọng].
  const doSubmit = () => {
    const dbQuestion = list[safeIndex];
    gradeOne({
      key: gradeKey,
      examId,
      questionId: dbQuestion?.id,
      response: [informalEmail, formalEmail],
    });
  };

  // Làm lại đúng đề này: xoá 2 email + kết quả cũ để mở khoá ô nhập.
  const handleRetry = () => {
    setInformalEmail('');
    setFormalEmail('');
    resetGrade(gradeKey);
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
  const goTo = (idx: number) => {
    if (idx === safeIndex) return;
    setIndex(idx);
    setInformalEmail('');
    setFormalEmail('');
  };

  const boardItems = Array.from({ length: total }, (_, i) => {
    const status: 'unanswered' | 'partial' | 'answered' = grades[String(i)]
      ? 'answered'
      : i === safeIndex && (informalEmail.trim() || formalEmail.trim())
        ? 'partial'
        : 'unanswered';
    return { key: i, label: i + 1, status };
  });

  return {
    isLoading,
    hasData: !!data,
    total,
    currentNumber: total > 0 ? safeIndex + 1 : 0,
    hasNext: safeIndex < total - 1,
    hasPrev: safeIndex > 0,
    handleNext,
    handlePrev,
    goTo,
    boardItems,
    activeSetIndex: safeIndex,
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
    handleInformalChange,
    handleFormalChange,
    isInformalValid,
    isFormalValid,
    getWordCount,
    handleSubmit,
    handleRetry,
    isSubmitted,
    isGrading,
    grade: currentGrade,
    handleBack,
  };
};
