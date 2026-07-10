import React from 'react';
import { Space, Progress, Button, Tag } from 'antd';
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
import { usePart4Action } from '../hook/usePart4Action';

export const Part4Page: React.FC = () => {
  const {
    isLoading,
    hasData,
    groupCount,
    currentGroupNumber,
    hasNext,
    hasPrev,
    handleNext,
    handlePrev,
    timeLeft,
    answers,
    handleSelectAnswer,
    handleSubmit,
    answeredCount,
    totalSub,
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
                Part 4: Monologue
              </span>
              {groupCount > 1 && (
                <Tag color="blue" style={{ fontWeight: 600 }}>Bài {currentGroupNumber}/{groupCount}</Tag>
              )}
            </Space>

            <Space size="large" style={{ display: 'flex', alignItems: 'center' }}>
              <Progress
                type="circle"
                percent={progressPercent}
                size={40}
                strokeColor="#10b981"
                trailColor="rgba(255,255,255,0.2)"
                format={() => <span style={{ color: 'white', fontSize: '11px', fontWeight: 'bold' }}>{answeredCount}/{totalSub || 0}</span>}
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
                <div>
                  <h2>{currentGroup.title}</h2>
                  <div className="subtitle">
                    Part 4 • {totalSub} câu hỏi
                  </div>
                </div>
              </S.TitleArea>

              <AudioPlayer src={currentGroup.mediaUrl} />

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
            </S.ContentCard>
            )}
          </S.MainContent>

          <S.Footer>
            <Button
              type="default"
              icon={<LeftOutlined />}
              size="large"
              style={{ borderRadius: '2rem', fontWeight: 600, padding: '0 1.5rem', border: '1px solid #e2e8f0', color: '#64748b' }}
              onClick={handlePrev}
            >
              {hasPrev ? 'Bài trước' : 'Danh sách'}
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
                  Bài tiếp theo <RightOutlined style={{ fontSize: '12px' }} />
                </Button>
              )}
            </Space>
          </S.Footer>
        </S.PageContainer>
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default Part4Page;
