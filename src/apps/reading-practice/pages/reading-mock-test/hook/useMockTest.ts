import { message } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { IExamSubmitResult, ISubmitAnswer, useSubmitExamMutation } from '../../../../../shared/services/student-exam';
import { useReadingExamDetailQuery } from '../../../services/readingExamQuery';
import { flattenExam, ExamPartData } from '../../../services/readingExamMapper';
import {
  mapPart1,
  mapPart2,
  mapPart3,
  mapPart4,
  Part1Data,
  Part2Data,
  Part2Sentence,
  Part3Data,
  Part4Data,
} from '../../../services/mappers';

// Bộ đề Reading đầy đủ = 5 phần theo API:
//  P1 gap-fill | P2 ordering | P3 ordering (cùng dạng P2) | P4 speaker-match | P5 heading-match
export const useMockTest = (testId: string) => {
  const examId = Number(testId);
  const { data: examDetail, isLoading, isError } = useReadingExamDetailQuery(examId || null);
  const submitMutation = useSubmitExamMutation();

  // ==================== DERIVED DATA FROM API ====================

  const examParts = useMemo<ExamPartData[]>(() => {
    if (!examDetail) return [];
    return flattenExam(examDetail);
  }, [examDetail]);

  const getPart = (n: number) => examParts.find((ep) => ep.partNumber === n);

  // P1: gap-fill — có thể nhiều đoạn văn, mỗi đoạn 1 bản ghi
  const part1Data = useMemo<Part1Data[]>(() => {
    const p = getPart(1);
    if (!p) return [];
    return p.questions.map(mapPart1).filter(Boolean) as Part1Data[];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examParts]);

  // P2 & P3: ordering (cùng dạng)
  const orderingP2 = useMemo<Part2Data | null>(() => {
    const p = getPart(2);
    if (!p || p.questions.length === 0) return null;
    return mapPart2(p.questions[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examParts]);

  const orderingP3 = useMemo<Part2Data | null>(() => {
    const p = getPart(3);
    if (!p || p.questions.length === 0) return null;
    return mapPart2(p.questions[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examParts]);

  // P4: speaker-match
  const speakerP4 = useMemo<Part3Data | null>(() => {
    const p = getPart(4);
    if (!p || p.questions.length === 0) return null;
    return mapPart3(p.questions[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examParts]);

  // P5: heading-match
  const headingP5 = useMemo<Part4Data | null>(() => {
    const p = getPart(5);
    if (!p || p.questions.length === 0) return null;
    return mapPart4(p.questions[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examParts]);

  // Đáp án đúng
  const correctP1 = useMemo(() => {
    const map: Record<number, string> = {};
    part1Data.forEach((pd) => {
      Object.entries(pd.correctAnswers).forEach(([id, ans]) => {
        map[Number(id)] = ans;
      });
    });
    return map;
  }, [part1Data]);

  const correctP2 = useMemo(() => orderingP2?.correctOrder ?? [], [orderingP2]);
  const correctP3 = useMemo(() => orderingP3?.correctOrder ?? [], [orderingP3]);
  const correctP4 = useMemo(() => speakerP4?.correctAnswers ?? {}, [speakerP4]);
  const correctP5 = useMemo(() => headingP5?.correctAnswers ?? {}, [headingP5]);

  // ==================== STATE ====================

  const [p1Answers, setP1Answers] = useState<Record<number, string>>({});
  const [p2Slots, setP2Slots] = useState<Record<number, Part2Sentence | null>>({});
  const [p2Pool, setP2Pool] = useState<Part2Sentence[]>([]);
  const [p3Slots, setP3Slots] = useState<Record<number, Part2Sentence | null>>({});
  const [p3Pool, setP3Pool] = useState<Part2Sentence[]>([]);
  const [p4Answers, setP4Answers] = useState<Record<number, string>>({});
  const [p5Answers, setP5Answers] = useState<Record<number, string>>({});
  const [activeQuestionNum, setActiveQuestionNum] = useState<number>(1);
  const [timeLeft, setTimeLeft] = useState(35 * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [submitResult, setSubmitResult] = useState<IExamSubmitResult | null>(null);

  // ==================== INIT ORDERING POOLS ====================

  useEffect(() => {
    if (orderingP2 && orderingP2.initialSentences.length > 0) {
      const slots: Record<number, Part2Sentence | null> = {};
      orderingP2.initialSentences.forEach((_, i) => { slots[i + 1] = null; });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setP2Pool([...orderingP2.initialSentences]);
      setP2Slots(slots);
    }
  }, [orderingP2]);

  useEffect(() => {
    if (orderingP3 && orderingP3.initialSentences.length > 0) {
      const slots: Record<number, Part2Sentence | null> = {};
      orderingP3.initialSentences.forEach((_, i) => { slots[i + 1] = null; });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setP3Pool([...orderingP3.initialSentences]);
      setP3Slots(slots);
    }
  }, [orderingP3]);

  // ==================== COUNTS ====================

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const p1QuestionCount = useMemo(
    () => part1Data.reduce((sum, pd) => sum + pd.questions.length, 0),
    [part1Data]
  );
  const p2QuestionCount = orderingP2?.initialSentences.length ?? 0;
  const p3QuestionCount = orderingP3?.initialSentences.length ?? 0;
  const p4QuestionCount = speakerP4?.questions.length ?? 0;
  const p5QuestionCount = headingP5?.paragraphs.length ?? 0;
  const totalQuestions =
    p1QuestionCount + p2QuestionCount + p3QuestionCount + p4QuestionCount + p5QuestionCount;

  // Phần nào đang có dữ liệu (để render nav + nút điều hướng)
  const availableParts = useMemo(() => {
    const arr: number[] = [];
    if (p1QuestionCount > 0) arr.push(1);
    if (p2QuestionCount > 0) arr.push(2);
    if (p3QuestionCount > 0) arr.push(3);
    if (p4QuestionCount > 0) arr.push(4);
    if (p5QuestionCount > 0) arr.push(5);
    return arr;
  }, [p1QuestionCount, p2QuestionCount, p3QuestionCount, p4QuestionCount, p5QuestionCount]);

  // Offset câu bắt đầu của mỗi phần
  const partOffset = (partNum: number): number => {
    let off = 0;
    if (partNum > 1) off += p1QuestionCount;
    if (partNum > 2) off += p2QuestionCount;
    if (partNum > 3) off += p3QuestionCount;
    if (partNum > 4) off += p4QuestionCount;
    return off;
  };

  const firstQNumForPart = (partNum: number) => partOffset(partNum) + 1;

  const getPartForQuestion = (qNum: number): number => {
    if (qNum <= p1QuestionCount) return 1;
    if (qNum <= p1QuestionCount + p2QuestionCount) return 2;
    if (qNum <= p1QuestionCount + p2QuestionCount + p3QuestionCount) return 3;
    if (qNum <= p1QuestionCount + p2QuestionCount + p3QuestionCount + p4QuestionCount) return 4;
    return 5;
  };

  const activePart = getPartForQuestion(activeQuestionNum);

  const p1AnsweredCount = Object.keys(p1Answers).length;
  const p2AnsweredCount = Object.values(p2Slots).filter(Boolean).length;
  const p3AnsweredCount = Object.values(p3Slots).filter(Boolean).length;
  const p4AnsweredCount = Object.keys(p4Answers).length;
  const p5AnsweredCount = Object.keys(p5Answers).length;
  const totalAnsweredCount =
    p1AnsweredCount + p2AnsweredCount + p3AnsweredCount + p4AnsweredCount + p5AnsweredCount;

  // ==================== SCORING ====================

  const calculateScores = () => {
    let scoreP1 = 0;
    Object.entries(correctP1).forEach(([id, ans]) => {
      if (p1Answers[Number(id)] === ans) scoreP1++;
    });
    let scoreP2 = 0;
    Object.entries(p2Slots).forEach(([key, item]) => {
      if (item && item.id === correctP2[Number(key) - 1]) scoreP2++;
    });
    let scoreP3 = 0;
    Object.entries(p3Slots).forEach(([key, item]) => {
      if (item && item.id === correctP3[Number(key) - 1]) scoreP3++;
    });
    let scoreP4 = 0;
    Object.entries(correctP4).forEach(([id, person]) => {
      if (p4Answers[Number(id)] === person) scoreP4++;
    });
    let scoreP5 = 0;
    Object.entries(correctP5).forEach(([num, heading]) => {
      if (p5Answers[Number(num)] === heading) scoreP5++;
    });
    const totalScore = scoreP1 + scoreP2 + scoreP3 + scoreP4 + scoreP5;
    return { scoreP1, scoreP2, scoreP3, scoreP4, scoreP5, totalScore };
  };

  // ==================== COLLECT (state -> shape submit API) ====================
  // P1 gap-fill: mảng index đáp án theo từng gap; P2/P3 ordering: mảng index câu trong pool;
  // P4 speaker-match: mảng person key theo câu; P5 heading: { paragraph: label tiêu đề }.
  const collectAnswers = (): ISubmitAnswer[] => {
    const result: ISubmitAnswer[] = [];

    part1Data.forEach((pd) => {
      if (pd.questionId == null) return;
      const response = pd.questions.map((q) => q.options.indexOf(p1Answers[q.id] ?? ''));
      if (response.some((v) => v >= 0)) result.push({ questionId: pd.questionId, response });
    });

    const collectOrdering = (ordering: Part2Data | null, slots: Record<number, Part2Sentence | null>) => {
      if (!ordering?.questionId) return;
      const count = ordering.initialSentences.length;
      const response: number[] = [];
      // fixed_first: câu cố định luôn đứng đầu -> prepend để khớp correct_order đầy đủ ở BE.
      if (ordering.fixedPoolIndex >= 0) response.push(ordering.fixedPoolIndex);
      for (let i = 1; i <= count; i += 1) {
        const item = slots[i];
        response.push(item ? Number(item.id.replace(/^s/, '')) : -1);
      }
      if (response.some((v) => v >= 0)) result.push({ questionId: ordering.questionId, response });
    };
    collectOrdering(orderingP2, p2Slots);
    collectOrdering(orderingP3, p3Slots);

    if (speakerP4?.questionId) {
      const response = speakerP4.questions.map((q) => p4Answers[q.id] ?? '');
      if (response.some((v) => v !== '')) result.push({ questionId: speakerP4.questionId, response });
    }

    if (headingP5?.questionId) {
      const labelByValue = new Map(headingP5.headings.map((h) => [h.value, h.label]));
      const response: Record<string, string> = {};
      headingP5.paragraphs.forEach((pg) => {
        const val = p5Answers[pg.num];
        if (val != null) response[String(pg.num)] = labelByValue.get(val) ?? val;
      });
      if (Object.keys(response).length > 0) result.push({ questionId: headingP5.questionId, response });
    }

    return result;
  };

  const submitToServer = async () => {
    if (!examId) return;
    try {
      const r = await submitMutation.mutateAsync({ examId, payload: { answers: collectAnswers() } });
      setSubmitResult(r); // dùng để xếp band CEFR theo bảng kỹ năng (Đọc = skillId 3)
    } catch {
      // Interceptor đã hiện lỗi; báo cáo dùng band suy từ điểm cục bộ (fallback).
    }
  };

  // ==================== PERSISTENCE ====================

  const saveProgressToLocalStorage = (score: number) => {
    const saved = localStorage.getItem('aptis_reading_mock_progress');
    let progressObj: Record<string, number> = {};
    if (saved) {
      try { progressObj = JSON.parse(saved); } catch { /* ignore */ }
    }
    const currentBest = progressObj[testId] ?? 0;
    progressObj[testId] = Math.max(currentBest, score);
    localStorage.setItem('aptis_reading_mock_progress', JSON.stringify(progressObj));
  };

  // ==================== TIMER (refs to avoid stale closures) ====================

  const isSubmittedRef = useRef(isSubmitted);
  const calculateScoresRef = useRef(calculateScores);
  const saveProgressRef = useRef(saveProgressToLocalStorage);
  const submitToServerRef = useRef(submitToServer);

  useEffect(() => {
    isSubmittedRef.current = isSubmitted;
    calculateScoresRef.current = calculateScores;
    saveProgressRef.current = saveProgressToLocalStorage;
    submitToServerRef.current = submitToServer;
  });

  useEffect(() => {
    if (timeLeft <= 0 || isSubmittedRef.current) {
      if (timeLeft <= 0 && !isSubmittedRef.current) {
        isSubmittedRef.current = true;
        message.warning('Đã hết thời gian làm bài! Hệ thống tự động nộp bài của bạn.');
        const { totalScore } = calculateScoresRef.current();
        saveProgressRef.current(totalScore);
        submitToServerRef.current();
      }
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // ==================== SUBMIT ====================

  const handleAutoSubmit = () => {
    setIsSubmitted(true);
    setShowReport(true);
    message.warning('Đã hết thời gian làm bài! Hệ thống tự động nộp bài của bạn.');
    const { totalScore } = calculateScores();
    saveProgressToLocalStorage(totalScore);
    submitToServer();
  };

  const handleManualSubmit = () => {
    setIsSubmitted(true);
    setShowReport(true);
    message.success('Bạn đã nộp bài thi thành công!');
    const { totalScore } = calculateScores();
    saveProgressToLocalStorage(totalScore);
    submitToServer();
  };

  const resetOrdering = (
    data: Part2Data | null,
    setSlots: (s: Record<number, Part2Sentence | null>) => void,
    setPool: (p: Part2Sentence[]) => void
  ) => {
    if (!data) return;
    const slots: Record<number, Part2Sentence | null> = {};
    data.initialSentences.forEach((_, i) => { slots[i + 1] = null; });
    setSlots(slots);
    setPool([...data.initialSentences]);
  };

  const handleRetry = () => {
    setP1Answers({});
    resetOrdering(orderingP2, setP2Slots, setP2Pool);
    resetOrdering(orderingP3, setP3Slots, setP3Pool);
    setP4Answers({});
    setP5Answers({});
    setTimeLeft(35 * 60);
    setIsSubmitted(false);
    setShowReport(false);
    setSubmitResult(null);
    setActiveQuestionNum(1);
  };

  // ==================== DRAG & DROP (dùng chung cho P2 & P3) ====================

  const [draggedItem, setDraggedItem] = useState<Part2Sentence | null>(null);
  const [draggedFromSlot, setDraggedFromSlot] = useState<number | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
  const [dragPart, setDragPart] = useState<number>(2);

  const slotsSetterFor = (part: number) => (part === 2 ? setP2Slots : setP3Slots);
  const poolSetterFor = (part: number) => (part === 2 ? setP2Pool : setP3Pool);
  const slotsFor = (part: number) => (part === 2 ? p2Slots : p3Slots);

  const handleDragStart = (part: number, item: Part2Sentence, fromSlot: number | null = null) => {
    if (isSubmitted) return;
    setDragPart(part);
    setDraggedItem(item);
    setDraggedFromSlot(fromSlot);
  };

  const handleDragOver = (e: React.DragEvent, slotId: number) => {
    e.preventDefault();
    if (isSubmitted) return;
    setDragOverSlot(slotId);
  };

  const handleDragLeave = () => setDragOverSlot(null);

  const handleDrop = (part: number, slotId: number) => {
    if (isSubmitted || !draggedItem || dragPart !== part) return;
    const item = draggedItem;
    const fromSlot = draggedFromSlot;
    const setPool = poolSetterFor(part);
    slotsSetterFor(part)((prev) => {
      const nextSlots = { ...prev };
      const currentInSlot = nextSlots[slotId];
      if (currentInSlot) setPool((prevPool) => [...prevPool, currentInSlot]);
      if (fromSlot !== null) nextSlots[fromSlot] = null;
      else setPool((prevPool) => prevPool.filter((it) => it.id !== item.id));
      nextSlots[slotId] = item;
      return nextSlots;
    });
    setDraggedItem(null);
    setDraggedFromSlot(null);
    setDragOverSlot(null);
  };

  const handleRemoveFromSlot = (part: number, slotId: number, item: Part2Sentence) => {
    if (isSubmitted) return;
    slotsSetterFor(part)((prev) => ({ ...prev, [slotId]: null }));
    poolSetterFor(part)((prevPool) => [...prevPool, item]);
  };

  const handleAutoPlace = (part: number, item: Part2Sentence) => {
    if (isSubmitted) return;
    const slots = slotsFor(part);
    const firstEmptySlot = Object.keys(slots).find((key) => !slots[Number(key)]);
    if (firstEmptySlot) {
      const slotNum = Number(firstEmptySlot);
      slotsSetterFor(part)((prev) => ({ ...prev, [slotNum]: item }));
      poolSetterFor(part)((prevPool) => prevPool.filter((p) => p.id !== item.id));
    }
  };

  // ==================== NAVIGATION (chỉ giữa các phần có dữ liệu) ====================

  const handleNavigateQuestion = (qNum: number) => setActiveQuestionNum(qNum);

  const handlePrevQuestion = () => {
    const idx = availableParts.indexOf(activePart);
    if (idx > 0) setActiveQuestionNum(firstQNumForPart(availableParts[idx - 1]));
  };

  const handleNextQuestion = () => {
    const idx = availableParts.indexOf(activePart);
    if (idx >= 0 && idx < availableParts.length - 1) {
      setActiveQuestionNum(firstQNumForPart(availableParts[idx + 1]));
    }
  };

  const isFirstPart = availableParts.indexOf(activePart) <= 0;
  const isLastPart = availableParts.indexOf(activePart) === availableParts.length - 1;

  // ==================== RETURN ====================

  return {
    isLoading,
    isError,
    examTitle: examDetail?.title ?? 'Đề thi Đọc hiểu',

    part1Data,
    orderingP2,
    orderingP3,
    speakerP4,
    headingP5,

    correctP1,
    correctP2,
    correctP3,
    correctP4,
    correctP5,

    p1Answers,
    setP1Answers,
    p2Slots,
    p2Pool,
    p3Slots,
    p3Pool,
    p4Answers,
    setP4Answers,
    p5Answers,
    setP5Answers,

    dragOverSlot,
    dragPart,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemoveFromSlot,
    handleAutoPlace,

    activePart,
    availableParts,
    isFirstPart,
    isLastPart,
    firstQNumForPart,
    setActiveQuestionNum,
    handleNavigateQuestion,
    handlePrevQuestion,
    handleNextQuestion,

    timeLeft,
    formatTime,

    isSubmitted,
    showReport,
    setShowReport,
    submitResult,
    handleManualSubmit,
    handleAutoSubmit,
    handleRetry,

    p1QuestionCount,
    p2QuestionCount,
    p3QuestionCount,
    p4QuestionCount,
    p5QuestionCount,
    totalQuestions,
    p1AnsweredCount,
    p2AnsweredCount,
    p3AnsweredCount,
    p4AnsweredCount,
    p5AnsweredCount,
    totalAnsweredCount,

    calculateScores,
  };
};
