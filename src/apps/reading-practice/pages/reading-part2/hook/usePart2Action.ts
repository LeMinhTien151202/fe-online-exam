import { message } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { mapPart2, Part2Data, Part2Sentence } from '../../../services/mappers';
import { flattenExam } from '../../../services/readingExamMapper';
import { usePartPracticeExam, useSubmitExamMutation } from '../../../../../shared/services/student-exam';
import { confirmSubmitExam } from '../../../../../shared/utils/examDialogs';

export const usePart2Action = () => {
  // Luyện theo phần = đề PART_PRACTICE (skill 3, API part 2 — ordering).
  const { examId, examDetail, isLoading } = usePartPracticeExam(3, 2);
  const list = useMemo(() => {
    if (!examDetail) return [];
    return flattenExam(examDetail).find((p) => p.partNumber === 2)?.questions ?? [];
  }, [examDetail]);
  const total = list.length;

  const submitMutation = useSubmitExamMutation();
  const [index, setIndex] = useState(0);
  const safeIndex = total > 0 ? Math.min(index, total - 1) : 0;
  const data: Part2Data | null = useMemo(() => {
    const q = list[safeIndex];
    return q ? mapPart2(q) : null;
  }, [list, safeIndex]);

  const slotCount = data?.correctOrder.length ?? 0;
  const emptySlots = () =>
    Object.fromEntries(Array.from({ length: slotCount }, (_, i) => [i + 1, null])) as Record<number, Part2Sentence | null>;

  const [timeLeft, setTimeLeft] = useState(1077);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [pool, setPool] = useState<Part2Sentence[]>([]);
  const [slots, setSlots] = useState<Record<number, Part2Sentence | null>>({});
  const [doneSets, setDoneSets] = useState<Set<number>>(new Set());

  // Nạp lại pool/slots khi bộ câu hỏi đổi (kèm index để phân biệt câu trùng thứ tự)
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const currentKey = data ? `${safeIndex}:${data.correctOrder.join('|')}` : null;
  if (currentKey && currentKey !== loadedKey) {
    setLoadedKey(currentKey);
    setPool(data!.initialSentences);
    setSlots(emptySlots());
    setIsSubmitted(false);
  }

  const handleNext = () => {
    if (safeIndex >= total - 1) return;
    setIndex(safeIndex + 1);
    setTimeLeft(1077);
  };
  const handlePrev = () => {
    if (safeIndex <= 0) return;
    setIndex(safeIndex - 1);
    setTimeLeft(1077);
  };
  const goTo = (idx: number) => {
    if (idx === safeIndex) return;
    setIndex(idx);
    setTimeLeft(1077);
  };

  const [draggedItem, setDraggedItem] = useState<Part2Sentence | null>(null);
  const [draggedFromSlot, setDraggedFromSlot] = useState<number | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);

  useEffect(() => {
    if (timeLeft <= 0 || isSubmitted) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDragStart = (item: Part2Sentence, fromSlot: number | null = null) => {
    if (isSubmitted) return;
    setDraggedItem(item);
    setDraggedFromSlot(fromSlot);
  };

  const handleDragOver = (e: React.DragEvent, slotId: number) => {
    e.preventDefault();
    if (isSubmitted) return;
    setDragOverSlot(slotId);
  };

  const handleDragLeave = () => setDragOverSlot(null);

  const handleDrop = (slotId: number) => {
    if (isSubmitted || !draggedItem) return;
    setSlots((prev) => {
      const nextSlots = { ...prev };
      const currentInSlot = nextSlots[slotId];
      if (currentInSlot) setPool((prevPool) => [...prevPool, currentInSlot]);
      if (draggedFromSlot !== null) nextSlots[draggedFromSlot] = null;
      else setPool((prevPool) => prevPool.filter((item) => item.id !== draggedItem.id));
      nextSlots[slotId] = draggedItem;
      return nextSlots;
    });
    setDraggedItem(null);
    setDraggedFromSlot(null);
    setDragOverSlot(null);
  };

  const handleRemoveFromSlot = (slotId: number, item: Part2Sentence) => {
    if (isSubmitted) return;
    setSlots((prev) => ({ ...prev, [slotId]: null }));
    setPool((prevPool) => [...prevPool, item]);
  };

  const handleAutoPlace = (item: Part2Sentence) => {
    if (isSubmitted) return;
    const firstEmptySlot = Object.keys(slots).find((key) => !slots[Number(key)]);
    if (firstEmptySlot) {
      const slotNum = Number(firstEmptySlot);
      setSlots((prev) => ({ ...prev, [slotNum]: item }));
      setPool((prevPool) => prevPool.filter((p) => p.id !== item.id));
    } else {
      message.warning('Tất cả các ô trống đã đầy! Hãy kéo bớt item ra.');
    }
  };

  const countCorrect = () =>
    Object.keys(slots).filter((key) => {
      const idx = Number(key);
      const slotItem = slots[idx];
      return slotItem && data && slotItem.id === data.correctOrder[idx - 1];
    }).length;

  const handleSubmit = () => {
    const filledCount = Object.values(slots).filter((s) => s !== null).length;
    if (filledCount < slotCount) {
      message.warning(`Vui lòng hoàn thành sắp xếp tất cả ${slotCount} ô trống! (Hiện tại: ${filledCount}/${slotCount})`);
      return;
    }
    confirmSubmitExam({ totalQuestions: slotCount, onOk: doSubmit });
  };

  const doSubmit = () => {
    setIsSubmitted(true);
    setDoneSets((prev) => new Set(prev).add(safeIndex));
    const correct = countCorrect();
    const progressPercent = slotCount ? Math.round((correct / slotCount) * 100) : 0;
    const savedProgress = localStorage.getItem('aptis_reading_progress');
    let nextProgress = { r2: progressPercent };
    if (savedProgress) {
      try {
        nextProgress = { ...JSON.parse(savedProgress), r2: progressPercent };
      } catch { /* bỏ qua lỗi */ }
    }
    localStorage.setItem('aptis_reading_progress', JSON.stringify(nextProgress));
    message.success(`Chúc mừng! Bạn đã hoàn thành Part 2. Kết quả: ${correct}/${slotCount} câu đúng.`);

    // Nộp lên BE để tăng student_progress (skill 3, part 2). P2 = mảng index theo thứ tự, prepend câu cố định.
    if (examId && data?.questionId != null) {
      const response: number[] = [];
      if (data.fixedPoolIndex >= 0) response.push(data.fixedPoolIndex);
      for (let i = 1; i <= slotCount; i += 1) {
        const item = slots[i];
        response.push(item ? Number(item.id.replace(/^s/, '')) : -1);
      }
      if (response.some((v) => v >= 0)) {
        submitMutation.mutate({ examId, payload: { answers: [{ questionId: data.questionId, response }] } });
      }
    }
  };

  const handleRetry = () => {
    setSlots(emptySlots());
    setPool(data?.initialSentences ?? []);
    setIsSubmitted(false);
    setTimeLeft(1077);
  };

  const placedCount = Object.values(slots).filter(Boolean).length;
  const progressPercent = slotCount ? Math.round((placedCount / slotCount) * 100) : 0;
  const correctCount = countCorrect();

  const boardItems = Array.from({ length: total }, (_, i) => {
    const status: 'unanswered' | 'partial' | 'answered' = doneSets.has(i)
      ? 'answered'
      : i === safeIndex && placedCount > 0
        ? 'partial'
        : 'unanswered';
    return { key: i, label: i + 1, status };
  });

  return {
    isLoading,
    data,
    slotCount,
    total,
    currentNumber: total > 0 ? safeIndex + 1 : 0,
    hasNext: safeIndex < total - 1,
    hasPrev: safeIndex > 0,
    handleNext,
    handlePrev,
    goTo,
    boardItems,
    activeSetIndex: safeIndex,
    timeLeft,
    isSubmitted,
    pool,
    slots,
    dragOverSlot,
    formatTime,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemoveFromSlot,
    handleAutoPlace,
    handleSubmit,
    handleRetry,
    placedCount,
    progressPercent,
    correctCount
  };
};
