import React from 'react';
import { Space, Progress, Button, Select, Spin, Empty } from 'antd';
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
import { SpeakingController } from '../components/SpeakingController';
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
    handleSubmit,
    handleRecordComplete,
    currentQuestion,
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

          <S.MainContent>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem', width: '100%' }}><Spin size="large" /></div>
            ) : !hasData ? (
              <div style={{ padding: '3rem', width: '100%' }}>
                <Empty description="Chưa có câu hỏi cho phần này. Vui lòng quay lại sau." />
              </div>
            ) : (
            <S.ContentGrid>
              <S.LeftColumn>
                <S.ContentCard>
                  <S.TitleArea>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <h2>Trả lời 3 câu hỏi ngắn về bản thân</h2>
                        <div className="subtitle">
                          Speaking Part 1 • Question {currentQuestionIndex} of {mockQuestions.length}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Chọn câu:</span>
                        <Select
                          value={currentQuestionIndex}
                          onChange={(val) => {
                            setCurrentQuestionIndex(val as number);
                            setShowSampleAnswer(false);
                            setActiveSampleIdx(0);
                          }}
                          style={{ width: 140 }}
                          dropdownStyle={{ maxHeight: 300, overflowY: 'auto' }}
                          showSearch
                          optionFilterProp="label"
                          options={mockQuestions.map((q) => ({
                            value: q.id,
                            label: `Câu ${q.id}`,
                            labelNode: (
                              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                <span>Câu {q.id}</span>
                                {answers[q.id] ? <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> : <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>Chưa làm</span>}
                              </div>
                            )
                          }))}
                          optionRender={(option) => (option.data as { labelNode?: React.ReactNode }).labelNode}
                        />
                      </div>
                    </div>
                  </S.TitleArea>

                  <S.QuestionBox $borderColor="#0284c7">
                    <div className="q-badge">Câu hỏi {currentQuestionIndex}</div>
                    <div className="q-text">{currentQuestion.questionText}</div>
                  </S.QuestionBox>
                </S.ContentCard>
              </S.LeftColumn>

              <S.RightColumn>
                <SpeakingController 
                  prepTime={0} // Không có thời gian chuẩn bị
                  recordingTime={30} // Ghi âm 30 giây
                  statusColor="#0284c7"
                  title={`p1-q${currentQuestionIndex}`}
                  onCompleted={handleRecordComplete}
                />
                {/* Collapsible Sample Answer */}
                {currentQuestion.sampleAnswers.length > 0 && (
                <S.CollapsibleWrapper>
                  <S.CollapsibleHeader onClick={() => setShowSampleAnswer(!showSampleAnswer)}>
                    <span>
                      <UnlockOutlined style={{ marginRight: '8px', color: '#0284c7' }} /> 
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
                                background: activeSampleIdx === sIdx ? '#0284c7' : undefined,
                                borderColor: activeSampleIdx === sIdx ? '#0284c7' : undefined,
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
                    background: '#2563eb',
                    borderColor: '#2563eb',
                    padding: '0 1.5rem',
                    boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
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
