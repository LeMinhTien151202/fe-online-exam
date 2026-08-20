import React, { useMemo, useState } from 'react';
import { toast } from '../../../../../configs/toast';
import { mapPart2, Part2Data, Part2Sentence } from '../../../services/mappers';
import { flattenExam } from '../../../services/readingExamMapper';
import { summarizeAutoGrade, usePartPracticeExam, useSubmitExamMutation } from '../../../../../shared/services/student-exam';
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

  const slotCount = data?.initialSentences.length ?? 0;
  const emptySlots = () =>
    Object.fromEntries(Array.from({ length: slotCount }, (_, i) => [i + 1, null])) as Record<number, Part2Sentence | null>;

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [pool, setPool] = useState<Part2Sentence[]>([]);
  const [slots, setSlots] = useState<Record<number, Part2Sentence | null>>({});
  const [doneSets, setDoneSets] = useState<Set<number>>(new Set());
  const [scoreResult, setScoreResult] = useState<{ earned: number; total: number } | null>(null);

  // Nạp lại pool/slots khi bộ câu hỏi đổi (kèm index để phân biệt câu trùng thứ tự)
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const currentKey = data ? `${safeIndex}:${data.initialSentences.map((item) => item.id).join('|')}` : null;
  if (currentKey && currentKey !== loadedKey) {
    setLoadedKey(currentKey);
    setPool(data!.initialSentences);
    setSlots(emptySlots());
    setIsSubmitted(false);
  }

  const handleNext = () => {
    if (safeIndex >= total - 1) return;
    setIndex(safeIndex + 1);
  };
  const handlePrev = () => {
    if (safeIndex <= 0) return;
    setIndex(safeIndex - 1);
  };
  const goTo = (idx: number) => {
    if (idx === safeIndex) return;
    setIndex(idx);
  };

  const [draggedItem, setDraggedItem] = useState<Part2Sentence | null>(null);
  const [draggedFromSlot, setDraggedFromSlot] = useState<number | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);

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
      toast.warning('Tất cả các ô trống đã đầy! Hãy kéo bớt item ra.');
    }
  };

  const countCorrect = () => scoreResult?.earned ?? 0;

  const handleSubmit = () => {
    const filledCount = Object.values(slots).filter((s) => s !== null).length;
    if (filledCount < slotCount) {
      toast.warning(`Vui lòng hoàn thành sắp xếp tất cả ${slotCount} ô trống! (Hiện tại: ${filledCount}/${slotCount})`);
      return;
    }
    confirmSubmitExam({ totalQuestions: slotCount, onOk: doSubmit });
  };

  const doSubmit = async () => {
    setIsSubmitted(true);
    // Nộp lên BE để tăng student_progress (skill 3, part 2). P2 = mảng index theo thứ tự, prepend câu cố định.
    if (examId && data?.questionId != null) {
      const response: number[] = [];
      if (data.fixedPoolIndex >= 0) response.push(data.fixedPoolIndex);
      for (let i = 1; i <= slotCount; i += 1) {
        const item = slots[i];
        response.push(item ? Number(item.id.replace(/^s/, '')) : -1);
      }
      if (response.some((v) => v >= 0)) {
        try {
          const result = await submitMutation.mutateAsync({
            examId,
            payload: { answers: [{ questionId: data.questionId, response }] },
          });
          const score = summarizeAutoGrade(result, { skillId: 3, partNumber: 2 });
          setScoreResult(score);
          setDoneSets((prev) => new Set(prev).add(safeIndex));
          toast.success(`Chúc mừng! Bạn đã hoàn thành Part 2. Kết quả: ${score.earned}/${score.total} câu đúng.`);
        } catch {
          setIsSubmitted(false);
        }
      }
    }
  };

  const handleRetry = () => {
    setSlots(emptySlots());
    setPool(data?.initialSentences ?? []);
    setIsSubmitted(false);
    setScoreResult(null);
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
    isSubmitted,
    pool,
    slots,
    dragOverSlot,
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
