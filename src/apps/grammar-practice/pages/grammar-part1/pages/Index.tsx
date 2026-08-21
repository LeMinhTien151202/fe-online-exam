import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  LeftOutlined,
  RollbackOutlined
} from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import { Progress,
  Space,
  Tag,
} from 'antd';
import { ExamLoading, ExamEmpty } from '@/shared/components/ExamState';
import React from 'react';

import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import { GrammarSection } from '../components/GrammarSection';
import { QuestionNav } from '../components/QuestionNav';
import { usePart1Action } from '../hook/usePart1Action';
import { confirmExitExam } from '../../../../../shared/utils/examDialogs';
import * as S from '../styles/styled';

export const Part1Page: React.FC = () => {
  const navigate = useNavigate();

  const {
    isLoading,
    questions,
    total,
    answers,
    results,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    selectAnswer,
    handleNextQuestion,
    handlePrevQuestion,
    handleSubmitClick,
    handleRetry,
    isSubmitted,
    isGrading,
    correctCount,
    correctIndex,
    scoreTotal,
    gradedCount,
    progressPercent
  } = usePart1Action();

  const handleBackToLanding = () => {
    confirmExitExam({
      content: 'Các câu đã chấm vẫn được lưu trong lịch sử làm bài.',
      onOk: () => navigate({ to: '/grammar' }),
    });
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
              {isSubmitted && (
                <Tag color={correctCount > 0 ? 'success' : 'error'} style={{ fontWeight: 600 }}>
                  Kết quả: {correctCount}/{scoreTotal}
                </Tag>
              )}
            </Space>

            <S.HeaderSpace size="large">
              <Progress
                type="circle"
                percent={progressPercent}
                size={40}
                strokeColor="#10b981"
                trailColor="rgba(255,255,255,0.2)"
                format={() => <S.ProgressText>{gradedCount}/{total || 0}</S.ProgressText>}
              />
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
                      Làm xong câu nào nộp câu đó, hệ thống chấm và trả kết quả ngay.
                    </div>
                  </S.TitleArea>

                  <GrammarSection
                    questions={questions}
                    answers={answers}
                    currentQuestionIndex={currentQuestionIndex}
                    onSelectAnswer={selectAnswer}
                    isSubmitted={isSubmitted}
                    isCorrect={correctCount > 0}
                    correctIndex={correctIndex}
                  />
                </S.ContentCard>

                <QuestionNav
                  answers={answers}
                  currentQuestionIndex={currentQuestionIndex}
                  totalAnswered={gradedCount}
                  onNavigateQuestion={setCurrentQuestionIndex}
                  questionNumbers={questions.map((q) => q.questionNumber)}
                  gradedNumbers={Object.keys(results).map(Number)}
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
              {isSubmitted ? (
                <S.SubmitButton type="primary" icon={<RollbackOutlined />} size="large" onClick={handleRetry} style={{ background: '#f59e0b', borderColor: '#f59e0b' }}>
                  Làm lại
                </S.SubmitButton>
              ) : (
                <S.SubmitButton type="primary" icon={<CheckCircleOutlined />} size="large" loading={isGrading} onClick={handleSubmitClick} disabled={total === 0}>
                  Nộp câu này
                </S.SubmitButton>
              )}
              <S.NextButton type="primary" size="large" onClick={handleNextQuestion} disabled={currentQuestionIndex >= total}>
                Tiếp theo <ArrowRightOutlined className="text-[12px]" />
              </S.NextButton>
            </Space>
          </S.Footer>
        </S.PageContainer>
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default Part1Page;
