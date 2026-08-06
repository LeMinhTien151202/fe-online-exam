import React from 'react';
import { Space, Progress, Button } from 'antd';
import { ExamLoading, ExamEmpty } from '@/shared/components/ExamState';
import { 
  LeftOutlined, 
  RightOutlined,
  ClockCircleOutlined,
  DownOutlined,
  UpOutlined,
  UnlockOutlined
} from '@ant-design/icons';
import * as S from '../styles/styled';
import * as HomeS from '../../../../home/pages/styled';
import { Sidebar } from '../../../../home/components/Sidebar';
import { SpeakingController } from '../components/SpeakingController';
import { QuestionGradeCard } from '../../../components/QuestionGradeCard';
import { AiGradeButton } from '../../../components/AiGradeButton';
import { QuestionBoard, type BoardStatus } from '@/shared/components/QuestionBoard';
import { usePart1 } from '../hook/usePart1';

export const Part1Page: React.FC = () => {
  const {
    isLoading,
    hasData,
    hasNext,
    timeLeft,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    showSampleAnswer,
    setShowSampleAnswer,
    activeSampleIdx,
    setActiveSampleIdx,
    formatTime,
    handleNext,
    handleBack,
    handleRecordComplete,
    currentQuestion,
    currentGrade,
    isGradingCurrent,
    canGradeCurrent,
    gradeCurrent,
    answeredCount,
    progressPercent,
    mockQuestions,
  } = usePart1();

  return (
    <HomeS.MainLayout>
      <Sidebar />
      <HomeS.RightColumn>
        <S.PageContainer>
          <S.Header>
            <Space size="middle">
              <S.BackLink to="/speaking">
                <LeftOutlined /> Quay lại
              </S.BackLink>
              <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white' }}>
                Part 1: Personal Information
              </span>
            </Space>

            <Space size="large" style={{ display: 'flex', alignItems: 'center' }}>
              <Progress
                type="circle"
                percent={progressPercent}
                size={40}
                strokeColor="#10b981"
                trailColor="rgba(255,255,255,0.2)"
                format={() => <span style={{ color: 'white', fontSize: '11px', fontWeight: 'bold' }}>{answeredCount}/{mockQuestions.length}</span>}
              />
              <S.TimerWrapper>
                <ClockCircleOutlined style={{ color: '#fbbf24', marginRight: '4px' }} />
                {formatTime(timeLeft)}
              </S.TimerWrapper>
            </Space>
          </S.Header>

          <S.MainContent $hasBoard={hasData && mockQuestions.length > 1}>
            {isLoading ? (
              <ExamLoading />
            ) : !hasData ? (
              <div style={{ padding: '3rem', width: '100%' }}>
                <ExamEmpty />
              </div>
            ) : (
            <S.ContentGrid>
              <S.LeftColumn>
                <S.ContentCard>
                  <S.TitleArea>
                    <div>
                      <div>
                        <h2>Trả lời 3 câu hỏi ngắn về bản thân</h2>
                        <div className="subtitle">
                          Speaking Part 1 • Question {currentQuestionIndex} of {mockQuestions.length}
                        </div>
                      </div>
                    </div>
                  </S.TitleArea>

                  <S.QuestionBox $borderColor="#1a365d">
                    <div className="q-badge">Câu hỏi {currentQuestionIndex}</div>
                    <div className="q-text">{currentQuestion.questionText}</div>
                  </S.QuestionBox>
                </S.ContentCard>
              </S.LeftColumn>

              <S.RightColumn>
                <SpeakingController 
                  prepTime={0} // Không có thời gian chuẩn bị
                  recordingTime={30} // Ghi âm 30 giây
                  statusColor="#1a365d"
                  title={`p1-q${currentQuestionIndex}`}
                  uploadPrefix="speaking/part/p1"
                  autoUpload
                  onCompleted={handleRecordComplete}
                />
                <QuestionGradeCard
                  loading={isGradingCurrent}
                  grade={currentGrade}
                />
                {/* Collapsible Sample Answer */}
                {currentQuestion.sampleAnswers.length > 0 && (
                <S.CollapsibleWrapper>
                  <S.CollapsibleHeader onClick={() => setShowSampleAnswer(!showSampleAnswer)}>
                    <span>
                      <UnlockOutlined style={{ marginRight: '8px', color: '#1a365d' }} /> 
                      Xem đáp án mẫu
                    </span>
                    {showSampleAnswer ? <UpOutlined /> : <DownOutlined />}
                  </S.CollapsibleHeader>
                  {showSampleAnswer && (
                    <S.CollapsibleBody>
                      {currentQuestion.sampleAnswers && currentQuestion.sampleAnswers.length > 1 && (
                        <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {currentQuestion.sampleAnswers.map((_, sIdx) => (
                            <Button 
                              key={sIdx}
                              size="small"
                              type={activeSampleIdx === sIdx ? "primary" : "default"}
                              onClick={() => setActiveSampleIdx(sIdx)}
                              style={{ 
                                borderRadius: '12px', 
                                fontSize: '12px',
                                background: activeSampleIdx === sIdx ? '#1a365d' : undefined,
                                borderColor: activeSampleIdx === sIdx ? '#1a365d' : undefined,
                              }}
                            >
                              Đáp án {sIdx + 1}
                            </Button>
                          ))}
                        </div>
                      )}
                      {currentQuestion.sampleAnswers[activeSampleIdx]}
                    </S.CollapsibleBody>
                  )}
                </S.CollapsibleWrapper>
                )}
              </S.RightColumn>
            </S.ContentGrid>
            )}
            {hasData && mockQuestions.length > 1 && (
              <QuestionBoard
                items={mockQuestions.map((q) => ({
                  key: q.id,
                  label: q.id,
                  status: (answers[q.id] ? 'answered' : 'unanswered') as BoardStatus,
                }))}
                activeKey={currentQuestionIndex}
                onJump={(k) => {
                  setCurrentQuestionIndex(k);
                  setShowSampleAnswer(false);
                  setActiveSampleIdx(0);
                }}
                answeredLabel="Đã thu âm"
                unansweredLabel="Chưa thu âm"
              />
            )}
          </S.MainContent>

          <S.Footer>
            <Button
              type="default"
              icon={<LeftOutlined />}
              size="large"
              style={{ borderRadius: '2rem', fontWeight: 600, padding: '0 1.5rem', border: '1px solid #e2e8f0', color: '#64748b' }}
              onClick={handleBack}
            >
              {currentQuestionIndex === 1 ? 'Bảng điều khiển' : 'Quay lại câu trước'}
            </Button>

            <Space size="middle">
              <AiGradeButton
                canGrade={canGradeCurrent}
                loading={isGradingCurrent}
                hasGrade={!!currentGrade}
                onGrade={gradeCurrent}
              />
              {hasNext && (
                <Button
                  type="primary"
                  size="large"
                  style={{
                    borderRadius: '2rem',
                    fontWeight: 600,
                    background: '#3b5b8c',
                    borderColor: '#3b5b8c',
                    padding: '0 1.5rem',
                    boxShadow: '0 4px 6px -1px rgba(59, 91, 140, 0.2)'
                  }}
                  onClick={handleNext}
                >
                  Câu tiếp theo <RightOutlined style={{ fontSize: '12px' }} />
                </Button>
              )}
            </Space>
          </S.Footer>
        </S.PageContainer>
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default Part1Page;
