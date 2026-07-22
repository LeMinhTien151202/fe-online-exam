import { message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { flattenListeningExam } from '../../../services/listeningExamMapper';
import { mapLPart2 } from '../../../services/mappers';
import { ISubmitAnswer, usePartPracticeExam, useSubmitExamMutation } from '../../../../../shared/services/student-exam';
import { confirmSubmitExam } from '../../../../../shared/utils/examDialogs';

export const usePart2Action = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(19 * 60 + 58);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Luyện theo phần = đề PART_PRACTICE (skill 2, part 2 — SPEAKER_MATCH).
  const { examId, examDetail, isLoading } = usePartPracticeExam(2, 2);
  const sets = useMemo(() => {
    if (!examDetail) return [];
    const part = flattenListeningExam(examDetail).find((p) => p.partNumber === 2);
    return mapLPart2(part?.questions ?? []);
  }, [examDetail]);
  const setCount = sets.length;

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

  const safeSet = setCount > 0 ? Math.min(currentSetIndex, setCount - 1) : 0;
  const currentSet = sets[safeSet] ?? { id: 0, mediaUrl: null, instruction: '', options: [], speakerCount: 4, correctBySpeaker: {} };

  const keyOf = (speaker: number) => `${safeSet}-${speaker}`;
  const handleSelectChange = (speaker: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [keyOf(speaker)]: value }));
  };
  const getAnswer = (speaker: number) => answers[keyOf(speaker)];

  const goSet = (idx: number) => setCurrentSetIndex(idx);
  const handleNext = () => { if (safeSet < setCount - 1) goSet(safeSet + 1); };
  const handlePrev = () => { if (safeSet > 0) goSet(safeSet - 1); else navigate({ to: '/listening' }); };

  // Bảng câu hỏi: mỗi bộ = 1 nút; trạng thái theo số speaker đã chọn của bộ.
  const boardItems = sets.map((set, i) => {
    let filled = 0;
    for (let sp = 1; sp <= set.speakerCount; sp += 1) if (answers[`${i}-${sp}`]) filled += 1;
    const status: 'unanswered' | 'partial' | 'answered' =
      filled === 0 ? 'unanswered' : filled >= set.speakerCount ? 'answered' : 'partial';
    return { key: i, label: i + 1, status };
  });

  const handleSubmit = () => {
    confirmSubmitExam({ onOk: doSubmit });
  };

  const doSubmit = () => {
    const saved = localStorage.getItem('aptis_listening_progress');
    let progressObj: Record<string, number> = {};
    if (saved) { try { progressObj = JSON.parse(saved); } catch { /* bỏ qua lỗi */ } }
    progressObj['l2'] = 100;
    localStorage.setItem('aptis_listening_progress', JSON.stringify(progressObj));
    message.success('Đã ghi nhận câu trả lời! Bạn có thể luyện bài tiếp theo.');

    // Nộp lên BE để tăng student_progress (skill 2, part 2). P2 = { speaker_index: answer } mỗi bộ.
    if (examId) {
      const submitAnswers: ISubmitAnswer[] = [];
      sets.forEach((set, setIndex) => {
        if (set.questionId == null) return;
        const response: Record<string, string> = {};
        for (let speaker = 1; speaker <= set.speakerCount; speaker += 1) {
          const chosen = answers[`${setIndex}-${speaker}`];
          if (chosen != null) response[String(speaker)] = chosen;
        }
        if (Object.keys(response).length > 0) submitAnswers.push({ questionId: set.questionId, response });
      });
      submitMutation.mutate({ examId, payload: { answers: submitAnswers } });
    }
  };

  let answeredCount = 0;
  for (let s = 1; s <= currentSet.speakerCount; s++) if (getAnswer(s)) answeredCount++;
  const progressPercent = currentSet.speakerCount > 0 ? (answeredCount / currentSet.speakerCount) * 100 : 0;

  return {
    isLoading,
    hasData: setCount > 0,
    setCount,
    currentSetNumber: safeSet + 1,
    hasNext: safeSet < setCount - 1,
    hasPrev: safeSet > 0,
    handleNext,
    handlePrev,
    timeLeft,
    currentSet,
    getAnswer,
    handleSelectChange,
    handleSubmit,
    answeredCount,
    progressPercent,
    formatTime,
    boardItems,
    activeSetIndex: safeSet,
    goTo: goSet,
  };
};
