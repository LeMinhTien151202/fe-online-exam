import React, { useState, useEffect } from 'react';
import { Space, Progress, Button, Select, message } from 'antd';
import { useNavigate } from '@tanstack/react-router';
import { 
  LeftOutlined, 
  RightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import * as S from './styled';
import * as HomeS from '../../../../home/pages/styled';
import { Sidebar } from '../../../../home/components/Sidebar';
import { AudioPlayer } from '../../../components/AudioPlayer';

export const Part2Page: React.FC = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(19 * 60 + 58); // 19:58 mock
  const [showTranscript, setShowTranscript] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectChange = (person: string, value: string) => {
    setAnswers(prev => ({ ...prev, [person]: value }));
  };

  const handleSubmit = () => {
    message.success('Đã nộp bài Part 2!');
    navigate({ to: '/listening/part/3' });
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / 4) * 100;

  const options = [
    { value: 'option1', label: 'listens to music while working' },
    { value: 'option2', label: 'prefers classical music' },
    { value: 'option3', label: 'attends live concerts frequently' },
    { value: 'option4', label: 'plays an instrument' },
    { value: 'option5', label: 'dislikes modern pop music' }
  ];

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
                <S.TranscriptBox>
                  <strong>Person 1:</strong> I usually put on some jazz or classical music when I'm at my desk. It helps me focus on the tasks.<br /><br />
                  <strong>Person 2:</strong> To be honest, I can't stand the popular songs they play on the radio these days. I much prefer older genres.
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
