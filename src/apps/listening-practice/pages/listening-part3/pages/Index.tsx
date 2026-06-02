import React from 'react';
import { Space, Progress, Button } from 'antd';
import { useNavigate } from '@tanstack/react-router';
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
import { usePart3Action } from '../hook/usePart3Action';
import { speakerOptions, statements, transcriptText } from '../services/data';

export const Part3Page: React.FC = () => {
  const navigate = useNavigate();
  const {
    timeLeft,
    showTranscript,
    setShowTranscript,
    answers,
    handleSelectChange,
    handleSubmit,
    answeredCount,
    progressPercent,
    formatTime
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
                Part 3: Question 15
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
                <h2>The Local Central</h2>
                <div className="subtitle">
                  Part 3 • Question 1 of 12
                </div>
              </S.TitleArea>

              <AudioPlayer />

              <S.InstructionText>
                A man and a woman are talking about the local center that was recently opened. Read the opinions below and decide whose opinion matches the statements: the man, the woman, or both the man and the woman. You can listen to the discussion twice.
              </S.InstructionText>

              <div style={{ marginTop: '1.5rem' }}>
                {statements.map((statement) => (
                  <S.StatementRow key={statement.id}>
                    <div className="statement-number">{statement.id}.</div>
                    <div className="statement-text">{statement.text}</div>
                    <S.StyledSelect
                      placeholder="Select"
                      onChange={(val) => handleSelectChange(statement.id, val as string)}
                      value={answers[statement.id]}
                      $hasValue={!!answers[statement.id]}
                      options={speakerOptions}
                    />
                  </S.StatementRow>
                ))}
              </div>

              <S.TranscriptButtonWrapper>
                <Button 
                  icon={<FileTextOutlined />} 
                  onClick={() => setShowTranscript(!showTranscript)}
                >
                  {showTranscript ? 'Ẩn Transcript' : 'Hiện Transcript'}
                </Button>
              </S.TranscriptButtonWrapper>

              {showTranscript && (
                <S.TranscriptBox dangerouslySetInnerHTML={{ __html: transcriptText }} />
              )}

            </S.ContentCard>
          </S.MainContent>

          <S.Footer>
            <Button
              type="default"
              icon={<LeftOutlined />}
              size="large"
              style={{ borderRadius: '2rem', fontWeight: 600, padding: '0 1.5rem', border: '1px solid #e2e8f0', color: '#64748b' }}
              onClick={() => navigate({ to: '/listening/part/2' })}
            >
              Quay lại (Part 2)
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
                onClick={() => navigate({ to: '/listening/part/4' })}
              >
                Tiếp theo (Part 4) <RightOutlined style={{ fontSize: '12px' }} />
              </Button>
            </Space>
          </S.Footer>
        </S.PageContainer>
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default Part3Page;
