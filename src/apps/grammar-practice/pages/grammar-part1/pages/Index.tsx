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
import { Button,Empty,Modal,Progress,Space,Spin,Statistic,message } from 'antd';
import React,{ useMemo, useState } from 'react';

import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import { GrammarSection } from '../components/GrammarSection';
import { QuestionNav } from '../components/QuestionNav';
import { usePart1Action } from '../hook/usePart1Action';
import { useGrammarQuestionsQuery } from '../../../services/grammarQuery';
import { mapGrammarQuestions } from '../../../services/mappers';
import * as S from '../styles/styled';

export const Part1Page: React.FC = () => {
  const navigate = useNavigate();

  const { data: res, isLoading } = useGrammarQuestionsQuery(1);
  const questions = useMemo(() => mapGrammarQuestions(res?.data ?? []), [res]);
  const total = questions.length;

  const [showResultModal, setShowResultModal] = useState(false);
  const [scoreResult, setScoreResult] = useState<number | null>(null);

  const handleExamSubmit = (finalAnswers: Record<number, string>) => {
    let grammarScore = 0;
    questions.forEach((q) => {
      const answer = finalAnswers[q.questionNumber];
      if (answer && answer.toLowerCase() === q.correctAnswer.toLowerCase()) grammarScore++;
    });
    setScoreResult(grammarScore);

    const saved = localStorage.getItem('aptis_grammar_progress');
    let progressObj: Record<string, number> = {};
    if (saved) { try { progressObj = JSON.parse(saved); } catch { /* bỏ qua lỗi */ } }
    progressObj['g1'] = 100;
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
  } = usePart1Action(handleExamSubmit, 12 * 60 + 30, 'aptis_grammar_part_1', total || 1);

  const handlePrevQuestion = () => { if (currentQuestionIndex > 1) setCurrentQuestionIndex(currentQuestionIndex - 1); };
  const handleNextQuestion = () => { if (currentQuestionIndex < total) setCurrentQuestionIndex(currentQuestionIndex + 1); };

  const handleBackToLanding = () => {
    Modal.confirm({
      title: 'Xác nhận thoát khỏi phòng thi?',
      icon: <InfoCircleOutlined className="text-[#faad14]" />,
      content: 'Hệ thống vẫn sẽ lưu kết quả tạm thời của bạn.',
      okText: 'Rời phòng thi',
      cancelText: 'Tiếp tục làm bài',
      onOk: () => navigate({ to: '/grammar' }),
    });
  };

  const handleSubmitClick = () => {
    const { hasUnanswered, unansweredCount, confirm } = submitExamManual();
    Modal.confirm({
      title: 'Xác nhận nộp bài?',
      icon: <CheckCircleOutlined className="text-[#52c41a]" />,
      content: hasUnanswered
        ? `Bạn còn ${unansweredCount} câu chưa trả lời. Nộp bài ngay?`
        : `Bạn đã hoàn thành ${total} câu. Nộp bài để chấm điểm?`,
      okText: 'Nộp bài',
      cancelText: 'Làm tiếp',
      onOk: confirm,
    });
  };

  const handleRestartExam = () => {
    resetExam();
    setShowResultModal(false);
    setScoreResult(null);
    message.success('Đã làm mới. Chúc bạn làm bài tốt!');
  };

  return (
    <HomeS.MainLayout>
      <Sidebar />
      <HomeS.RightColumn>
        <S.PageContainer>
          <S.Header>
            <Space size="large">
              <S.HeaderBackButton type="text" icon={<LeftOutlined />} onClick={handleBackToLanding}>
                Quay lại
              </S.HeaderBackButton>
              <S.HeaderTitleText>Part 1: Grammar Practice</S.HeaderTitleText>
            </Space>

            <S.HeaderSpace size="large">
              <Progress
                type="circle"
                percent={progressPercent}
                size={40}
                strokeColor="#10b981"
                trailColor="rgba(255,255,255,0.2)"
                format={() => <S.ProgressText>{totalAnswered}/{total || 0}</S.ProgressText>}
              />
              <S.TimerWrapper>
                <ClockCircleOutlined className="text-[#fbbf24] mr-1" />
                {formatTime(timeLeft)}
              </S.TimerWrapper>
            </S.HeaderSpace>
          </S.Header>

          <S.MainContent>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem', width: '100%' }}><Spin size="large" /></div>
            ) : total === 0 ? (
              <div style={{ padding: '3rem', width: '100%' }}>
                <Empty description="Chưa có câu hỏi Ngữ pháp. Vui lòng quay lại sau." />
              </div>
            ) : (
              <>
                <S.ContentCard>
                  <S.TitleArea>
                    <h2>Part 1: Grammar</h2>
                    <div className="subtitle">
                      Trả lời {total} câu trắc nghiệm. Đọc kỹ câu và chọn phương án đúng nhất.
                    </div>
                  </S.TitleArea>

                  <GrammarSection
                    questions={questions}
                    answers={answers}
                    currentQuestionIndex={currentQuestionIndex}
                    onSelectAnswer={selectAnswer}
                  />
                </S.ContentCard>

                <QuestionNav
                  answers={answers}
                  currentQuestionIndex={currentQuestionIndex}
                  totalAnswered={totalAnswered}
                  onNavigateQuestion={setCurrentQuestionIndex}
                  questionNumbers={questions.map((q) => q.questionNumber)}
                  sectionLabel="Ngữ pháp"
                />
              </>
            )}
          </S.MainContent>

          <S.Footer>
            <S.FooterButton
              type="default"
              icon={<ArrowLeftOutlined />}
              size="large"
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 1}
            >
              Câu trước
            </S.FooterButton>

            <S.FooterProgressText>
              Câu {currentQuestionIndex} trên {total || 0}
            </S.FooterProgressText>

            <Space size="middle">
              <S.SubmitButton type="primary" icon={<CheckCircleOutlined />} size="large" onClick={handleSubmitClick} disabled={total === 0}>
                Nộp bài
              </S.SubmitButton>
              <S.NextButton type="primary" size="large" onClick={handleNextQuestion} disabled={currentQuestionIndex >= total}>
                Tiếp theo <ArrowRightOutlined className="text-[12px]" />
              </S.NextButton>
            </Space>
          </S.Footer>
        </S.PageContainer>
      </HomeS.RightColumn>

      <Modal title={null} open={showResultModal} footer={null} closable={false} width={500} centered styles={{ body: { padding: '2.5rem 2rem', textAlign: 'center' } }}>
        {scoreResult !== null && (
          <div>
            <S.ResultIconWrapper><CheckCircleOutlined /></S.ResultIconWrapper>
            <S.ResultTitle>Hoàn thành bài luyện tập!</S.ResultTitle>
            <S.ResultDescription>Kết quả điểm luyện tập của bạn:</S.ResultDescription>

            <S.ResultStatsGrid $isPartMode={true}>
              <S.StatBlock>
                <Statistic title="Ngữ pháp" value={scoreResult} suffix={`/ ${total}`} valueStyle={{ color: '#1677ff', fontWeight: 800 }} />
              </S.StatBlock>
            </S.ResultStatsGrid>

            <S.SummaryBox>
              <S.SummaryBoxTitle>Tổng số điểm</S.SummaryBoxTitle>
              <S.SummaryBoxScore>{scoreResult} <span>/ {total}</span></S.SummaryBoxScore>
              <S.SummaryBoxDesc>Điểm số giúp bạn đánh giá năng lực phần Ngữ pháp.</S.SummaryBoxDesc>
            </S.SummaryBox>

            <S.ModalActionButtons size="middle">
              <Button icon={<UndoOutlined />} size="large" onClick={handleRestartExam}>Làm lại</Button>
              <Button type="primary" size="large" onClick={() => { setShowResultModal(false); navigate({ to: '/grammar' }); }}>
                Quay về trang chính
              </Button>
            </S.ModalActionButtons>
          </div>
        )}
      </Modal>
    </HomeS.MainLayout>
  );
};

export default Part1Page;
