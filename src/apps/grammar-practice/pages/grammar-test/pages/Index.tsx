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
      icon: <InfoCircleOutlined style={{ color: '#faad14' }} />,
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
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
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
              <Button
                type="text"
                icon={<LeftOutlined />}
                onClick={handleBackToLanding}
                style={{ color: '#cbd5e1', fontWeight: 'bold' }}
              >
                Quay lại
              </Button>
              <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                {isPartMode 
                  ? (partId === '1' ? 'Part 1: Grammar Practice' : 'Part 2: Vocabulary Practice')
                  : 'Grammar & Vocabulary Test'}
              </span>
            </Space>

            <Space size="large" style={{ display: 'flex', alignItems: 'center' }}>
              <Progress
                type="circle"
                percent={progressPercent}
                size={40}
                strokeColor="#10b981"
                trailColor="rgba(255,255,255,0.2)"
                format={() => (
                  <span style={{ color: 'white', fontSize: '11px', fontWeight: 'bold' }}>
                    {totalAnswered}/{totalQuestions}
                  </span>
                )}
              />
              <S.TimerWrapper>
                <ClockCircleOutlined style={{ color: '#fbbf24', marginRight: '4px' }} />
                {formatTime(timeLeft)}
              </S.TimerWrapper>
            </Space>
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
            <Button
              type="default"
              icon={<ArrowLeftOutlined />}
              size="large"
              style={{ borderRadius: '2rem', fontWeight: 600, padding: '0 1.5rem', border: '1px solid #e2e8f0', color: '#64748b' }}
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === (isPartMode && partId === '2' ? 26 : 1)}
            >
              Câu trước
            </Button>

            <span style={{ fontWeight: 700, color: '#475569', fontSize: '0.95rem' }}>
              {isPartMode 
                ? (partId === '1' ? `Câu ${currentQuestionIndex} trên 25` : `Câu ${currentQuestionIndex - 25} trên 25`)
                : `Câu ${currentQuestionIndex} trên 50`}
            </span>

            <Space size="middle">
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                size="large"
                style={{
                  borderRadius: '2rem',
                  fontWeight: 600,
                  background: '#10b981',
                  borderColor: '#10b981',
                  padding: '0 2rem',
                  boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)'
                }}
                onClick={handleSubmitClick}
              >
                Nộp bài
              </Button>
              <Button
                type="primary"
                size="large"
                style={{
                  borderRadius: '2rem',
                  fontWeight: 600,
                  background: '#2563eb',
                  borderColor: '#2563eb',
                  padding: '0 1.5rem',
                  boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
                }}
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === (isPartMode && partId === '1' ? 25 : 50)}
              >
                Tiếp theo <ArrowRightOutlined style={{ fontSize: '12px' }} />
              </Button>
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
            <div style={{ fontSize: '4.5rem', color: '#52c41a', marginBottom: '1rem' }}>
              <CheckCircleOutlined />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              Hoàn thành bài thi!
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '2rem' }}>
              Kết quả điểm luyện tập của bạn:
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isPartMode ? '1fr' : 'repeat(2, 1fr)',
                gap: '1rem',
                marginBottom: '2rem'
              }}
            >
              {(!isPartMode || partId === '1') && (
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem' }}>
                  <Statistic title="Ngữ pháp" value={scoreResult.grammarScore} suffix="/ 25" valueStyle={{ color: '#1677ff', fontWeight: 800 }} />
                </div>
              )}
              {(!isPartMode || partId === '2') && (
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem' }}>
                  <Statistic title="Từ vựng" value={scoreResult.vocabScore} suffix="/ 25" valueStyle={{ color: '#52c41a', fontWeight: 800 }} />
                </div>
              )}
            </div>

            <div
              style={{
                background: '#e6f4ff',
                padding: '1.25rem',
                borderRadius: '0.75rem',
                marginBottom: '2.5rem',
                border: '1px solid rgba(22, 119, 255, 0.2)'
              }}
            >
              <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Tổng số điểm
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#1e3a8a' }}>
                {isPartMode 
                  ? (partId === '1' ? scoreResult.grammarScore : scoreResult.vocabScore) 
                  : scoreResult.total}{' '}
                <span style={{ fontSize: '1.25rem', color: '#64748b', fontWeight: 500 }}>
                  / {isPartMode ? 25 : 50}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem', marginBottom: 0, fontStyle: 'italic' }}>
                {isPartMode 
                  ? 'Điểm số luyện tập này giúp bạn đánh giá năng lực của từng cấu phần.' 
                  : 'Điểm số này đóng vai trò quyết định bậc CEFR nếu các kỹ năng khác nằm ở ranh giới.'}
              </p>
            </div>

            <Space size="middle" style={{ width: '100%', justifyContent: 'center' }}>
              <Button
                icon={<UndoOutlined />}
                size="large"
                style={{ borderRadius: '0.5rem', fontWeight: 600 }}
                onClick={handleRestartExam}
              >
                Làm lại đề
              </Button>
              <Button
                type="primary"
                size="large"
                style={{ borderRadius: '0.5rem', fontWeight: 600 }}
                onClick={() => {
                  setShowResultModal(false);
                  navigate({ to: '/grammar' });
                }}
              >
                Quay về trang chính
              </Button>
            </Space>
          </div>
        )}
      </Modal>
    </HomeS.MainLayout>
  );
};

export default GrammarTestPage;
