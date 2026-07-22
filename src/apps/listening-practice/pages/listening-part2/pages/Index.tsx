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
import { usePart2Action } from '../hook/usePart2Action';

export const Part2Page: React.FC = () => {
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
    getAnswer,
    handleSelectChange,
    handleSubmit,
    answeredCount,
    progressPercent,
    formatTime,
    boardItems,
    activeSetIndex,
    goTo
  } = usePart2Action();

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
                Part 2: Information Matching
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
                format={() => <span style={{ color: 'white', fontSize: '11px', fontWeight: 'bold' }}>{answeredCount}/{currentSet.speakerCount || 0}</span>}
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
                <h2>Information Matching</h2>
                <div className="subtitle">
                  Part 2 • {currentSet.speakerCount} người
                </div>
              </S.TitleArea>

              <AudioPlayer src={currentSet.mediaUrl} />

              <S.InstructionText>
                {currentSet.instruction}
              </S.InstructionText>

              <div style={{ marginTop: '2rem' }}>
                {Array.from({ length: currentSet.speakerCount }, (_, i) => {
                  const speaker = i + 1;
                  return (
                    <S.PersonRow key={speaker}>
                      <div className="person-label">Người {speaker}</div>
                      <div className="person-select">
                        <S.StyledSelect
                          placeholder="Chọn đáp án"
                          onChange={(val) => handleSelectChange(speaker, val as string)}
                          value={getAnswer(speaker)}
                          $hasValue={!!getAnswer(speaker)}
                          options={currentSet.options}
                        />
                      </div>
                    </S.PersonRow>
                  );
                })}
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

export default Part2Page;
