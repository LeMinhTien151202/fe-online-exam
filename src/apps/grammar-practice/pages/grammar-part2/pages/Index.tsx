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
import { QuestionNav } from '../components/QuestionNav';
import { VocabularySection } from '../components/VocabularySection';
import { usePart2Action } from '../hook/usePart2Action';
import { confirmExitExam } from '../../../../../shared/utils/examDialogs';
import * as S from '../styles/styled';

export const Part2Page: React.FC = () => {
  const navigate = useNavigate();

  const {
    isLoading,
    sets,
    total,
    totalUnits,
    answers,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    activeUnit,
    navItems,
    selectAnswer,
    handleNavigateUnit,
    handlePrevQuestion,
    handleNextQuestion,
    handleSubmitClick,
    handleRetry,
    isSubmitted,
    isGrading,
    correctCount,
    correctAnswers,
    scoreTotal,
    gradedUnits,
    progressPercent
  } = usePart2Action();

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
              <S.HeaderTitleText>Part 2: Vocabulary Practice</S.HeaderTitleText>
              {isSubmitted && (
                <Tag color={correctCount >= Math.ceil(scoreTotal * 0.8) ? 'success' : 'warning'} style={{ fontWeight: 600 }}>
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
                format={() => <S.ProgressText>{gradedUnits}/{totalUnits || 0}</S.ProgressText>}
              />
            </S.HeaderSpace>
          </S.Header>

          <S.MainContent>
            {isLoading ? (
              <ExamLoading />
            ) : total === 0 ? (
              <div style={{ padding: '3rem', width: '100%' }}>
                <ExamEmpty description="Chưa có câu hỏi Từ vựng. Vui lòng quay lại sau." />
              </div>
            ) : (
              <>
                <S.ContentCard>
                  <S.TitleArea>
                    <h2>Part 2: Vocabulary</h2>
                    <div className="subtitle">
                      Làm xong task nào nộp task đó, hệ thống chấm và trả kết quả ngay ({totalUnits} task • {total} ý).
                    </div>
                  </S.TitleArea>

                  <VocabularySection
                    sets={sets}
                    answers={answers}
                    currentQuestionIndex={currentQuestionIndex}
                    onSelectAnswer={selectAnswer}
                    onQuestionFocus={setCurrentQuestionIndex}
                    isSubmitted={isSubmitted}
                    correctAnswers={correctAnswers}
                  />
                </S.ContentCard>

                <QuestionNav
                  items={navItems}
                  sectionLabel="Từ vựng — mỗi số là 1 task (5 ý)"
                  totalAnswered={gradedUnits}
                  totalQuestions={totalUnits}
                  onNavigate={handleNavigateUnit}
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
              disabled={activeUnit <= 1}
            >
              Câu trước
            </S.FooterButton>

            <S.FooterProgressText>
              Câu {totalUnits > 0 ? activeUnit : 0} trên {totalUnits || 0}
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
              <S.NextButton type="primary" size="large" onClick={handleNextQuestion} disabled={activeUnit >= totalUnits}>
                Tiếp theo <ArrowRightOutlined className="text-[12px]" />
              </S.NextButton>
            </Space>
          </S.Footer>
        </S.PageContainer>
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default Part2Page;
