import React from 'react';
import { Select, Button, Space, Progress, message } from 'antd';
import { useNavigate } from '@tanstack/react-router';
import {
  LeftOutlined,
  RightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  BulbOutlined
} from '@ant-design/icons';
import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import * as S from './styled';

export const Part1Page: React.FC = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = React.useState(598); // 09:58 -> 598 giây
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

  const handleSelectChange = (questionId: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = () => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < 5) {
      message.warning(`Bạn mới trả lời ${answeredCount}/5 câu hỏi. Hãy hoàn thành tất cả nhé!`);
      return;
    }
    message.success('Chúc mừng! Bạn đã nộp bài thành công Part 1.');
    navigate({ to: '/reading/part/2' });
  };

  const questions = [
    {
      id: 1,
      options: ['effective', 'affected', 'efficient']
    },
    {
      id: 2,
      options: ['maximum', 'total', 'limit']
    },
    {
      id: 3,
      options: ['extended', 'increased', 'reduced']
    },
    {
      id: 4,
      options: ['fine', 'fee', 'charge']
    },
    {
      id: 5,
      options: ['renew', 'return', 'reserve']
    }
  ];

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / 5) * 100);

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
              <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white' }}>
                Part 1: Sentence Comprehension
              </span>
            </Space>

            <Space size="large" style={{ display: 'flex', alignItems: 'center' }}>
              <Progress
                type="circle"
                percent={progressPercent}
                size={40}
                strokeColor="#10b981"
                trailColor="rgba(255,255,255,0.2)"
                format={() => <span style={{ color: 'white', fontSize: '11px', fontWeight: 'bold' }}>{answeredCount}/5</span>}
              />
              <S.TimerWrapper>
                <ClockCircleOutlined style={{ color: '#fbbf24', marginRight: '4px' }} />
                {formatTime(timeLeft)}
              </S.TimerWrapper>
            </Space>
          </S.Header>

          <S.MainContent>
            <S.ContentCard>
              {/* Title, Subtitle, and Tip styled via styled-components */}
              <S.TitleArea>
                <h2>Complete the sentences</h2>
                <div className="subtitle">
                  Select the correct word from the dropdown to complete each sentence.
                </div>
                <S.TipBox>
                  💡 Tip: Double-click vào từ tiếng Anh bất kỳ để tra nghĩa
                </S.TipBox>
              </S.TitleArea>

              {/* Sentences list as rows within the block */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <S.QuestionRow>
                  <S.BadgeNumber>1</S.BadgeNumber>
                  <S.QuestionText>
                    The new policies will be{' '}
                    <S.InlineSentenceSelect
                      placeholder="Select option"
                      onChange={(val) => handleSelectChange(1, val as string)}
                      value={answers[1]}
                      dropdownMatchSelectWidth={false}
                      $hasValue={!!answers[1]}
                    >
                      {questions[0].options.map(opt => (
                        <Select.Option key={opt} value={opt}>{opt}</Select.Option>
                      ))}
                    </S.InlineSentenceSelect>{' '}
                    starting next semester.
                  </S.QuestionText>
                </S.QuestionRow>

                <S.QuestionRow>
                  <S.BadgeNumber>2</S.BadgeNumber>
                  <S.QuestionText>
                    Students can now borrow a{' '}
                    <S.InlineSentenceSelect
                      placeholder="Select option"
                      onChange={(val) => handleSelectChange(2, val as string)}
                      value={answers[2]}
                      dropdownMatchSelectWidth={false}
                      $hasValue={!!answers[2]}
                    >
                      {questions[1].options.map(opt => (
                        <Select.Option key={opt} value={opt}>{opt}</Select.Option>
                      ))}
                    </S.InlineSentenceSelect>{' '}
                    of ten books at a time.
                  </S.QuestionText>
                </S.QuestionRow>

                <S.QuestionRow>
                  <S.BadgeNumber>3</S.BadgeNumber>
                  <S.QuestionText>
                    The lending period has been{' '}
                    <S.InlineSentenceSelect
                      placeholder="Select option"
                      onChange={(val) => handleSelectChange(3, val as string)}
                      value={answers[3]}
                      dropdownMatchSelectWidth={false}
                      $hasValue={!!answers[3]}
                    >
                      {questions[2].options.map(opt => (
                        <Select.Option key={opt} value={opt}>{opt}</Select.Option>
                      ))}
                    </S.InlineSentenceSelect>{' '}
                    to three weeks.
                  </S.QuestionText>
                </S.QuestionRow>

                <S.QuestionRow>
                  <S.BadgeNumber>4</S.BadgeNumber>
                  <S.QuestionText>
                    There will be a slight increase in the{' '}
                    <S.InlineSentenceSelect
                      placeholder="Select option"
                      onChange={(val) => handleSelectChange(4, val as string)}
                      value={answers[4]}
                      dropdownMatchSelectWidth={false}
                      $hasValue={!!answers[4]}
                    >
                      {questions[3].options.map(opt => (
                        <Select.Option key={opt} value={opt}>{opt}</Select.Option>
                      ))}
                    </S.InlineSentenceSelect>{' '}
                    for returning books late.
                  </S.QuestionText>
                </S.QuestionRow>

                <S.QuestionRow>
                  <S.BadgeNumber>5</S.BadgeNumber>
                  <S.QuestionText>
                    Students are encouraged to{' '}
                    <S.InlineSentenceSelect
                      placeholder="Select option"
                      onChange={(val) => handleSelectChange(5, val as string)}
                      value={answers[5]}
                      dropdownMatchSelectWidth={false}
                      $hasValue={!!answers[5]}
                    >
                      {questions[4].options.map(opt => (
                        <Select.Option key={opt} value={opt}>{opt}</Select.Option>
                      ))}
                    </S.InlineSentenceSelect>{' '}
                    their items online.
                  </S.QuestionText>
                </S.QuestionRow>
              </div>
            </S.ContentCard>

            <S.AdminExperienceCard style={{ marginTop: '0.5rem' }}>
              <div className="info-left">
                <div className="icon-bulb">
                  <BulbOutlined />
                </div>
                <div className="text-content">
                  <div className="title">Kinh nghiệm của Admin cho Part 1</div>
                  <div className="subtitle">Sentence Comprehension</div>
                </div>
              </div>
              <button className="btn-show">Show</button>
            </S.AdminExperienceCard>
          </S.MainContent>

          <S.Footer>
            <Button
              type="default"
              icon={<LeftOutlined />}
              size="large"
              style={{ borderRadius: '2rem', fontWeight: 600, padding: '0 1.5rem', border: '1px solid #e2e8f0', color: '#64748b' }}
              onClick={() => navigate({ to: '/reading' })}
            >
              Trở lại Bảng điều khiển
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
                onClick={() => navigate({ to: '/reading/part/2' })}
              >
                Tiếp theo (Part 2) <RightOutlined style={{ fontSize: '12px' }} />
              </Button>
            </Space>
          </S.Footer>
        </S.PageContainer>
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default Part1Page;
