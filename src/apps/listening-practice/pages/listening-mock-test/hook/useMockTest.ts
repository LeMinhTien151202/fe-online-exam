import { useNavigate } from '@tanstack/react-router';
import { message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IExamSubmitResult, ISubmitAnswer, useSubmitExamMutation } from '../../../../../shared/services/student-exam';
import { confirmExitExam, confirmSubmitExam } from '../../../../../shared/utils/examDialogs';
import { useListeningExamDetailQuery } from '../../../services/listeningExamQuery';
import { ListeningExamData, buildListeningExam } from '../../../services/listeningExamMapper';

export interface ListeningNavItem {
  qNum: number;
  partNumber: number;
  itemIndex: number;
}

const partLabelMap: Record<number, string> = {
  1: 'Part 1',
  2: 'Part 2',
  3: 'Part 3',
  4: 'Part 4',
};

export const keyForP1 = (qNum: number) => String(qNum);
export const keyForP2 = (qNum: number, speaker: number) => `${qNum}-speaker-${speaker}`;
export const keyForP3 = (qNum: number, statementId: number) => `${qNum}-statement-${statementId}`;
export const keyForP4 = (qNum: number, subQuestionId: string) => `${qNum}-sub-${subQuestionId}`;

const buildNavItems = (examData: ListeningExamData | null): ListeningNavItem[] => {
  if (!examData) return [];
  const items: ListeningNavItem[] = [];

  examData.part1.forEach((_, index) => {
    items.push({ qNum: items.length + 1, partNumber: 1, itemIndex: index });
  });

  examData.part2.forEach((_, index) => {
    items.push({ qNum: items.length + 1, partNumber: 2, itemIndex: index });
  });

  examData.part3.forEach((_, index) => {
    items.push({ qNum: items.length + 1, partNumber: 3, itemIndex: index });
  });

  examData.part4.forEach((_, index) => {
    items.push({ qNum: items.length + 1, partNumber: 4, itemIndex: index });
  });

  return items;
};

export const useMockTest = (testId: string) => {
  const navigate = useNavigate();
  const examId = Number(testId);
  const { data: examDetail, isLoading, isError } = useListeningExamDetailQuery(examId || null);

  const examData = useMemo(() => (examDetail ? buildListeningExam(examDetail) : null), [examDetail]);
  const navItems = useMemo(() => buildNavItems(examData), [examData]);
  const totalQuestions = navItems.length;
  const submitMutation = useSubmitExamMutation();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(40 * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [activeQuestionNum, setActiveQuestionNum] = useState(1);
  const [submitResult, setSubmitResult] = useState<IExamSubmitResult | null>(null);

  const activeNavItem = useMemo(
    () => navItems.find((item) => item.qNum === activeQuestionNum) ?? navItems[0] ?? null,
    [activeQuestionNum, navItems]
  );

  const activePart = activeNavItem?.partNumber ?? 1;
  const activeNavIndex = activeNavItem ? navItems.findIndex((item) => item.qNum === activeNavItem.qNum) : -1;
  const prevNavItem = activeNavIndex > 0 ? navItems[activeNavIndex - 1] : null;
  const nextNavItem = activeNavIndex >= 0 && activeNavIndex < navItems.length - 1 ? navItems[activeNavIndex + 1] : null;
  const prevStepIsSamePart = !!prevNavItem && prevNavItem.partNumber === activePart;
  const nextStepIsSamePart = !!nextNavItem && nextNavItem.partNumber === activePart;

  const navSections = useMemo(
    () =>
      [1, 2, 3, 4]
        .map((partNumber) => {
          const questions = navItems
            .filter((item) => item.partNumber === partNumber)
            .map((item) => item.qNum);
          return questions.length
            ? {
                label: `${partLabelMap[partNumber]}: ${
                  questions.length === 1
                    ? `Câu ${questions[0]}`
                    : `Câu ${questions[0]} - ${questions[questions.length - 1]}`
                }`,
                questions,
              }
            : null;
        })
        .filter(Boolean) as { label: string; questions: number[] }[],
    [navItems]
  );

  const isNavItemAnswered = useCallback(
    (item: ListeningNavItem) => {
      if (!examData) return false;

      if (item.partNumber === 1) {
        return !!answers[keyForP1(item.qNum)];
      }

      if (item.partNumber === 2) {
        const set = examData.part2[item.itemIndex];
        if (!set) return false;
        return Array.from({ length: set.speakerCount }, (_, i) => i + 1).every(
          (speaker) => !!answers[keyForP2(item.qNum, speaker)]
        );
      }

      if (item.partNumber === 3) {
        const set = examData.part3[item.itemIndex];
        if (!set) return false;
        return set.statements.every((statement) => !!answers[keyForP3(item.qNum, statement.id)]);
      }

      const group = examData.part4[item.itemIndex];
      if (!group) return false;
      return group.subQuestions.every((subQuestion) => !!answers[keyForP4(item.qNum, subQuestion.id)]);
    },
    [answers, examData]
  );

  const isNavItemCorrect = useCallback(
    (item: ListeningNavItem) => {
      if (!examData || !isNavItemAnswered(item)) return false;

      if (item.partNumber === 1) {
        const question = examData.part1[item.itemIndex];
        return question ? answers[keyForP1(item.qNum)] === question.options[question.correctIndex] : false;
      }

      if (item.partNumber === 2) {
        const set = examData.part2[item.itemIndex];
        if (!set) return false;
        return Array.from({ length: set.speakerCount }, (_, i) => i + 1).every(
          (speaker) => answers[keyForP2(item.qNum, speaker)] === set.correctBySpeaker[speaker]
        );
      }

      if (item.partNumber === 3) {
        const set = examData.part3[item.itemIndex];
        if (!set) return false;
        return set.statements.every(
          (statement) => answers[keyForP3(item.qNum, statement.id)] === statement.correct
        );
      }

      const group = examData.part4[item.itemIndex];
      if (!group) return false;
      return group.subQuestions.every(
        (subQuestion) => answers[keyForP4(item.qNum, subQuestion.id)] === subQuestion.options[subQuestion.correctIndex]
      );
    },
    [answers, examData, isNavItemAnswered]
  );

  const navAnswers = useMemo(() => {
    const result: Record<number, string> = {};
    navItems.forEach((item) => {
      if (isNavItemAnswered(item)) {
        result[item.qNum] = isNavItemCorrect(item) ? 'correct' : 'answered';
      }
    });
    return result;
  }, [isNavItemAnswered, isNavItemCorrect, navItems]);

  const navCorrectAnswers = useMemo(() => {
    const result: Record<number, string> = {};
    navItems.forEach((item) => {
      result[item.qNum] = 'correct';
    });
    return result;
  }, [navItems]);

  const answeredCount = useMemo(
    () => navItems.filter((item) => isNavItemAnswered(item)).length,
    [isNavItemAnswered, navItems]
  );

  // Dịch state đáp án (theo key nav) sang shape submit của API.
  // P1 (MC): index; P2 (SPEAKER_MATCH): { speaker: answer }; P3 (AGREEMENT): mảng theo statement;
  // P4 (Monologue): mảng index đáp án theo từng câu con.
  const collectAnswers = useCallback((): ISubmitAnswer[] => {
    if (!examData) return [];
    const result: ISubmitAnswer[] = [];

    navItems.forEach((item) => {
      if (item.partNumber === 1) {
        const question = examData.part1[item.itemIndex];
        if (!question || question.questionId == null) return;
        const chosen = answers[keyForP1(item.qNum)];
        if (chosen == null) return;
        const idx = question.options.indexOf(chosen);
        if (idx >= 0) result.push({ questionId: question.questionId, response: idx });
      } else if (item.partNumber === 2) {
        const set = examData.part2[item.itemIndex];
        if (!set || set.questionId == null) return;
        const response: Record<string, string> = {};
        for (let speaker = 1; speaker <= set.speakerCount; speaker += 1) {
          const chosen = answers[keyForP2(item.qNum, speaker)];
          if (chosen != null) response[String(speaker)] = chosen;
        }
        if (Object.keys(response).length > 0) result.push({ questionId: set.questionId, response });
      } else if (item.partNumber === 3) {
        const set = examData.part3[item.itemIndex];
        if (!set || set.questionId == null) return;
        const response = set.statements.map((st) => answers[keyForP3(item.qNum, st.id)] ?? '');
        if (response.some((v) => v !== '')) result.push({ questionId: set.questionId, response });
      } else {
        const group = examData.part4[item.itemIndex];
        if (!group || group.questionId == null) return;
        const response = group.subQuestions.map((sq) => {
          const chosen = answers[keyForP4(item.qNum, sq.id)];
          return chosen == null ? -1 : sq.options.indexOf(chosen);
        });
        if (response.some((v) => v >= 0)) result.push({ questionId: group.questionId, response });
      }
    });

    return result;
  }, [answers, examData, navItems]);

  const submitToServer = useCallback(async () => {
    if (!examId) return;
    const collected = collectAnswers();
    try {
      const r = await submitMutation.mutateAsync({ examId, payload: { answers: collected } });
      setSubmitResult(r); // xếp band CEFR theo bảng kỹ năng (Nghe = skillId 2)
    } catch {
      // Interceptor đã hiện lỗi; báo cáo dùng band suy từ điểm cục bộ (fallback).
    }
  }, [collectAnswers, examId, submitMutation]);

  const calculateScores = useCallback(() => {
    let scoreP1 = 0;
    let scoreP2 = 0;
    let scoreP3 = 0;
    let scoreP4 = 0;
    let maxP1 = 0;
    let maxP2 = 0;
    let maxP3 = 0;
    let maxP4 = 0;

    if (!examData) {
      return { scoreP1, scoreP2, scoreP3, scoreP4, maxP1, maxP2, maxP3, maxP4, totalScore: 0, totalMax: 0 };
    }

    examData.part1.forEach((question, index) => {
      const qNum = navItems.find((item) => item.partNumber === 1 && item.itemIndex === index)?.qNum;
      if (!qNum) return;
      maxP1 += 1;
      if (answers[keyForP1(qNum)] === question.options[question.correctIndex]) scoreP1 += 1;
    });

    examData.part2.forEach((set, index) => {
      const qNum = navItems.find((item) => item.partNumber === 2 && item.itemIndex === index)?.qNum;
      if (!qNum) return;
      for (let speaker = 1; speaker <= set.speakerCount; speaker += 1) {
        maxP2 += 1;
        if (answers[keyForP2(qNum, speaker)] === set.correctBySpeaker[speaker]) scoreP2 += 1;
      }
    });

    examData.part3.forEach((set, index) => {
      const qNum = navItems.find((item) => item.partNumber === 3 && item.itemIndex === index)?.qNum;
      if (!qNum) return;
      set.statements.forEach((statement) => {
        maxP3 += 1;
        if (answers[keyForP3(qNum, statement.id)] === statement.correct) scoreP3 += 1;
      });
    });

    examData.part4.forEach((group, index) => {
      const qNum = navItems.find((item) => item.partNumber === 4 && item.itemIndex === index)?.qNum;
      if (!qNum) return;
      group.subQuestions.forEach((subQuestion) => {
        maxP4 += 1;
        if (answers[keyForP4(qNum, subQuestion.id)] === subQuestion.options[subQuestion.correctIndex]) scoreP4 += 1;
      });
    });

    const totalScore = scoreP1 + scoreP2 + scoreP3 + scoreP4;
    const totalMax = maxP1 + maxP2 + maxP3 + maxP4;
    return { scoreP1, scoreP2, scoreP3, scoreP4, maxP1, maxP2, maxP3, maxP4, totalScore, totalMax };
  }, [answers, examData, navItems]);

  const saveProgressToLocalStorage = useCallback((totalScore: number, totalMax: number) => {
    const saved = localStorage.getItem('aptis_listening_mock_progress');
    let progressObj: Record<string, number> = {};
    if (saved) {
      try {
        progressObj = JSON.parse(saved);
      } catch {
        progressObj = {};
      }
    }
    const percent = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
    const currentBest = progressObj[testId] ?? 0;
    progressObj[testId] = Math.max(currentBest, percent);
    localStorage.setItem('aptis_listening_mock_progress', JSON.stringify(progressObj));
  }, [testId]);

  const handleAutoSubmit = useCallback(() => {
    setIsSubmitted(true);
    setShowReport(true);
    message.warning('Đã hết thời gian làm bài! Hệ thống tự động nộp bài.');
    const { totalScore, totalMax } = calculateScores();
    saveProgressToLocalStorage(totalScore, totalMax);
    submitToServer();
  }, [calculateScores, saveProgressToLocalStorage, submitToServer]);

  useEffect(() => {
    if (timeLeft <= 0 || isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.setTimeout(handleAutoSubmit, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [handleAutoSubmit, isSubmitted, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNavigateQuestion = (qNum: number) => {
    setActiveQuestionNum(qNum);
  };

  const handlePrevQuestion = () => {
    if (prevNavItem) setActiveQuestionNum(prevNavItem.qNum);
  };

  const handleNextQuestion = () => {
    if (nextNavItem) setActiveQuestionNum(nextNavItem.qNum);
  };

  const handleSelectAnswer = (answerKey: string, option: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [answerKey]: option }));
  };

  const handleManualSubmit = () => {
    setIsSubmitted(true);
    setShowReport(true);
    message.success('Bạn đã nộp bài nghe thành công!');
    const { totalScore, totalMax } = calculateScores();
    saveProgressToLocalStorage(totalScore, totalMax);
    submitToServer();
  };

  const handleSubmitClick = () => {
    const unansweredCount = totalQuestions - answeredCount;
    confirmSubmitExam({ unansweredCount, totalQuestions, onOk: handleManualSubmit });
  };

  const handleRetry = () => {
    setAnswers({});
    setTimeLeft(40 * 60);
    setIsSubmitted(false);
    setShowReport(false);
    setSubmitResult(null);
    setActiveQuestionNum(navItems[0]?.qNum ?? 1);
  };

  const handleBackToLanding = (onConfirmBack: () => void) => {
    if (isSubmitted) {
      onConfirmBack();
      return;
    }
    confirmExitExam({
      content: 'Tiến độ làm bài của bạn sẽ không được lưu nếu bạn thoát ra lúc này.',
      onOk: onConfirmBack,
    });
  };

  return {
    isLoading,
    isError,
    testTitle: examDetail?.title ?? 'Đề Nghe hiểu',
    examData,
    navItems,
    navSections,
    navAnswers,
    navCorrectAnswers,
    totalQuestions,
    answers,
    timeLeft,
    isSubmitted,
    showReport,
    setShowReport,
    activeQuestionNum: activeNavItem?.qNum ?? activeQuestionNum,
    activePart,
    activeNavItem,
    answeredCount,
    prevStepIsSamePart,
    nextStepIsSamePart,
    hasPrevStep: !!prevNavItem,
    hasNextStep: !!nextNavItem,
    formatTime,
    calculateScores,
    submitResult,
    handleRetry,
    handleBackToLanding,
    handleNavigateQuestion,
    handlePrevQuestion,
    handleNextQuestion,
    handleSelectAnswer,
    handleSubmitClick,
    navigate,
  };
};
