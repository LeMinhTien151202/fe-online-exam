import {
ArrowLeftOutlined,
ArrowRightOutlined,
CheckCircleOutlined,
ClockCircleOutlined,
LeftOutlined,
UndoOutlined
} from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import { Button,Modal,Progress,Space,Statistic,message } from 'antd';
import { ExamLoading, ExamEmpty } from '@/shared/components/ExamState';
import React,{ useMemo, useState } from 'react';

import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import { GrammarSection } from '../components/GrammarSection';
import { QuestionNav } from '../components/QuestionNav';
import { usePart1Action } from '../hook/usePart1Action';
import { flattenGrammarExam, collectGrammarAnswers } from '../../../services/grammarExamMapper';
import { mapGrammarQuestions } from '../../../services/mappers';
import { usePartPracticeExam, useSubmitExamMutation } from '../../../../../shared/services/student-exam';
import { confirmExitExam, confirmSubmitExam } from '../../../../../shared/utils/examDialogs';
import * as S from '../styles/styled';

export const Part1Page: React.FC = () => {
  const navigate = useNavigate();

  // Luyện theo phần = đề PART_PRACTICE (skill 1, part 1). Tải đề để build câu + nộp tăng tiến độ.
  const { examId, examDetail, isLoading } = usePartPracticeExam(1, 1);
  const questions = useMemo(() => {
    if (!examDetail) return [];
    const part = flattenGrammarExam(examDetail).find((p) => p.partNumber === 1);
    return mapGrammarQuestions(part?.questions ?? []);
  }, [examDetail]);
  const total = questions.length;

  const submitMutation = useSubmitExamMutation();

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

    // Nộp lên BE để tăng student_progress (skill 1, part 1). Không chặn UI.
    if (examId) {
      const submitAnswers = collectGrammarAnswers({ grammarQuestions: questions, vocabularySets: [] }, finalAnswers);
      submitMutation.mutate({ examId, payload: { answers: submitAnswers } });
    }
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
    confirmExitExam({
      content: 'Hệ thống vẫn sẽ lưu kết quả tạm thời của bạn.',
      onOk: () => navigate({ to: '/grammar' }),
    });
  };

  const handleSubmitClick = () => {
    const { unansweredCount, confirm } = submitExamManual();
    confirmSubmitExam({ unansweredCount, totalQuestions: total, onOk: confirm });
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
              <ExamLoading />
            ) : total === 0 ? (
              <div style={{ padding: '3rem', width: '100%' }}>
                <ExamEmpty description="Chưa có câu hỏi Ngữ pháp. Vui lòng quay lại sau." />
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
