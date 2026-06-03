import React, { useState, useEffect } from 'react';
import { Modal, Button, Space, Progress, Statistic, message } from 'antd';
import { useNavigate, useParams } from '@tanstack/react-router';
import {
  ClockCircleOutlined,
  LeftOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  UndoOutlined
} from '@ant-design/icons';

import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import { mockGrammarQuestions, mockVocabularySets } from '../services/mockExamData';
import { useExamAction } from '../hook/useExamAction';
import { GrammarSection } from '../components/GrammarSection';
import { VocabularySection } from '../components/VocabularySection';
import { QuestionNav } from '../components/QuestionNav';
import * as S from '../styles/styled';

export const GrammarTestPage: React.FC = () => {
  const navigate = useNavigate();
  const { partId, testId } = useParams({ strict: false }) as { partId?: string; testId?: string };
  const isPartMode = !!partId;

  const initialTime = isPartMode ? 12 * 60 + 30 : 25 * 60;
  const storagePrefix = partId 
    ? `aptis_grammar_part_${partId}` 
    : testId 
      ? `aptis_grammar_mock_${testId}` 
      : 'aptis_grammar_test';
  const totalQuestions = isPartMode ? 25 : 50;

  const [showResultModal, setShowResultModal] = useState(false);
  const [scoreResult, setScoreResult] = useState<{
    grammarScore: number;
    vocabScore: number;
    total: number;
  } | null>(null);

  // Chấm điểm khi nộp bài
  const handleExamSubmit = (finalAnswers: Record<number, string>) => {
    let grammarScore = 0;
    let vocabScore = 0;

    mockGrammarQuestions.forEach((q) => {
      const answer = finalAnswers[q.questionNumber];
      if (answer && answer.toLowerCase() === q.correctAnswer.toLowerCase()) {
        grammarScore++;
      }
    });

    mockVocabularySets.forEach((set) => {
      set.subQuestions.forEach((subQ) => {
        const answer = finalAnswers[subQ.questionNumber];
        if (answer && answer.toLowerCase() === subQ.correctAnswer.toLowerCase()) {
          vocabScore++;
        }
      });
    });

    const totalScore = grammarScore + vocabScore;

    setScoreResult({
      grammarScore,
      vocabScore,
      total: totalScore
    });

    // Save progress to local storage
    if (isPartMode) {
      const saved = localStorage.getItem('aptis_grammar_progress');
      let progressObj: Record<string, number> = {};
      if (saved) {
        try {
          progressObj = JSON.parse(saved);
        } catch (e) {}
      }
      if (partId === '1') {
        progressObj['g1'] = 100;
      } else {
        progressObj['g2'] = 100;
      }
      localStorage.setItem('aptis_grammar_progress', JSON.stringify(progressObj));
    } else {
      const activeTestId = testId || 'm1';
      const saved = localStorage.getItem('aptis_grammar_mock_progress');
      let progressObj: Record<string, number> = {};
      if (saved) {
        try {
          progressObj = JSON.parse(saved);
        } catch (e) {}
      }
      const currentBest = progressObj[activeTestId] ?? 0;
      progressObj[activeTestId] = Math.max(currentBest, totalScore);
      localStorage.setItem('aptis_grammar_mock_progress', JSON.stringify(progressObj));
    }

    setShowResultModal(true);
  };

  const {
    answers,
    currentSection,
    currentQuestionIndex,
    timeLeft,
    progressPercent,
    setCurrentSection,
    setCurrentQuestionIndex,
    selectAnswer,
    submitExamManual,
    resetExam,
    formatTime,
    totalAnswered
  } = useExamAction(handleExamSubmit, initialTime, storagePrefix, totalQuestions);

  // Set initial section and question based on partId
  useEffect(() => {
    if (partId === '2') {
      setCurrentSection('vocabulary');
      setCurrentQuestionIndex(26);
    } else {
      setCurrentSection('grammar');
      setCurrentQuestionIndex(1);
    }
  }, [partId]);

  // Điều hướng câu hỏi tự động chuyển phân hệ tương ứng
  const handleNavigateQuestion = (qNum: number) => {
    setCurrentQuestionIndex(qNum);
    if (qNum <= 25) {
      setCurrentSection('grammar');
    } else {
      setCurrentSection('vocabulary');
    }
  };

  const handlePrevQuestion = () => {
    const limit = isPartMode && partId === '2' ? 26 : 1;
    if (currentQuestionIndex > limit) {
      handleNavigateQuestion(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    const limit = isPartMode && partId === '1' ? 25 : 50;
    if (currentQuestionIndex < limit) {
      handleNavigateQuestion(currentQuestionIndex + 1);
    }
  };

  const handleBackToLanding = () => {
    Modal.confirm({
      title: 'Xác nhận thoát khỏi phòng thi?',
      icon: <InfoCircleOutlined className="text-[#faad14]" />,
      content: 'Hệ thống vẫn sẽ lưu kết quả tạm thời của bạn, tuy nhiên đồng hồ đếm ngược vẫn sẽ chạy tiếp nếu bạn quay lại sau.',
      okText: 'Rời phòng thi',
      cancelText: 'Tiếp tục làm bài',
      onOk: () => {
        navigate({ to: '/grammar' });
      }
    });
  };

  const handleSubmitClick = () => {
    const { hasUnanswered, unansweredCount, confirm } = submitExamManual();

    Modal.confirm({
      title: 'Xác nhận nộp bài thi?',
      icon: <CheckCircleOutlined className="text-[#52c41a]" />,
      content: hasUnanswered
        ? `Bạn còn ${unansweredCount} câu hỏi chưa trả lời. Bạn có thực sự muốn nộp bài thi ngay bây giờ không?`
        : `Bạn đã hoàn thành toàn bộ ${totalQuestions} câu hỏi. Bạn có chắc chắn muốn nộp bài thi để chấm điểm không?`,
      okText: 'Nộp bài',
      cancelText: 'Làm tiếp',
      onOk: confirm
    });
  };

  const handleRestartExam = () => {
    resetExam();
    setShowResultModal(false);
    setScoreResult(null);
    if (partId === '2') {
      setCurrentSection('vocabulary');
      setCurrentQuestionIndex(26);
    } else {
      setCurrentSection('grammar');
      setCurrentQuestionIndex(1);
    }
    message.success('Đã tải lại đề thi mới. Chúc bạn làm bài tốt!');
  };

  return (
    <HomeS.MainLayout>
      <Sidebar />
      <HomeS.RightColumn>
        <S.PageContainer>
          <S.Header>
            <Space size="large">
              <S.HeaderBackButton
                type="text"
                icon={<LeftOutlined />}
                onClick={handleBackToLanding}
              >
                Quay lại
              </S.HeaderBackButton>
              <S.HeaderTitleText>
                {isPartMode 
                  ? (partId === '1' ? 'Part 1: Grammar Practice' : 'Part 2: Vocabulary Practice')
                  : 'Grammar & Vocabulary Test'}
              </S.HeaderTitleText>
            </Space>

            <S.HeaderSpace size="large">
              <Progress
                type="circle"
                percent={progressPercent}
                size={40}
                strokeColor="#10b981"
                trailColor="rgba(255,255,255,0.2)"
                format={() => (
                  <S.ProgressText>
                    {totalAnswered}/{totalQuestions}
                  </S.ProgressText>
                )}
              />
              <S.TimerWrapper>
                <ClockCircleOutlined className="text-[#fbbf24] mr-1" />
                {formatTime(timeLeft)}
              </S.TimerWrapper>
            </S.HeaderSpace>
          </S.Header>

          <S.MainContent>
            <S.ContentCard>
              <S.TitleArea>
                <h2>
                  {currentSection === 'grammar'
                    ? 'Part 1: Grammar'
                    : 'Part 2: Vocabulary'}
                </h2>
                <div className="subtitle">
                  {currentSection === 'grammar'
                    ? 'Answer 25 multiple-choice questions. Read each complete sentence carefully before selecting the option that best completes it.'
                    : 'Complete 25 questions covering definitions, synonyms, usage in context, and common word combinations.'}
                </div>
              </S.TitleArea>

              {currentSection === 'grammar' ? (
                <GrammarSection
                  questions={mockGrammarQuestions}
                  answers={answers}
                  currentQuestionIndex={currentQuestionIndex}
                  onSelectAnswer={selectAnswer}
                />
              ) : (
                <VocabularySection
                  sets={mockVocabularySets}
                  answers={answers}
                  currentQuestionIndex={currentQuestionIndex}
                  onSelectAnswer={selectAnswer}
                  onQuestionFocus={setCurrentQuestionIndex}
                />
              )}
            </S.ContentCard>

            <QuestionNav
              answers={answers}
              currentQuestionIndex={currentQuestionIndex}
              totalAnswered={totalAnswered}
              onNavigateQuestion={handleNavigateQuestion}
              partId={partId}
            />
          </S.MainContent>

          <S.Footer>
            <S.FooterButton
              type="default"
              icon={<ArrowLeftOutlined />}
              size="large"
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === (isPartMode && partId === '2' ? 26 : 1)}
            >
              Câu trước
            </S.FooterButton>

            <S.FooterProgressText>
              {isPartMode 
                ? (partId === '1' ? `Câu ${currentQuestionIndex} trên 25` : `Câu ${currentQuestionIndex - 25} trên 25`)
                : `Câu ${currentQuestionIndex} trên 50`}
            </S.FooterProgressText>

            <Space size="middle">
              <S.SubmitButton
                type="primary"
                icon={<CheckCircleOutlined />}
                size="large"
                onClick={handleSubmitClick}
              >
                Nộp bài
              </S.SubmitButton>
              <S.NextButton
                type="primary"
                size="large"
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === (isPartMode && partId === '1' ? 25 : 50)}
              >
                Tiếp theo <ArrowRightOutlined className="text-[12px]" />
              </S.NextButton>
            </Space>
          </S.Footer>
        </S.PageContainer>
      </HomeS.RightColumn>
      
      {/* Kết quả chấm điểm Modal */}
      <Modal
        title={null}
        open={showResultModal}
        footer={null}
        closable={false}
        width={500}
        centered
        styles={{ body: { padding: '2.5rem 2rem', textAlign: 'center' } }}
      >
        {scoreResult && (
          <div>
            <S.ResultIconWrapper>
              <CheckCircleOutlined />
            </S.ResultIconWrapper>
            <S.ResultTitle>
              Hoàn thành bài thi!
            </S.ResultTitle>
            <S.ResultDescription>
              Kết quả điểm luyện tập của bạn:
            </S.ResultDescription>

            <S.ResultStatsGrid $isPartMode={isPartMode}>
              {(!isPartMode || partId === '1') && (
                <S.StatBlock>
                  <Statistic title="Ngữ pháp" value={scoreResult.grammarScore} suffix="/ 25" valueStyle={{ color: '#1677ff', fontWeight: 800 }} />
                </S.StatBlock>
              )}
              {(!isPartMode || partId === '2') && (
                <S.StatBlock>
                  <Statistic title="Từ vựng" value={scoreResult.vocabScore} suffix="/ 25" valueStyle={{ color: '#52c41a', fontWeight: 800 }} />
                </S.StatBlock>
              )}
            </S.ResultStatsGrid>

            <S.SummaryBox>
              <S.SummaryBoxTitle>
                Tổng số điểm
              </S.SummaryBoxTitle>
              <S.SummaryBoxScore>
                {isPartMode 
                  ? (partId === '1' ? scoreResult.grammarScore : scoreResult.vocabScore) 
                  : scoreResult.total}{' '}
                <span>
                  / {isPartMode ? 25 : 50}
                </span>
              </S.SummaryBoxScore>
              <S.SummaryBoxDesc>
                {isPartMode 
                  ? 'Điểm số luyện tập này giúp bạn đánh giá năng lực của từng cấu phần.' 
                  : 'Điểm số này đóng vai trò quyết định bậc CEFR nếu các kỹ năng khác nằm ở ranh giới.'}
              </S.SummaryBoxDesc>
            </S.SummaryBox>

            <S.ModalActionButtons size="middle">
              <Button
                icon={<UndoOutlined />}
                size="large"
                onClick={handleRestartExam}
              >
                Làm lại đề
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={() => {
                  setShowResultModal(false);
                  navigate({ to: '/grammar' });
                }}
              >
                Quay về trang chính
              </Button>
            </S.ModalActionButtons>
          </div>
        )}
      </Modal>
    </HomeS.MainLayout>
  );
};

export default GrammarTestPage;
