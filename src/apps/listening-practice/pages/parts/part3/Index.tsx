import React, { useState, useEffect } from 'react';
import { Space, Progress, Button, message } from 'antd';
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

export const Part3Page: React.FC = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(19 * 60 + 58); // 19:58 mock
  const [showTranscript, setShowTranscript] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});

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

  const handleSelectChange = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    message.success('Đã nộp bài Part 3!');
    navigate({ to: '/listening/part/4' });
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / 4) * 100;

  const speakerOptions = [
    { value: 'man', label: 'Man' },
    { value: 'woman', label: 'Woman' },
    { value: 'both', label: 'Both' }
  ];

  const statements = [
    { id: 1, text: 'Exhibitions should be different and diverse' },
    { id: 2, text: 'Traditional customs are gradually losing their significance' },
    { id: 3, text: 'Local festivals will disappear in the near future' },
    { id: 4, text: 'Schools are important in shaping future generations' }
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
                <S.TranscriptBox>
                  <strong>Man:</strong> Have you been to the new local center yet? They have some interesting exhibitions.<br /><br />
                  <strong>Woman:</strong> Yes, I went yesterday. I agree the exhibitions are diverse, but I feel traditional customs are slowly fading away.<br /><br />
                  <strong>Man:</strong> That's true. Sometimes I worry local festivals might disappear soon if we don't act.<br /><br />
                  <strong>Woman:</strong> Absolutely. And that's why schools are so critical in educating the younger generations.
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
