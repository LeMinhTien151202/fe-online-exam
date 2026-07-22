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
import { QuestionBoard } from '@/shared/components/QuestionBoard';
import { usePart3Action, SPEAKER_OPTIONS } from '../hook/usePart3Action';

export const Part3Page: React.FC = () => {
  const {
    isLoading,
    hasData,
    setCount,
    currentSetNumber,
    hasNext,
    hasPrev,
    handleNext,
    handlePrev,
    timeLeft,
    currentSet,
    totalStatements,
    getAnswer,
    handleSelectChange,
    handleSubmit,
    answeredCount,
    progressPercent,
    formatTime,
    boardItems,
    activeSetIndex,
    goTo
  } = usePart3Action();

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
                Part 3: Opinion Matching
              </span>
              {setCount > 1 && (
                <Tag color="blue" style={{ fontWeight: 600 }}>Bài {currentSetNumber}/{setCount}</Tag>
              )}
            </Space>

            <Space size="large" style={{ display: 'flex', alignItems: 'center' }}>
              <Progress
                type="circle"
                percent={progressPercent}
                size={40}
                strokeColor="#10b981"
                trailColor="rgba(255,255,255,0.2)"
                format={() => <span style={{ color: 'white', fontSize: '11px', fontWeight: 'bold' }}>{answeredCount}/{totalStatements || 0}</span>}
              />
              <S.TimerWrapper>
                <ClockCircleOutlined style={{ color: '#fbbf24', marginRight: '4px' }} />
                {formatTime(timeLeft)}
              </S.TimerWrapper>
            </Space>
          </S.Header>

          <S.MainContent $hasBoard={hasData && setCount > 1}>
            {isLoading ? (
              <ExamLoading />
            ) : !hasData ? (
              <div style={{ padding: '3rem', width: '100%' }}>
                <ExamEmpty />
              </div>
            ) : (
            <S.ContentCard>
              <S.TitleArea>
                <h2>Opinion Matching</h2>
                <div className="subtitle">
                  Part 3 • {totalStatements} nhận định
                </div>
              </S.TitleArea>

              <AudioPlayer src={currentSet.mediaUrl} />

              <S.InstructionText>
                {currentSet.instruction}
              </S.InstructionText>

              <div style={{ marginTop: '1.5rem' }}>
                {currentSet.statements.map((statement) => (
                  <S.StatementRow key={statement.id}>
                    <div className="statement-number">{statement.id}.</div>
                    <div className="statement-text">{statement.text}</div>
                    <S.StyledSelect
                      placeholder="Chọn"
                      onChange={(val) => handleSelectChange(statement.id, val as string)}
                      value={getAnswer(statement.id)}
                      $hasValue={!!getAnswer(statement.id)}
                      options={SPEAKER_OPTIONS}
                    />
                  </S.StatementRow>
                ))}
              </div>
            </S.ContentCard>
            )}
            {hasData && setCount > 1 && (
              <QuestionBoard
                items={boardItems}
                activeKey={activeSetIndex}
                onJump={goTo}
                sectionLabel="Danh sách bài"
                showPartial
                answeredLabel="Đã trả lời đủ"
              />
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

export default Part3Page;
