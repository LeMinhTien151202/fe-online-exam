import React from 'react';
import { Space, Progress, Button } from 'antd';
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
import { usePart3 } from '../hook/usePart3';

export const Part3Page: React.FC = () => {
  const {
    timeLeft,
    currentSubIndex,
    answers,
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
    currentCompareSet,
    activeQuestion,
    totalSubQuestions,
    answeredCount,
    progressPercent,
  } = usePart3();

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
                Part 3: Compare & Provide Reasons
              </span>
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
            <S.ContentGrid>
              <S.LeftColumn>
                <S.ContentCard>
                  <S.TitleArea>
                    <div>
                      <h2>So sánh hai bức tranh và trả lời câu hỏi</h2>
                      <div className="subtitle">
                        Speaking Part 3 • 3 Questions
                      </div>
                    </div>
                  </S.TitleArea>

                  {/* Side-by-side Images */}
                  <S.DoubleImageGrid>
                    <S.DoubleImageWrapper $height="220px">
                      <img src={currentCompareSet.image1Url} alt="Hình 1" />
                      <div className="label">Hình 1</div>
                    </S.DoubleImageWrapper>
                    <S.DoubleImageWrapper $height="220px">
                      <img src={currentCompareSet.image2Url} alt="Hình 2" />
                      <div className="label">Hình 2</div>
                    </S.DoubleImageWrapper>
                  </S.DoubleImageGrid>

                  {/* Sub-tabs */}
                  <S.SubTabContainer>
                    {[1, 2, 3].map((idx) => {
                      const isTabDone = !!answers[`1-${idx}`];
                      return (
                        <S.SubTab 
                          key={idx}
                          $active={currentSubIndex === idx}
                          $color="#ea580c"
                          onClick={() => handleSubTabChange(idx)}
                        >
                          Câu {idx} {isTabDone && '✓'}
                        </S.SubTab>
                      );
                    })}
                  </S.SubTabContainer>

                  <S.QuestionBox $borderColor="#ea580c">
                    <div className="q-badge">
                      {currentSubIndex === 1 ? 'So sánh hai tranh (Compare)' : 'Giải thích nguyên nhân (Reasons)'}
                    </div>
                    <div className="q-text">{activeQuestion.questionText}</div>
                  </S.QuestionBox>
                </S.ContentCard>
              </S.LeftColumn>

              <S.RightColumn>
                <SpeakingController 
                  prepTime={45} // 45 giây chuẩn bị
                  recordingTime={45} // Ghi âm 45 giây
                  statusColor="#ea580c"
                  title={`p3-q${currentSubIndex}`}
                  onCompleted={handleRecordComplete}
                />
                {/* Collapsible Sample Answer */}
                <S.CollapsibleWrapper>
                  <S.CollapsibleHeader onClick={() => setShowSampleAnswer(!showSampleAnswer)}>
                    <span>
                      <UnlockOutlined style={{ marginRight: '8px', color: '#ea580c' }} /> 
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
                                background: activeSampleIdx === sIdx ? '#ea580c' : undefined,
                                borderColor: activeSampleIdx === sIdx ? '#ea580c' : undefined,
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
              </S.RightColumn>
            </S.ContentGrid>
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
                  background: '#10b981',
                  borderColor: '#10b981',
                  padding: '0 2rem',
                  boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)'
                }}
                onClick={handleSubmit}
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
                onClick={handleNext}
              >
                Tiếp theo <RightOutlined style={{ fontSize: '12px' }} />
              </Button>
            </Space>
          </S.Footer>
        </S.PageContainer>
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default Part3Page;
