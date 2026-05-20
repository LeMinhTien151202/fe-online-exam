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

interface ISubQuestion {
  id: string;
  title: string;
  options: string[];
}

interface IQuestionGroup {
  id: number;
  title: string;
  instruction: string;
  subQuestions: ISubQuestion[];
  transcript: string;
}

const mockGroups: IQuestionGroup[] = [
  {
    id: 16,
    title: 'A Regional Development Plan',
    instruction: 'Listen to a city planner talk at a press conference about Regional Development Planning and answer the questions below.',
    subQuestions: [
      {
        id: '16.1',
        title: '16.1: What is one of the main criticisms of the Regional Development Plan?',
        options: [
          'It places too much emphasis on public transportation.',
          'It doesn\'t provide enough alternatives to driving.',
          'It is too expensive to implement the plan.'
        ]
      },
      {
        id: '16.2',
        title: '16.2: What challenge is the Regional Development Plan likely to face?',
        options: [
          'It could face difficulties in gaining government approval.',
          'It is likely to meet resistance from local communities.',
          'It might fail due to lack of private investment.'
        ]
      }
    ],
    transcript: 'City Planner (Q16): Welcome everyone. Today we are presenting the Regional Development Plan. A major critique we\'ve heard is that it doesn\'t provide enough alternatives to driving for daily commuters. We acknowledge this and are working on adding more bike lanes. Another hurdle is that it is likely to meet resistance from local communities who are concerned about increased construction noise over the next few years.'
  },
  {
    id: 17,
    title: 'New Public Park Proposal',
    instruction: 'Listen to a local official discussing the new public park proposal and answer the questions below.',
    subQuestions: [
      {
        id: '17.1',
        title: '17.1: Where does the speaker recommend locating the new public park?',
        options: [
          'Near the central library',
          'Adjacent to the train station',
          'Close to the riverfront area'
        ]
      },
      {
        id: '17.2',
        title: '17.2: Why is the budget for the new park being reduced by 10%?',
        options: [
          'To cover additional maintenance costs',
          'To fund the construction of a new community center nearby',
          'Due to an unexpected drop in municipal tax revenue'
        ]
      }
    ],
    transcript: 'Official (Q17): Moving on to the second agenda, the new public park. After reviewing the feedback, we recommend locating it close to the riverfront area, which offers the best green space. Unfortunately, because we need to fund the construction of a new community center nearby, we have had to trim the park budget by 10%.'
  }
];

export const Part4Page: React.FC = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(9 * 60 + 15); // 09:15 mock
  const [showTranscript, setShowTranscript] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<number>(16);
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

  const handleSelectAnswer = (subQuestionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [subQuestionId]: answer }));
  };

  const handleNext = () => {
    if (activeQuestion === 16) {
      setActiveQuestion(17);
      setShowTranscript(false);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (activeQuestion === 17) {
      setActiveQuestion(16);
      setShowTranscript(false);
    } else {
      navigate({ to: '/listening/part/3' });
    }
  };

  const handleSubmit = () => {
    message.success('Đã nộp bài Part 4 và hoàn thành Listening!');
    navigate({ to: '/listening' });
  };

  // 4 sub-questions in total
  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / 4) * 100;
  
  const currentGroup = mockGroups.find(g => g.id === activeQuestion) || mockGroups[0];

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
                Part 4: Questions 16 - 17
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h2>{currentGroup.title}</h2>
                    <div className="subtitle">
                      Part 4 • Question {activeQuestion === 16 ? '16' : '17'} of 17
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Chọn câu:</span>
                    <Select
                      value={activeQuestion}
                      onChange={(val) => {
                        setActiveQuestion(val as number);
                        setShowTranscript(false);
                      }}
                      style={{ width: 150 }}
                      options={mockGroups.map((g) => {
                        const sub1 = g.subQuestions[0].id;
                        const sub2 = g.subQuestions[1].id;
                        const isAnswered = !!answers[sub1] && !!answers[sub2];
                        return {
                          value: g.id,
                          label: `Câu ${g.id}`,
                          labelNode: (
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                              <span>Câu {g.id}</span>
                              {isAnswered ? <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> : <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>Chưa làm</span>}
                            </div>
                          )
                        };
                      })}
                      optionRender={(option) => (option.data as any).labelNode}
                    />
                  </div>
                </div>
              </S.TitleArea>

              <AudioPlayer />

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
                  {currentGroup.transcript}
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
              {activeQuestion === 16 ? 'Quay lại (Part 3)' : 'Quay lại Câu 16'}
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
                {activeQuestion === 16 ? 'Câu tiếp theo (Câu 17)' : 'Hoàn thành & Nộp bài'} <RightOutlined style={{ fontSize: '12px' }} />
              </Button>
            </Space>
          </S.Footer>
        </S.PageContainer>
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default Part4Page;
