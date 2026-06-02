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
import { usePart2Action } from '../hook/usePart2Action';
import { options, transcriptText } from '../services/data';

export const Part2Page: React.FC = () => {
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
                Part 2: Question 14
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
                <h2>Listening To Music</h2>
                <div className="subtitle">
                  Part 2 • Question 1 of 14
                </div>
              </S.TitleArea>

              <AudioPlayer />

              <S.InstructionText>
                Four people are talking about music habits. Complete the sentences below.
              </S.InstructionText>

              <div style={{ marginTop: '2rem' }}>
                {['Person 1', 'Person 2', 'Person 3', 'Person 4'].map((person, index) => (
                  <S.PersonRow key={index}>
                    <div className="person-label">{person}</div>
                    <div className="person-select">
                      <S.StyledSelect
                        placeholder="Select option"
                        onChange={(val) => handleSelectChange(person, val as string)}
                        value={answers[person]}
                        $hasValue={!!answers[person]}
                        options={options}
                      />
                    </div>
                  </S.PersonRow>
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
              onClick={() => navigate({ to: '/listening/part/1' })}
            >
              Quay lại (Part 1)
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
                onClick={() => navigate({ to: '/listening/part/3' })}
              >
                Tiếp theo (Part 3) <RightOutlined style={{ fontSize: '12px' }} />
              </Button>
            </Space>
          </S.Footer>
        </S.PageContainer>
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default Part2Page;
