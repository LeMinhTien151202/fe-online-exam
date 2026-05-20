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

interface IQuestion {
  id: number;
  questionText: string;
  options: string[];
  transcript: string;
}

const mockQuestions: IQuestion[] = [
  {
    id: 1,
    questionText: 'Listen to David talking about the conference. How long did he talk in the speech?',
    options: ['10 minutes', '15 minutes', '20 minutes'],
    transcript: 'David: Well, the conference went really well. I was worried about my speech, but it turned out fine. I thought I would talk for 20 minutes, but they asked me to shorten it. In the end, I spoke for 15 minutes, which left about 10 minutes for questions.'
  },
  {
    id: 2,
    questionText: 'Listen to the woman. Where is she going this afternoon?',
    options: ['To the supermarket', 'To the dentist', 'To the library'],
    transcript: 'Woman: I have a busy day ahead. In the morning, I need to return some books to the library, and after lunch, I have an appointment with my dentist. I\'ll do the grocery shopping tomorrow instead.'
  },
  {
    id: 3,
    questionText: 'Listen to the announcement. What time will the flight depart?',
    options: ['14:30', '15:00', '15:30'],
    transcript: 'Announcement: Attention passengers of flight VN123 to Hanoi. Due to late arrival of the incoming aircraft, the departure time has been changed from 14:30 to 15:30. Boarding will start at 15:00.'
  },
  {
    id: 4,
    questionText: 'Listen to the message. Why is Tom calling?',
    options: ['To cancel a meeting', 'To ask for help', 'To invite someone to lunch'],
    transcript: 'Tom: Hey Sarah, it\'s Tom. I was wondering if you\'re free this Friday afternoon. A few of us are planning to grab lunch together around 12:30. Let me know if you can make it!'
  },
  {
    id: 5,
    questionText: 'Listen to the conversation. How much did the man pay for his jacket?',
    options: ['50 dollars', '75 dollars', '100 dollars'],
    transcript: 'Man: Look at this new winter jacket I got. It was originally 100 dollars, but they had a 25% discount this week. So it was a pretty good deal at 75 dollars!'
  },
  {
    id: 6,
    questionText: 'Listen to the guide. Which floor is the Egyptian art exhibition on?',
    options: ['First floor', 'Second floor', 'Third floor'],
    transcript: 'Guide: Welcome to the museum. Today, our medieval collection is on the first floor, and the modern paintings are on the third. If you want to see the famous Egyptian art exhibition, please take the stairs to the second floor.'
  },
  {
    id: 7,
    questionText: 'Listen to the message. What is the weather like today?',
    options: ['Rainy', 'Cloudy', 'Sunny'],
    transcript: 'Weather Forecast: Good morning. We started the week with heavy rain, but today the clouds have cleared up, giving us a beautiful, warm sunny day. Enjoy it while it lasts, as clouds are expected tomorrow.'
  },
  {
    id: 8,
    questionText: 'Listen to the speaker. What job did he do first?',
    options: ['Teacher', 'Waiter', 'Salesperson'],
    transcript: 'Speaker: Before I got my degree and started working as a high school teacher, I did several part-time jobs. My very first job was a waiter at a local Italian restaurant, and later I worked as a salesperson at a clothing shop.'
  },
  {
    id: 9,
    questionText: 'Listen to the conversation. How are they going to travel?',
    options: ['By train', 'By bus', 'By car'],
    transcript: 'Woman: Shall we drive to the city? It takes about an hour.\nMan: The traffic is usually terrible. Why don\'t we take the train? It\'s faster.\nWoman: True, but the bus station is closer to our house. Let\'s do that instead.'
  },
  {
    id: 10,
    questionText: 'Listen to the message. When is the museum closed?',
    options: ['Mondays', 'Wednesdays', 'Sundays'],
    transcript: 'Voice message: Hello, the city history museum is open Tuesday through Sunday from 9 AM to 6 PM. We are closed on Mondays for weekly maintenance.'
  },
  {
    id: 11,
    questionText: 'Listen to the speaker. Which sport does she practice regularly now?',
    options: ['Swimming', 'Tennis', 'Running'],
    transcript: 'Speaker: I used to swim twice a week when I was at university, and I occasionally play tennis with friends on weekends. But these days, running is my primary daily exercise.'
  },
  {
    id: 12,
    questionText: 'Listen to the phone call. What is the problem with the hotel room?',
    options: ['No internet connection', 'The room is too noisy', 'The air conditioner is broken'],
    transcript: 'Guest: Hello, reception? This is room 305. The Wi-Fi is working fine and the room is quiet, but the air conditioner in my room doesn\'t seem to be working. It is getting very warm in here.'
  },
  {
    id: 13,
    questionText: 'Listen to the announcement. Where should passengers go to get their baggage?',
    options: ['Carousel 3', 'Carousel 5', 'Carousel 7'],
    transcript: 'Announcement: Passengers arriving from flight BA456 from London can now collect their baggage at Carousel 5. Please note that Carousel 3 is for flight VN789, and Carousel 7 is currently out of order.'
  }
];

export const Part1Page: React.FC = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(39 * 60 + 56);
  const [showTranscript, setShowTranscript] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
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

  const handleSelectAnswer = (option: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: option }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < 13) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowTranscript(false); // reset transcript on question change
    } else {
      navigate({ to: '/listening/part/2' });
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 1) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowTranscript(false);
    } else {
      navigate({ to: '/listening' });
    }
  };

  const handleSubmit = () => {
    message.success('Đã nộp bài Part 1!');
    navigate({ to: '/listening/part/2' });
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / 13) * 100;
  const currentQuestion = mockQuestions[currentQuestionIndex - 1];

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
                Part 1: Questions 1 - 13
              </span>
            </Space>

            <Space size="large" style={{ display: 'flex', alignItems: 'center' }}>
              <Progress
                type="circle"
                percent={progressPercent}
                size={40}
                strokeColor="#10b981"
                trailColor="rgba(255,255,255,0.2)"
                format={() => <span style={{ color: 'white', fontSize: '11px', fontWeight: 'bold' }}>{answeredCount}/13</span>}
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
                    <h2>Listening</h2>
                    <div className="subtitle">
                      Part 1 • Question {currentQuestionIndex} of 13
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Chọn câu:</span>
                    <Select
                      value={currentQuestionIndex}
                      onChange={(val) => {
                        setCurrentQuestionIndex(val as number);
                        setShowTranscript(false);
                      }}
                      style={{ width: 150 }}
                      dropdownStyle={{ maxHeight: 300, overflowY: 'auto' }}
                      showSearch
                      optionFilterProp="label"
                      options={mockQuestions.map((q) => ({
                        value: q.id,
                        label: `Câu ${q.id}`,
                        labelNode: (
                          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                            <span>Câu {q.id}</span>
                            {answers[q.id] ? <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> : <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>Chưa làm</span>}
                          </div>
                        )
                      }))}
                      optionRender={(option) => (option.data as any).labelNode}
                    />
                  </div>
                </div>
              </S.TitleArea>

              <AudioPlayer />

              <S.InstructionText>
                {currentQuestion.questionText}
              </S.InstructionText>

              <div style={{ marginTop: '1.5rem' }}>
                {currentQuestion.options.map((option, idx) => {
                  const letter = String.fromCharCode(65 + idx); // A, B, C...
                  const isSelected = answers[currentQuestionIndex] === option;
                  return (
                    <S.OptionCard 
                      key={idx} 
                      onClick={() => handleSelectAnswer(option)}
                      style={{
                        borderColor: isSelected ? '#2563eb' : '#e2e8f0',
                        background: isSelected ? '#eff6ff' : '#ffffff'
                      }}
                    >
                      <div className="option-letter" style={{ color: isSelected ? '#2563eb' : '#0f172a' }}>{letter}</div>
                      <div className="option-text" style={{ color: isSelected ? '#1e3a8a' : '#334155', fontWeight: isSelected ? '700' : '500' }}>{option}</div>
                    </S.OptionCard>
                  );
                })}
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
                  {currentQuestion.transcript}
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
              {currentQuestionIndex === 1 ? 'Trở lại Bảng điều khiển' : 'Quay lại câu trước'}
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
                {currentQuestionIndex < 13 ? 'Câu tiếp theo' : 'Tiếp theo (Part 2)'} <RightOutlined style={{ fontSize: '12px' }} />
              </Button>
            </Space>
          </S.Footer>
        </S.PageContainer>
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default Part1Page;
