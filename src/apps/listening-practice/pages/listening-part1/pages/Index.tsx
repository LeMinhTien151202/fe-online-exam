import React from 'react';
import { Space, Progress, Button, Select } from 'antd';
import { ExamLoading, ExamEmpty } from '@/shared/components/ExamState';
import {
  LeftOutlined,
  RightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import * as S from '../styles/styled';
import * as HomeS from '../../../../home/pages/styled';
import { Sidebar } from '../../../../home/components/Sidebar';
import { AudioPlayer } from '../../../components/AudioPlayer';
import { usePart1Action } from '../hook/usePart1Action';

export const Part1Page: React.FC = () => {
  const {
    isLoading,
    hasData,
    hasNext,
    total,
    timeLeft,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    handleSelectAnswer,
    handleNext,
    handleBack,
    handleSubmit,
    answeredCount,
    progressPercent,
    currentQuestion,
    mockQuestions,
    formatTime
  } = usePart1Action();

  return (
    <HomeS.MainLayout>
      <Sidebar />
      <HomeS.RightColumn>
        <S.PageContainer>
          <S.Header>
            <Space size="middle">
              <S.BackLink to="/listening">
                <LeftOutlined /> Quay lại
              </S.BackLink>
              <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white' }}>
                Part 1: Information Recognition
              </span>
            </Space>

            <Space size="large" style={{ display: 'flex', alignItems: 'center' }}>
              <Progress
                type="circle"
                percent={progressPercent}
                size={40}
                strokeColor="#10b981"
                trailColor="rgba(255,255,255,0.2)"
                format={() => <span style={{ color: 'white', fontSize: '11px', fontWeight: 'bold' }}>{answeredCount}/{total || 0}</span>}
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
            <S.ContentCard>
              <S.TitleArea>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h2>Listening</h2>
                    <div className="subtitle">
                      Part 1 • Question {currentQuestionIndex} of {total}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Chọn câu:</span>
                    <Select
                      value={currentQuestionIndex}
                      onChange={(val) => setCurrentQuestionIndex(val as number)}
                      style={{ width: 150 }}
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

              <AudioPlayer src={currentQuestion.mediaUrl} />

              <S.InstructionText>
                {currentQuestion.questionText}
              </S.InstructionText>

              <div style={{ marginTop: '1.5rem' }}>
                {currentQuestion.options.map((option, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isSelected = answers[currentQuestionIndex] === option;
                  return (
                    <S.OptionCard
                      key={idx}
                      onClick={() => handleSelectAnswer(option)}
                      style={{
                        borderColor: isSelected ? '#3b5b8c' : '#e2e8f0',
                        background: isSelected ? '#eff6ff' : '#ffffff'
                      }}
                    >
                      <div className="option-letter" style={{ color: isSelected ? '#3b5b8c' : '#0f172a' }}>{letter}</div>
                      <div className="option-text" style={{ color: isSelected ? '#1a365d' : '#334155', fontWeight: isSelected ? '700' : '500' }}>{option}</div>
                    </S.OptionCard>
                  );
                })}
              </div>
            </S.ContentCard>
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
              {currentQuestionIndex === 1 ? 'Danh sách' : 'Câu trước'}
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

export default Part1Page;
