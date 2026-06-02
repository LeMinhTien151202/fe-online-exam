import React, { useState, useEffect } from 'react';
import { Space, Progress, Button, message } from 'antd';
import { useNavigate } from '@tanstack/react-router';
import { 
  LeftOutlined, 
  RightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DownOutlined,
  UpOutlined,
  UnlockOutlined
} from '@ant-design/icons';
import * as S from '../styles/styled';
import * as HomeS from '../../../../home/pages/styled';
import { Sidebar } from '../../../../home/components/Sidebar';
import { SpeakingController } from '../../speaking-part1/components/SpeakingController';

interface ISubQuestion {
  id: number;
  questionText: string;
  sampleAnswers: string[];
}

interface ISetQuestion {
  id: number;
  title: string;
  imageUrl: string;
  questions: ISubQuestion[];
  tips: string[];
}

const mockSets: ISetQuestion[] = [
  {
    id: 1,
    title: "Set 1: Family Cooking",
    imageUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=60",
    questions: [
      {
        id: 1,
        questionText: "Describe this picture. Tell me what you can see in the photo.",
        sampleAnswers: [
          "In the picture, I can see a family of three cooking together in a bright, modern kitchen. The father and mother are smiling warmly at their young son, who is standing between them and helping chop some yellow bell peppers. There are fresh vegetables like tomatoes and lettuce on the kitchen counter. They all look very happy and are enjoying their family time together.",
          "This photo shows a lovely family moment in a well-lit kitchen. A couple is preparing a healthy meal with their little son. The mother is holding a bowl, the father is looking at his son with a proud smile, and the boy is busy slicing vegetables. It looks like a clean, cozy home environment, highlighting family bonding through cooking."
        ]
      },
      {
        id: 2,
        questionText: "Why do you think it is important for families to cook or eat meals together?",
        sampleAnswers: [
          "I believe cooking and eating together is crucial because it helps strengthen family bonds. In today's busy world, mealtime is one of the few opportunities where family members can sit down, share their daily experiences, and communicate. Moreover, home-cooked meals are generally healthier and encourage kids to build good eating habits.",
          "From my perspective, dining together creates a sense of belonging and security for children. It allows parents to listen to their kids' problems and offer guidance. Also, sharing cooking responsibilities teaches teamwork and life skills to younger members, making them more independent."
        ]
      },
      {
        id: 3,
        questionText: "Tell me about a memorable meal you had with your family.",
        sampleAnswers: [
          "A memorable meal I had was last New Year's Eve. My family gathered at my grandparents' house. We prepared a traditional feast, including banh chung and roasted chicken. We talked, laughed, and recalled happy memories from the past year. It was special because it was the first time in years that all of my cousins and relatives were present.",
          "I remember a dinner we had during our summer vacation in Nha Trang two years ago. We sat at an outdoor restaurant by the beach and ate fresh grilled seafood while listening to the sound of waves. My father told funny jokes from his youth, and we laughed so hard. The combination of delicious food and the beautiful scenery made it unforgettable."
        ]
      }
    ],
    tips: [
      "Khi miêu tả tranh, hãy đi từ tổng quan (who, where) đến chi tiết (actions, objects) rồi cảm xúc (feelings).",
      "Sử dụng thì Hiện tại tiếp diễn để tả hành động đang xảy ra trong tranh (cooking, smiling, chopping).",
      "Đưa ra ý kiến cá nhân rõ ràng bằng các cụm như 'In my opinion', 'From my perspective' cho các câu hỏi nghị luận."
    ]
  }
];

export const Part2Page: React.FC = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(12 * 60); // Đếm ngược chung
  const [currentSubIndex, setCurrentSubIndex] = useState(1); // 1, 2, 3 (tương ứng sub-tab)
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [activeSampleIdx, setActiveSampleIdx] = useState(0);

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

  const handleSubTabChange = (idx: number) => {
    setCurrentSubIndex(idx);
    setShowSampleAnswer(false);
    setActiveSampleIdx(0);
  };

  const handleNext = () => {
    if (currentSubIndex < 3) {
      setCurrentSubIndex(prev => prev + 1);
      setShowSampleAnswer(false);
      setActiveSampleIdx(0);
    } else {
      navigate({ to: '/speaking/part/3' });
    }
  };

  const handleBack = () => {
    if (currentSubIndex > 1) {
      setCurrentSubIndex(prev => prev - 1);
      setShowSampleAnswer(false);
      setActiveSampleIdx(0);
    } else {
      navigate({ to: '/speaking/part/1' });
    }
  };

  const handleSubmit = () => {
    message.success('Đã hoàn thành luyện tập Part 2!');
    navigate({ to: '/speaking/part/3' });
  };

  const handleRecordComplete = (audioUrl: string | null) => {
    const key = `1-${currentSubIndex}`;
    setAnswers(prev => ({
      ...prev,
      [key]: audioUrl || 'recorded_mock'
    }));
  };

  const currentSet = mockSets[0];
  const activeQuestion = currentSet.questions[currentSubIndex - 1];

  // Tính tiến độ: Số sub-questions đã ghi âm (tối đa 3)
  const totalSubQuestions = 3;
  let answeredCount = 0;
  [1, 2, 3].forEach(sub => {
    if (answers[`1-${sub}`]) answeredCount++;
  });
  const progressPercent = Math.round((answeredCount / totalSubQuestions) * 100);

  return (
    <HomeS.MainLayout>
      <Sidebar />
      <HomeS.RightColumn>
        <S.PageContainer>
          <S.Header>
            <Space size="middle">
              <S.BackLink to="/speaking">
                <LeftOutlined /> Quay lại
              </S.BackLink>
              <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white' }}>
                Part 2: Describe, Express Opinion & Explain
              </span>
            </Space>

            <Space size="large" style={{ display: 'flex', alignItems: 'center' }}>
              <Progress
                type="circle"
                percent={progressPercent}
                size={40}
                strokeColor="#10b981"
                trailColor="rgba(255,255,255,0.2)"
                format={() => <span style={{ color: 'white', fontSize: '11px', fontWeight: 'bold' }}>{answeredCount}/{totalSubQuestions}</span>}
              />
              <S.TimerWrapper>
                <ClockCircleOutlined style={{ color: '#fbbf24', marginRight: '4px' }} />
                {formatTime(timeLeft)}
              </S.TimerWrapper>
            </Space>
          </S.Header>

          <S.MainContent>
            <S.ContentGrid>
              <S.LeftColumn>
                <S.ContentCard>
                  <S.TitleArea>
                    <div>
                      <h2>Miêu tả tranh và trả lời 2 câu hỏi</h2>
                      <div className="subtitle">
                        Speaking Part 2 • 3 Questions
                      </div>
                    </div>
                  </S.TitleArea>

                  {/* Image Display */}
                  <S.ImageWrapper $height="280px">
                    <img src={currentSet.imageUrl} alt={currentSet.title} />
                  </S.ImageWrapper>

                  {/* Sub-tabs inside the Set */}
                  <S.SubTabContainer>
                    {[1, 2, 3].map((idx) => {
                      const isTabDone = !!answers[`1-${idx}`];
                      return (
                        <S.SubTab 
                          key={idx}
                          $active={currentSubIndex === idx}
                          $color="#059669"
                          onClick={() => handleSubTabChange(idx)}
                        >
                          Câu {idx} {isTabDone && '✓'}
                        </S.SubTab>
                      );
                    })}
                  </S.SubTabContainer>

                  <S.QuestionBox $borderColor="#059669">
                    <div className="q-badge">
                      {currentSubIndex === 1 ? 'Mô tả tranh (Describe)' : 'Câu hỏi mở rộng (Explain)'}
                    </div>
                    <div className="q-text">{activeQuestion.questionText}</div>
                  </S.QuestionBox>
                </S.ContentCard>
              </S.LeftColumn>

              <S.RightColumn>
                <SpeakingController 
                  prepTime={45} // 45 giây chuẩn bị
                  recordingTime={45} // Ghi âm 45 giây
                  statusColor="#059669"
                  title={`p2-q${currentSubIndex}`}
                  onCompleted={handleRecordComplete}
                />
                {/* Collapsible Sample Answer */}
                <S.CollapsibleWrapper>
                  <S.CollapsibleHeader onClick={() => setShowSampleAnswer(!showSampleAnswer)}>
                    <span>
                      <UnlockOutlined style={{ marginRight: '8px', color: '#059669' }} /> 
                      Xem đáp án mẫu
                    </span>
                    {showSampleAnswer ? <UpOutlined /> : <DownOutlined />}
                  </S.CollapsibleHeader>
                  {showSampleAnswer && (
                    <S.CollapsibleBody>
                      {activeQuestion.sampleAnswers && activeQuestion.sampleAnswers.length > 1 && (
                        <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {activeQuestion.sampleAnswers.map((_, sIdx) => (
                            <Button 
                              key={sIdx}
                              size="small"
                              type={activeSampleIdx === sIdx ? "primary" : "default"}
                              onClick={() => setActiveSampleIdx(sIdx)}
                              style={{ 
                                borderRadius: '12px', 
                                fontSize: '12px',
                                background: activeSampleIdx === sIdx ? '#059669' : undefined,
                                borderColor: activeSampleIdx === sIdx ? '#059669' : undefined,
                              }}
                            >
                              Đáp án {sIdx + 1}
                            </Button>
                          ))}
                        </div>
                      )}
                      {activeQuestion.sampleAnswers[activeSampleIdx]}
                    </S.CollapsibleBody>
                  )}
                </S.CollapsibleWrapper>
              </S.RightColumn>
            </S.ContentGrid>
          </S.MainContent>

          <S.Footer>
            <Button
              type="default"
              icon={<LeftOutlined />}
              size="large"
              style={{ borderRadius: '2rem', fontWeight: 600, padding: '0 1.5rem', border: '1px solid #e2e8f0', color: '#64748b' }}
              onClick={handleBack}
            >
              Quay lại
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
                Tiếp theo <RightOutlined style={{ fontSize: '12px' }} />
              </Button>
            </Space>
          </S.Footer>
        </S.PageContainer>
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default Part2Page;
