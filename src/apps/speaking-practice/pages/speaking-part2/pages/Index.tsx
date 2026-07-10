import React from 'react';
import { Space, Progress, Button, Tag } from 'antd';
import { ExamLoading, ExamEmpty } from '@/shared/components/ExamState';
import { 
  LeftOutlined, 
  RightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DownOutlined,
  UpOutlined,
  UnlockOutlined
} from '@ant-design/icons';
import * as S from '../styles/styled';
import * as HomeS from '../../../../home/pages/styled';
import { Sidebar } from '../../../../home/components/Sidebar';
import { SpeakingController } from '../../speaking-part1/components/SpeakingController';
import { usePart2 } from '../hook/usePart2';

export const Part2Page: React.FC = () => {
  const {
    isLoading,
    hasData,
    hasNext,
    setCount,
    currentSetNumber,
    isSubDone,
    timeLeft,
    currentSubIndex,
    showSampleAnswer,
    setShowSampleAnswer,
    activeSampleIdx,
    setActiveSampleIdx,
    formatTime,
    handleSubTabChange,
    handleNext,
    handleBack,
    handleSubmit,
    handleRecordComplete,
    currentSet,
    activeQuestion,
    totalSubQuestions,
    answeredCount,
    progressPercent,
  } = usePart2();

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
                Part 2: Describe, Express Opinion & Explain
              </span>
              {setCount > 1 && (
                <Tag color="blue" style={{ fontWeight: 600 }}>Bộ {currentSetNumber}/{setCount}</Tag>
              )}
            </Space>

            <Space size="large" style={{ display: 'flex', alignItems: 'center' }}>
              <Progress
                type="circle"
                percent={progressPercent}
                size={40}
                strokeColor="#10b981"
                trailColor="rgba(255,255,255,0.2)"
                format={() => <span style={{ color: 'white', fontSize: '11px', fontWeight: 'bold' }}>{answeredCount}/{totalSubQuestions}</span>}
              />
              <S.TimerWrapper>
                <ClockCircleOutlined style={{ color: '#fbbf24', marginRight: '4px' }} />
                {formatTime(timeLeft)}
              </S.TimerWrapper>
            </Space>
          </S.Header>

          <S.MainContent>
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
                      <h2>Miêu tả tranh và trả lời câu hỏi</h2>
                      <div className="subtitle">
                        Speaking Part 2 • {totalSubQuestions} Questions
                      </div>
                    </div>
                  </S.TitleArea>

                  {/* Image Display */}
                  <S.ImageWrapper $height="280px">
                    <img src={currentSet.imageUrl} alt={currentSet.title} />
                  </S.ImageWrapper>

                  {/* Sub-tabs inside the Set */}
                  <S.SubTabContainer>
                    {currentSet.questions.map((_, i) => {
                      const idx = i + 1;
                      return (
                        <S.SubTab
                          key={idx}
                          $active={currentSubIndex === idx}
                          $color="#059669"
                          onClick={() => handleSubTabChange(idx)}
                        >
                          Câu {idx} {isSubDone(idx) && '✓'}
                        </S.SubTab>
                      );
                    })}
                  </S.SubTabContainer>

                  <S.QuestionBox $borderColor="#059669">
                    <div className="q-badge">
                      {currentSubIndex === 1 ? 'Mô tả tranh (Describe)' : 'Câu hỏi mở rộng (Explain)'}
                    </div>
                    <div className="q-text">{activeQuestion.questionText}</div>
                  </S.QuestionBox>
                </S.ContentCard>
              </S.LeftColumn>

              <S.RightColumn>
                <SpeakingController 
                  prepTime={45} // 45 giây chuẩn bị
                  recordingTime={45} // Ghi âm 45 giây
                  statusColor="#059669"
                  title={`p2-q${currentSubIndex}`}
                  onCompleted={handleRecordComplete}
                />
                {/* Collapsible Sample Answer */}
                {activeQuestion.sampleAnswers.length > 0 && (
                <S.CollapsibleWrapper>
                  <S.CollapsibleHeader onClick={() => setShowSampleAnswer(!showSampleAnswer)}>
                    <span>
                      <UnlockOutlined style={{ marginRight: '8px', color: '#059669' }} /> 
                      Xem đáp án mẫu
                    </span>
                    {showSampleAnswer ? <UpOutlined /> : <DownOutlined />}
                  </S.CollapsibleHeader>
                  {showSampleAnswer && (
                    <S.CollapsibleBody>
                      {activeQuestion.sampleAnswers && activeQuestion.sampleAnswers.length > 1 && (
                        <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {activeQuestion.sampleAnswers.map((_, sIdx) => (
                            <Button 
                              key={sIdx}
                              size="small"
                              type={activeSampleIdx === sIdx ? "primary" : "default"}
                              onClick={() => setActiveSampleIdx(sIdx)}
                              style={{ 
                                borderRadius: '12px', 
                                fontSize: '12px',
                                background: activeSampleIdx === sIdx ? '#059669' : undefined,
                                borderColor: activeSampleIdx === sIdx ? '#059669' : undefined,
                              }}
                            >
                              Đáp án {sIdx + 1}
                            </Button>
                          ))}
                        </div>
                      )}
                      {activeQuestion.sampleAnswers[activeSampleIdx]}
                    </S.CollapsibleBody>
                  )}
                </S.CollapsibleWrapper>
                )}
              </S.RightColumn>
            </S.ContentGrid>
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
              Quay lại
            </Button>

            <Space size="middle">
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                size="large"
                style={{
                  borderRadius: '2rem',
                  fontWeight: 600,
                  background: '#1a365d',
                  borderColor: '#1a365d',
                  padding: '0 2rem',
                  boxShadow: '0 4px 6px -1px rgba(26, 54, 93, 0.25)'
                }}
                onClick={handleSubmit}
              >
                Nộp bài
              </Button>
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

export default Part2Page;
