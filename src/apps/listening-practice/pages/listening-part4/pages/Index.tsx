import React from 'react';
import { Space, Progress, Button, Select } from 'antd';
import { 
  LeftOutlined, 
  RightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import * as S from '../styles/styled';
import * as HomeS from '../../../../home/pages/styled';
import { Sidebar } from '../../../../home/components/Sidebar';
import { AudioPlayer } from '../../../components/AudioPlayer';
import { usePart4Action } from '../hook/usePart4Action';
import { mockGroups } from '../services/data';

export const Part4Page: React.FC = () => {
  const {
    timeLeft,
    showTranscript,
    setShowTranscript,
    activeQuestion,
    setActiveQuestion,
    answers,
    handleSelectAnswer,
    handleNext,
    handleBack,
    handleSubmit,
    answeredCount,
    progressPercent,
    currentGroup,
    formatTime
  } = usePart4Action();

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
                Part 4: Questions 16 - 17
              </span>
            </Space>

            <Space size="large" style={{ display: 'flex', alignItems: 'center' }}>
              <Progress
                type="circle"
                percent={progressPercent}
                size={40}
                strokeColor="#10b981"
                trailColor="rgba(255,255,255,0.2)"
                format={() => <span style={{ color: 'white', fontSize: '11px', fontWeight: 'bold' }}>{answeredCount}/4</span>}
              />
              <S.TimerWrapper>
                <ClockCircleOutlined style={{ color: '#fbbf24', marginRight: '4px' }} />
                {formatTime(timeLeft)}
              </S.TimerWrapper>
            </Space>
          </S.Header>

          <S.MainContent>
            <S.ContentCard>
              <S.TitleArea>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h2>{currentGroup.title}</h2>
                    <div className="subtitle">
                      Part 4 • Question {activeQuestion === 16 ? '16' : '17'} of 17
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Chọn câu:</span>
                    <Select
                      value={activeQuestion}
                      onChange={(val) => {
                        setActiveQuestion(val as number);
                        setShowTranscript(false);
                      }}
                      style={{ width: 150 }}
                      options={mockGroups.map((g) => {
                        const sub1 = g.subQuestions[0].id;
                        const sub2 = g.subQuestions[1].id;
                        const isAnswered = !!answers[sub1] && !!answers[sub2];
                        return {
                          value: g.id,
                          label: `Câu ${g.id}`,
                          labelNode: (
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                              <span>Câu {g.id}</span>
                              {isAnswered ? <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> : <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>Chưa làm</span>}
                            </div>
                          )
                        };
                      })}
                      optionRender={(option) => (option.data as any).labelNode}
                    />
                  </div>
                </div>
              </S.TitleArea>

              <AudioPlayer />

              <S.InstructionText>
                {currentGroup.instruction}
              </S.InstructionText>

              {currentGroup.subQuestions.map((subQ) => (
                <S.QuestionBlock key={subQ.id}>
                  <S.QuestionTitle>{subQ.title}</S.QuestionTitle>
                  {subQ.options.map((option, idx) => {
                    const letter = String.fromCharCode(65 + idx);
                    const isSelected = answers[subQ.id] === option;
                    return (
                      <S.OptionCard
                        key={idx}
                        $selected={isSelected}
                        onClick={() => handleSelectAnswer(subQ.id, option)}
                      >
                        <div className="option-letter">{letter}</div>
                        <div className="option-text">{option}</div>
                      </S.OptionCard>
                    );
                  })}
                </S.QuestionBlock>
              ))}

              <S.TranscriptButtonWrapper>
                <Button 
                  icon={<FileTextOutlined />} 
                  onClick={() => setShowTranscript(!showTranscript)}
                >
                  {showTranscript ? 'Ẩn Transcript' : 'Hiện Transcript'}
                </Button>
              </S.TranscriptButtonWrapper>

              {showTranscript && (
                <S.TranscriptBox>
                  {currentGroup.transcript}
                </S.TranscriptBox>
              )}

            </S.ContentCard>
          </S.MainContent>

          <S.Footer>
            <Button
              type="default"
              icon={<LeftOutlined />}
              size="large"
              style={{ borderRadius: '2rem', fontWeight: 600, padding: '0 1.5rem', border: '1px solid #e2e8f0', color: '#64748b' }}
              onClick={handleBack}
            >
              {activeQuestion === 16 ? 'Quay lại (Part 3)' : 'Quay lại Câu 16'}
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
                {activeQuestion === 16 ? 'Câu tiếp theo (Câu 17)' : 'Hoàn thành & Nộp bài'} <RightOutlined style={{ fontSize: '12px' }} />
              </Button>
            </Space>
          </S.Footer>
        </S.PageContainer>
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default Part4Page;
