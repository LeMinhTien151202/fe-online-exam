import { useNavigate,useParams } from '@tanstack/react-router';
import { Modal,message } from 'antd';
import { useEffect,useState } from 'react';

export const useMockTest = () => {
  const { testId } = useParams({ strict: false }) as { testId: string };
  const navigate = useNavigate();

  const testTitle = testId === 'm2' ? 'Đề Nói số 2' : testId === 'm3' ? 'Đề Nói số 3' : 'Đề Nói số 1';
  const totalQuestions = 12;

  // Answers state for each question
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // Collapsible sample answers state per question
  const [showSampleMap, setShowSampleMap] = useState<Record<number, boolean>>({});
  const [activeSampleIdxMap, setActiveSampleIdxMap] = useState<Record<number, number>>({});

  // Active question number (1 to 12)
  const [activeQuestionNum, setActiveQuestionNum] = useState<number>(1);
  const activePart = activeQuestionNum <= 3 ? 1 : activeQuestionNum <= 6 ? 2 : activeQuestionNum <= 9 ? 3 : 4;

  const saveProgressToLocalStorage = () => {
    const saved = localStorage.getItem('aptis_speaking_mock_progress');
    let progressObj: Record<string, number> = {};
    if (saved) {
      try {
        progressObj = JSON.parse(saved);
      } catch (e) { /* bỏ qua lỗi */ }
    }
    progressObj[testId] = 100;
    localStorage.setItem('aptis_speaking_mock_progress', JSON.stringify(progressObj));
  };

  const handleAutoSubmit = () => {
    setIsSubmitted(true);
    setShowReport(true);
    message.warning('Đã hết thời gian làm bài! Hệ thống tự động nộp bài.');
    saveProgressToLocalStorage();
  };

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0 || isSubmitted) {
      if (timeLeft <= 0 && !isSubmitted) {
        handleAutoSubmit();
      }
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).filter(k => answers[Number(k)]).length;

  const handleManualSubmit = () => {
    setIsSubmitted(true);
    setShowReport(true);
    message.success('Bạn đã nộp bài thi nói thành công!');
    saveProgressToLocalStorage();
  };

  const handleRetry = () => {
    setAnswers({});
    setTimeLeft(20 * 60);
    setIsSubmitted(false);
    setShowReport(false);
    setActiveQuestionNum(1);
    setShowSampleMap({});
    setActiveSampleIdxMap({});
  };

  const handleBackToLanding = () => {
    if (isSubmitted) {
      navigate({ to: '/speaking' });
      return;
    }
    Modal.confirm({
      title: 'Xác nhận thoát khỏi đề thi?',
      content: 'Tiến độ làm bài nói của bạn sẽ không được lưu nếu bạn thoát ra lúc này.',
      okText: 'Thoát ra',
      cancelText: 'Làm tiếp',
      onOk: () => {
        navigate({ to: '/speaking' });
      }
    });
  };

  const handleNavigateQuestion = (qNum: number) => {
    setActiveQuestionNum(qNum);
  };

  const handlePrevQuestion = () => {
    if (activePart === 2) {
      handleNavigateQuestion(1);
    } else if (activePart === 3) {
      handleNavigateQuestion(4);
    } else if (activePart === 4) {
      handleNavigateQuestion(7);
    }
  };

  const handleNextQuestion = () => {
    if (activePart === 1) {
      handleNavigateQuestion(4);
    } else if (activePart === 2) {
      handleNavigateQuestion(7);
    } else if (activePart === 3) {
      handleNavigateQuestion(10);
    }
  };

  const handleSubmitClick = () => {
    const unansweredCount = totalQuestions - answeredCount;
    const hasUnanswered = unansweredCount > 0;

    Modal.confirm({
      title: 'Xác nhận nộp bài thi nói?',
      content: hasUnanswered
        ? `Bạn còn ${unansweredCount} câu hỏi chưa trả lời ghi âm. Bạn có thực sự muốn nộp bài thi ngay bây giờ không?`
        : 'Bạn đã hoàn thành ghi âm toàn bộ 12 câu hỏi. Bạn có chắc chắn muốn nộp bài để xem đáp án mẫu không?',
      okText: 'Nộp bài',
      cancelText: 'Làm tiếp',
      onOk: handleManualSubmit
    });
  };

  const toggleSample = (qNum: number) => {
    setShowSampleMap(prev => ({ ...prev, [qNum]: !prev[qNum] }));
  };

  const setSampleIndex = (qNum: number, sIdx: number) => {
    setActiveSampleIdxMap(prev => ({ ...prev, [qNum]: sIdx }));
  };

  return {
    testId,
    testTitle,
    totalQuestions,
    answers,
    setAnswers,
    timeLeft,
    isSubmitted,
    showReport,
    setShowReport,
    showSampleMap,
    activeSampleIdxMap,
    activeQuestionNum,
    activePart,
    formatTime,
    answeredCount,
    handleRetry,
    handleBackToLanding,
    handleNavigateQuestion,
    handlePrevQuestion,
    handleNextQuestion,
    handleSubmitClick,
    toggleSample,
    setSampleIndex,
    navigate,
  };
};
