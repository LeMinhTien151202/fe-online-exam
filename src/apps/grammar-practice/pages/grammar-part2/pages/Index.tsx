import {
ArrowLeftOutlined,
ArrowRightOutlined,
CheckCircleOutlined,
ClockCircleOutlined,
InfoCircleOutlined,
LeftOutlined,
UndoOutlined
} from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import { Button,Modal,Progress,Space,Statistic,message } from 'antd';
import React,{ useState } from 'react';

import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import { QuestionNav } from '../components/QuestionNav';
import { VocabularySection } from '../components/VocabularySection';
import { usePart2Action } from '../hook/usePart2Action';
import { mockVocabularySets } from '../services/mockExamData';
import * as S from '../styles/styled';

export const Part2Page: React.FC = () => {
  const navigate = useNavigate();
  const totalQuestions = 25;

  const [showResultModal, setShowResultModal] = useState(false);
  const [scoreResult, setScoreResult] = useState<number | null>(null);

  const handleExamSubmit = (finalAnswers: Record<number, string>) => {
    let vocabScore = 0;
    mockVocabularySets.forEach((set) => {
      set.subQuestions.forEach((subQ) => {
        const answer = finalAnswers[subQ.questionNumber];
        if (answer && answer.toLowerCase() === subQ.correctAnswer.toLowerCase()) {
          vocabScore++;
        }
      });
    });

    setScoreResult(vocabScore);

    const saved = localStorage.getItem('aptis_grammar_progress');
    let progressObj: Record<string, number> = {};
    if (saved) {
      try {
        progressObj = JSON.parse(saved);
      } catch (e) { /* bỏ qua lỗi */ }
    }
    progressObj['g2'] = 100;
    localStorage.setItem('aptis_grammar_progress', JSON.stringify(progressObj));

    setShowResultModal(true);
  };

  const {
    answers,
    currentQuestionIndex,
    timeLeft,
    progressPercent,
    setCurrentQuestionIndex,
    selectAnswer,
    submitExamManual,
    resetExam,
    formatTime,
    totalAnswered
  } = usePart2Action(handleExamSubmit);

  const handleNavigateQuestion = (qNum: number) => {
    setCurrentQuestionIndex(qNum);
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 26) {
      handleNavigateQuestion(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < 50) {
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
                Part 2: Vocabulary Practice
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
                <h2>Part 2: Vocabulary</h2>
                <div className="subtitle">
                  Complete 25 questions covering definitions, synonyms, usage in context, and common word combinations.
                </div>
              </S.TitleArea>

              <VocabularySection
                sets={mockVocabularySets}
                answers={answers}
                currentQuestionIndex={currentQuestionIndex}
                onSelectAnswer={selectAnswer}
                onQuestionFocus={setCurrentQuestionIndex}
              />
            </S.ContentCard>

            <QuestionNav
              answers={answers}
              currentQuestionIndex={currentQuestionIndex}
              totalAnswered={totalAnswered}
              onNavigateQuestion={handleNavigateQuestion}
              partId="2"
            />
          </S.MainContent>

          <S.Footer>
            <S.FooterButton
              type="default"
              icon={<ArrowLeftOutlined />}
              size="large"
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 26}
            >
              Câu trước
            </S.FooterButton>

            <S.FooterProgressText>
              Câu {currentQuestionIndex - 25} trên 25
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
                disabled={currentQuestionIndex === 50}
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
        {scoreResult !== null && (
          <div>
            <S.ResultIconWrapper>
              <CheckCircleOutlined />
            </S.ResultIconWrapper>
            <S.ResultTitle>
              Hoàn thành bài luyện tập!
            </S.ResultTitle>
            <S.ResultDescription>
              Kết quả điểm luyện tập của bạn:
            </S.ResultDescription>

            <S.ResultStatsGrid $isPartMode={true}>
              <S.StatBlock>
                <Statistic title="Từ vựng" value={scoreResult} suffix="/ 25" valueStyle={{ color: '#52c41a', fontWeight: 800 }} />
              </S.StatBlock>
            </S.ResultStatsGrid>

            <S.SummaryBox>
              <S.SummaryBoxTitle>
                Tổng số điểm
              </S.SummaryBoxTitle>
              <S.SummaryBoxScore>
                {scoreResult} <span>/ 25</span>
              </S.SummaryBoxScore>
              <S.SummaryBoxDesc>
                Điểm số luyện tập này giúp bạn đánh giá năng lực của phần Từ vựng.
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

export default Part2Page;
