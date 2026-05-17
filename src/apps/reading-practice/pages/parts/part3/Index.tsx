import React from 'react';
import { Radio, Button, Typography, Space, Progress, Badge, message } from 'antd';
import { ClockCircleOutlined, LeftOutlined, CheckCircleOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import * as S from './styled';

const { Title, Text, Paragraph } = Typography;

export const Part3Page: React.FC = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = React.useState(900); // 15 phút
  const [answers, setAnswers] = React.useState<Record<number, string>>({});

  // Countdown timer logic
  React.useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRadioChange = (questionId: number, val: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: val
    }));
  };

  const handleSubmit = () => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < 7) {
      message.warning(`Bạn đã trả lời ${answeredCount}/7 ý kiến. Vui lòng chọn đáp án cho tất cả các câu!`);
      return;
    }
    message.success('Chúc mừng! Bạn đã hoàn thành xuất sắc Part 3.');
    navigate({ to: '/reading/part/4' });
  };

  const opinions = [
    {
      id: 'A',
      name: 'A - Boyd',
      color: '#3b82f6',
      text: 'I think online shopping is the future. It is incredibly convenient, saves hours of driving, and lets you compare prices instantly from multiple stores. However, the lack of tactile feel means sometimes products do not match the photos online.'
    },
    {
      id: 'B',
      name: 'B - Emilia',
      color: '#10b981',
      text: 'I still prefer traditional retail stores. Shopping should be a social activity with friends. You get to touch the fabrics, try on clothes, and speak to helpful staff directly. Online shopping feels lonely and creates too much plastic packaging waste.'
    },
    {
      id: 'C',
      name: 'C - Liam',
      color: '#f59e0b',
      text: 'I am concerned about online security and data privacy. Every time you purchase something online, your personal information is stored on servers. Hackers can steal your credit card details. Plus, wait times for delivery can be highly frustrating.'
    },
    {
      id: 'D',
      name: 'D - Sofia',
      color: '#8b5cf6',
      text: 'Hybrid shopping is the best way. I browse products in physical retail showrooms to test their size and comfort, then buy them online at a lower price. This gives me the best of both worlds, although returning products can still be tedious.'
    }
  ];

  const questions = [
    { id: 1, text: 'Which person values shopping as a social event with friends?' },
    { id: 2, text: 'Which person mentions the convenience and instant price comparison of e-commerce?' },
    { id: 3, text: 'Which person expresses concern about servers storing private customer information?' },
    { id: 4, text: 'Which person recommends looking at products in stores first before ordering online?' },
    { id: 5, text: 'Which person worries about the environmental impact of shipping packages?' },
    { id: 6, text: 'Which person dislikes waiting for packages to arrive at their house?' },
    { id: 7, text: 'Which person notices that products sometimes differ from their online descriptions?' }
  ];

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / 7) * 100);

  return (
    <HomeS.MainLayout>
      <Sidebar />
      <HomeS.RightColumn>
        <S.PageContainer>
          <S.Header>
            <Space size="large">
              <S.BackLink to="/reading">
                <LeftOutlined /> Quay lại
              </S.BackLink>
              <Title level={4} style={{ color: 'white', margin: 0 }}>Part 3: Opinion Matching</Title>
            </Space>
            
            <Space size="large" style={{ display: 'flex', alignItems: 'center' }}>
              <Progress 
                type="circle" 
                percent={progressPercent} 
                size={40} 
                strokeColor="#10b981" 
                trailColor="rgba(255,255,255,0.2)"
                format={() => <span style={{ color: 'white', fontSize: '11px', fontWeight: 'bold' }}>{answeredCount}/7</span>}
              />
              <S.TimerWrapper>
                <ClockCircleOutlined style={{ color: '#fbbf24', marginRight: '4px' }} />
                {formatTime(timeLeft)}
              </S.TimerWrapper>
            </Space>
          </S.Header>

          <S.MainContent>
            <S.Column>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <Badge status="processing" text={<Text strong style={{ color: '#0f172a' }}>Ý KIẾN CỦA 4 NGƯỜI (A, B, C, D)</Text>} />
              </div>

              {opinions.map(person => (
                <S.PersonCard key={person.id}>
                  <S.PersonHeader>
                    <S.PersonAvatar $color={person.color}>{person.id}</S.PersonAvatar>
                    <Text strong style={{ fontSize: '1.05rem', color: '#1e293b' }}>{person.name}</Text>
                  </S.PersonHeader>
                  <Paragraph style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6, color: '#475569' }}>
                    {person.text}
                  </Paragraph>
                </S.PersonCard>
              ))}
            </S.Column>

            <S.Column>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <Text strong style={{ color: '#0f172a' }}>CÁC PHÁT BIỂU ĐƯỢC ĐƯA RA (7 CÂU)</Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>{answeredCount}/7 Đã chọn</Text>
              </div>

              {questions.map((q, idx) => {
                const isAnswered = !!answers[q.id];
                return (
                  <S.StatementCard key={q.id} $isAnswered={isAnswered}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <Badge 
                        count={idx + 1} 
                        style={{ 
                          backgroundColor: isAnswered ? '#2563eb' : '#94a3b8', 
                          color: 'white', 
                          fontWeight: 'bold' 
                        }} 
                      />
                      <div style={{ flex: 1 }}>
                        <Text strong style={{ fontSize: '1rem', color: '#1e293b', display: 'block', marginBottom: '0.5rem' }}>
                          {q.text}
                        </Text>
                        <S.StyledRadioGroup 
                          optionType="button" 
                          buttonStyle="solid"
                          value={answers[q.id]}
                          onChange={(e) => handleRadioChange(q.id, e.target.value as string)}
                        >
                          <Radio.Button value="A">A</Radio.Button>
                          <Radio.Button value="B">B</Radio.Button>
                          <Radio.Button value="C">C</Radio.Button>
                          <Radio.Button value="D">D</Radio.Button>
                        </S.StyledRadioGroup>
                      </div>
                    </div>
                  </S.StatementCard>
                );
              })}
            </S.Column>
          </S.MainContent>

          <S.Footer>
            <Button 
              type="default" 
              icon={<LeftOutlined />} 
              size="large"
              style={{ borderRadius: '2rem', fontWeight: 600, padding: '0 1.5rem', border: '1px solid #e2e8f0', color: '#64748b' }}
              onClick={() => navigate({ to: '/reading/part/2' })}
            >
              Trở lại Part 2
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
                onClick={() => navigate({ to: '/reading/part/4' })}
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
