import React from 'react';
import { Space, Progress, Button, Select, Tag } from 'antd';
import { ExamLoading, ExamEmpty } from '@/shared/components/ExamState';
import {
  LeftOutlined,
  RightOutlined,
  CheckCircleOutlined,
  RollbackOutlined
} from '@ant-design/icons';
import * as S from '../styles/styled';
import * as HomeS from '../../../../home/pages/styled';
import { Sidebar } from '../../../../home/components/Sidebar';
import { AudioPlayer } from '../../../components/AudioPlayer';
import { QuestionBoard, type BoardStatus } from '@/shared/components/QuestionBoard';
import { usePart1Action } from '../hook/usePart1Action';

export const Part1Page: React.FC = () => {
  const {
    isLoading,
    hasData,
    hasNext,
    total,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    results,
    isSubmitted,
    isGrading,
    correctCount,
    correctIndex,
    scoreTotal,
    handleSelectAnswer,
    handleNext,
    handleBack,
    handleSubmit,
    handleRetry,
    gradedCount,
    progressPercent,
    currentQuestion,
    mockQuestions
  } = usePart1Action();

  // Sau khi chấm: tô xanh đáp án đúng, tô đỏ đáp án đã chọn nhưng sai.
  const optionColors = (option: string, idx: number) => {
    const isSelected = answers[currentQuestionIndex] === option;
    if (!isSubmitted) {
      return {
        border: isSelected ? '#3b5b8c' : '#e2e8f0',
        background: isSelected ? '#eff6ff' : '#ffffff',
        letter: isSelected ? '#3b5b8c' : '#0f172a',
        text: isSelected ? '#1a365d' : '#334155',
      };
    }
    const isCorrect = correctIndex >= 0 && correctIndex === idx;
    const isWrongPick = isSelected && correctCount === 0;
    if (isCorrect) return { border: '#10b981', background: '#ecfdf5', letter: '#047857', text: '#065f46' };
    if (isWrongPick) return { border: '#ef4444', background: '#fef2f2', letter: '#b91c1c', text: '#991b1b' };
    if (isSelected) return { border: '#10b981', background: '#ecfdf5', letter: '#047857', text: '#065f46' };
    return { border: '#e2e8f0', background: '#ffffff', letter: '#94a3b8', text: '#94a3b8' };
  };

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
              {isSubmitted && (
                <Tag color={correctCount > 0 ? 'success' : 'error'} style={{ fontWeight: 600 }}>
                  Kết quả: {correctCount}/{scoreTotal}
                </Tag>
              )}
            </Space>

            <Space size="large" style={{ display: 'flex', alignItems: 'center' }}>
              <Progress
                type="circle"
                percent={progressPercent}
                size={40}
                strokeColor="#10b981"
                trailColor="rgba(255,255,255,0.2)"
                format={() => <span style={{ color: 'white', fontSize: '11px', fontWeight: 'bold' }}>{gradedCount}/{total || 0}</span>}
              />
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
                            {results[q.id] ? <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓ Đã chấm</span>
                              : answers[q.id] ? <span style={{ color: '#f59e0b', fontSize: '0.8rem' }}>Đang làm</span>
                              : <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>Chưa làm</span>}
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
                  const colors = optionColors(option, idx);
                  return (
                    <S.OptionCard
                      key={idx}
                      onClick={() => handleSelectAnswer(option)}
                      style={{
                        borderColor: colors.border,
                        background: colors.background,
                        cursor: isSubmitted ? 'default' : 'pointer'
                      }}
                    >
                      <div className="option-letter" style={{ color: colors.letter }}>{letter}</div>
                      <div className="option-text" style={{ color: colors.text, fontWeight: answers[currentQuestionIndex] === option ? '700' : '500' }}>{option}</div>
                    </S.OptionCard>
                  );
                })}
              </div>
            </S.ContentCard>
            )}
            {hasData && mockQuestions.length > 1 && (
              <QuestionBoard
                items={mockQuestions.map((q) => ({
                  key: q.id,
                  label: q.id,
                  status: (results[q.id] ? 'answered' : answers[q.id] ? 'partial' : 'unanswered') as BoardStatus,
                }))}
                activeKey={currentQuestionIndex}
                onJump={setCurrentQuestionIndex}
                showPartial
                answeredLabel="Đã chấm"
                partialLabel="Đang làm"
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
              {currentQuestionIndex === 1 ? 'Danh sách' : 'Câu trước'}
            </Button>

            <Space size="middle">
              {isSubmitted ? (
                <Button
                  type="primary"
                  icon={<RollbackOutlined />}
                  size="large"
                  style={{
                    borderRadius: '2rem',
                    fontWeight: 600,
                    background: '#f59e0b',
                    borderColor: '#f59e0b',
                    padding: '0 2rem'
                  }}
                  onClick={handleRetry}
                >
                  Làm lại
                </Button>
              ) : (
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  size="large"
                  loading={isGrading}
                  disabled={!hasData}
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
                  Nộp câu này
                </Button>
              )}
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
