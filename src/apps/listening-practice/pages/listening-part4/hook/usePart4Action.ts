import { message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { flattenListeningExam } from '../../../services/listeningExamMapper';
import { mapLPart4 } from '../../../services/mappers';
import { ISubmitAnswer, usePartPracticeExam, useSubmitExamMutation } from '../../../../../shared/services/student-exam';
import { confirmSubmitExam } from '../../../../../shared/utils/examDialogs';

export const usePart4Action = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(9 * 60 + 15);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Luyện theo phần = đề PART_PRACTICE (skill 2, part 4 — Monologue).
  const { examId, examDetail, isLoading } = usePartPracticeExam(2, 4);
  const groups = useMemo(() => {
    if (!examDetail) return [];
    const part = flattenListeningExam(examDetail).find((p) => p.partNumber === 4);
    return mapLPart4(part?.questions ?? []);
  }, [examDetail]);
  const groupCount = groups.length;

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

  const safeGroup = groupCount > 0 ? Math.min(currentGroupIndex, groupCount - 1) : 0;
  const currentGroup = groups[safeGroup] ?? { id: 0, title: '', instruction: '', mediaUrl: null, subQuestions: [] };

  const handleSelectAnswer = (subQuestionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [subQuestionId]: answer }));
  };

  const handleNext = () => { if (safeGroup < groupCount - 1) setCurrentGroupIndex(safeGroup + 1); };
  const handlePrev = () => { if (safeGroup > 0) setCurrentGroupIndex(safeGroup - 1); else navigate({ to: '/listening' }); };
  const goTo = (idx: number) => setCurrentGroupIndex(idx);

  // Bảng câu hỏi: mỗi bài (group) = 1 nút; trạng thái theo số câu con đã chọn.
  const boardItems = groups.map((group, i) => {
    const filled = group.subQuestions.filter((sq) => answers[sq.id]).length;
    const status: 'unanswered' | 'partial' | 'answered' =
      filled === 0 ? 'unanswered' : filled >= group.subQuestions.length ? 'answered' : 'partial';
    return { key: i, label: i + 1, status };
  });

  const handleSubmit = () => {
    confirmSubmitExam({ onOk: doSubmit });
  };

  const doSubmit = () => {
    const saved = localStorage.getItem('aptis_listening_progress');
    let progressObj: Record<string, number> = {};
    if (saved) { try { progressObj = JSON.parse(saved); } catch { /* bỏ qua lỗi */ } }
    progressObj['l4'] = 100;
    localStorage.setItem('aptis_listening_progress', JSON.stringify(progressObj));
    message.success('Đã ghi nhận câu trả lời! Bạn có thể luyện bài tiếp theo.');

    // Nộp lên BE để tăng student_progress (skill 2, part 4). P4 = mảng index theo subQuestions mỗi bài.
    if (examId) {
      const submitAnswers: ISubmitAnswer[] = [];
      groups.forEach((group) => {
        if (group.questionId == null) return;
        const response = group.subQuestions.map((sq) => {
          const chosen = answers[sq.id];
          return chosen == null ? -1 : sq.options.indexOf(chosen);
        });
        if (response.some((v) => v >= 0)) submitAnswers.push({ questionId: group.questionId, response });
      });
      submitMutation.mutate({ examId, payload: { answers: submitAnswers } });
    }
  };

  const totalSub = currentGroup.subQuestions.length;
  let answeredCount = 0;
  currentGroup.subQuestions.forEach((sq) => { if (answers[sq.id]) answeredCount++; });
  const progressPercent = totalSub > 0 ? (answeredCount / totalSub) * 100 : 0;

  return {
    isLoading,
    hasData: groupCount > 0,
    groupCount,
    currentGroupNumber: safeGroup + 1,
    hasNext: safeGroup < groupCount - 1,
    hasPrev: safeGroup > 0,
    handleNext,
    handlePrev,
    timeLeft,
    answers,
    handleSelectAnswer,
    handleSubmit,
    answeredCount,
    totalSub,
    progressPercent,
    currentGroup,
    formatTime,
    boardItems,
    activeGroupIndex: safeGroup,
    goTo,
  };
};
