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
import { QuestionNav } from '../components/QuestionNav';
import { VocabularySection } from '../components/VocabularySection';
import { usePart2Action } from '../hook/usePart2Action';
import { useGrammarQuestionsQuery } from '../../../services/grammarQuery';
import { mapVocabularySets } from '../../../services/mappers';
import * as S from '../styles/styled';

export const Part2Page: React.FC = () => {
  const navigate = useNavigate();

  const { data: res, isLoading } = useGrammarQuestionsQuery(2);
  const sets = useMemo(() => mapVocabularySets(res?.data ?? []), [res]);
  const allNumbers = useMemo(() => sets.flatMap((s) => s.subQuestions.map((q) => q.questionNumber)), [sets]);
  const total = allNumbers.length;

  const [showResultModal, setShowResultModal] = useState(false);
  const [scoreResult, setScoreResult] = useState<number | null>(null);

  const handleExamSubmit = (finalAnswers: Record<number, string>) => {
    let vocabScore = 0;
    sets.forEach((set) => {
      set.subQuestions.forEach((subQ) => {
        const answer = finalAnswers[subQ.questionNumber];
        if (answer && answer.toLowerCase() === subQ.correctAnswer.toLowerCase()) vocabScore++;
      });
    });
    setScoreResult(vocabScore);

    const saved = localStorage.getItem('aptis_grammar_progress');
    let progressObj: Record<string, number> = {};
    if (saved) { try { progressObj = JSON.parse(saved); } catch { /* bỏ qua lỗi */ } }
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
  } = usePart2Action(handleExamSubmit, 12 * 60 + 30, 'aptis_grammar_part_2', total || 1);

  const activePos = allNumbers.indexOf(currentQuestionIndex);
  const handlePrevQuestion = () => { if (activePos > 0) setCurrentQuestionIndex(allNumbers[activePos - 1]); };
  const handleNextQuestion = () => { if (activePos >= 0 && activePos < total - 1) setCurrentQuestionIndex(allNumbers[activePos + 1]); };

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
              <S.HeaderTitleText>Part 2: Vocabulary Practice</S.HeaderTitleText>
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
                <Empty description="Chưa có câu hỏi Từ vựng. Vui lòng quay lại sau." />
              </div>
            ) : (
              <>
                <S.ContentCard>
                  <S.TitleArea>
                    <h2>Part 2: Vocabulary</h2>
                    <div className="subtitle">
                      Hoàn thành {total} câu qua {sets.length} nhóm nhiệm vụ (định nghĩa, đồng/trái nghĩa, cụm từ...).
                    </div>
                  </S.TitleArea>

                  <VocabularySection
                    sets={sets}
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
                  onNavigateQuestion={setCurrentQuestionIndex}
                  questionNumbers={allNumbers}
                  sectionLabel="Từ vựng"
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
              disabled={activePos <= 0}
            >
              Câu trước
            </S.FooterButton>

            <S.FooterProgressText>
              Câu {activePos >= 0 ? activePos + 1 : 0} trên {total || 0}
            </S.FooterProgressText>

            <Space size="middle">
              <S.SubmitButton type="primary" icon={<CheckCircleOutlined />} size="large" onClick={handleSubmitClick} disabled={total === 0}>
                Nộp bài
              </S.SubmitButton>
              <S.NextButton type="primary" size="large" onClick={handleNextQuestion} disabled={activePos >= total - 1}>
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
                <Statistic title="Từ vựng" value={scoreResult} suffix={`/ ${total}`} valueStyle={{ color: '#52c41a', fontWeight: 800 }} />
              </S.StatBlock>
            </S.ResultStatsGrid>

            <S.SummaryBox>
              <S.SummaryBoxTitle>Tổng số điểm</S.SummaryBoxTitle>
              <S.SummaryBoxScore>{scoreResult} <span>/ {total}</span></S.SummaryBoxScore>
              <S.SummaryBoxDesc>Điểm số giúp bạn đánh giá năng lực phần Từ vựng.</S.SummaryBoxDesc>
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

export default Part2Page;
