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
import * as S from './styled';
import * as HomeS from '../../../../home/pages/styled';
import { Sidebar } from '../../../../home/components/Sidebar';
import { SpeakingController } from '../../../components/SpeakingController';

interface ISubQuestion {
  id: number;
  questionText: string;
  sampleAnswers: string[];
}

interface ICompareQuestion {
  id: number;
  title: string;
  image1Url: string;
  image2Url: string;
  questions: ISubQuestion[];
  tips: string[];
}

const mockCompareSets: ICompareQuestion[] = [
  {
    id: 1,
    title: "Set 1: Studying Environments",
    image1Url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&auto=format&fit=crop&q=60",
    image2Url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=60",
    questions: [
      {
        id: 1,
        questionText: "Compare these two pictures. What are the main differences between them?",
        sampleAnswers: [
          "Both pictures show people studying, but they are in completely different environments. In the first picture, several students are reading quietly in a spacious library surrounded by bookshelves. It looks very organized and peaceful. In contrast, the second picture shows a young woman studying in a cozy cafe, surrounded by plants and coffee cups. It seems much more casual and relaxed, but potentially more noisy.",
          "The two images depict different study locations. The first image displays an academic setting where students are focused on books in a silent library. The second image highlights a self-study scene in a bustling coffee shop where a person enjoys a beverage while studying on a laptop. The main difference lies in the level of privacy, noise, and formality."
        ]
      },
      {
        id: 2,
        questionText: "Why do you think some people prefer studying in libraries rather than coffee shops?",
        sampleAnswers: [
          "I think some people prefer libraries because they provide a quiet and structured environment, which is perfect for deep focus and studying complex subjects. There are fewer distractions compared to cafes. Additionally, libraries have useful resources like reference books, high-speed Wi-Fi, and printing services that support academic work.",
          "For many individuals, the academic atmosphere of a library, filled with other focused students, creates peer pressure that keeps them motivated and productive. In contrast, coffee shops have constant movement, music, and conversations, which can easily break one's concentration, especially during exam preparation."
        ]
      },
      {
        id: 3,
        questionText: "Which of these two places do you prefer for working or studying? Why?",
        sampleAnswers: [
          "Personally, I prefer studying in coffee shops. I find the background noise and the pleasant smell of coffee very motivating rather than distracting. Studying in a library sometimes makes me feel too stressed because it is extremely quiet. Having a drink and a snack while studying in a cafe helps me stay energized and creative.",
          "I would choose the library for serious study or writing. I need complete silence and zero distractions to organize my thoughts. However, if I am just doing light reading or brainstorm planning, I might go to a coffee shop for a change of environment and a cup of cappuccino."
        ]
      }
    ],
    tips: [
      "Sử dụng các từ nối so sánh và đối lập như: 'Both show...', 'In contrast', 'On the other hand', 'While the first one is...'.",
      "Tập trung nêu bật sự khác biệt về không gian (yên tĩnh vs ồn ào, chuyên nghiệp vs thư giãn).",
      "Ở câu 3, hãy chọn một bên và giải thích lý do cá nhân rõ ràng."
    ]
  }
];

export const Part3Page: React.FC = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(12 * 60);
  const [currentSubIndex, setCurrentSubIndex] = useState(1);
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
      navigate({ to: '/speaking/part/4' });
    }
  };

  const handleBack = () => {
    if (currentSubIndex > 1) {
      setCurrentSubIndex(prev => prev - 1);
      setShowSampleAnswer(false);
      setActiveSampleIdx(0);
    } else {
      navigate({ to: '/speaking/part/2' });
    }
  };

  const handleSubmit = () => {
    message.success('Đã hoàn thành luyện tập Part 3!');
    navigate({ to: '/speaking/part/4' });
  };

  const handleRecordComplete = (audioUrl: string | null) => {
    const key = `1-${currentSubIndex}`;
    setAnswers(prev => ({
      ...prev,
      [key]: audioUrl || 'recorded_mock'
    }));
  };

  const currentCompareSet = mockCompareSets[0];
  const activeQuestion = currentCompareSet.questions[currentSubIndex - 1];

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
                Part 3: Compare & Provide Reasons
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
                      <h2>So sánh hai bức tranh và trả lời câu hỏi</h2>
                      <div className="subtitle">
                        Speaking Part 3 • 3 Questions
                      </div>
                    </div>
                  </S.TitleArea>

                  {/* Side-by-side Images */}
                  <S.DoubleImageGrid>
                    <S.DoubleImageWrapper $height="220px">
                      <img src={currentCompareSet.image1Url} alt="Hình 1" />
                      <div className="label">Hình 1</div>
                    </S.DoubleImageWrapper>
                    <S.DoubleImageWrapper $height="220px">
                      <img src={currentCompareSet.image2Url} alt="Hình 2" />
                      <div className="label">Hình 2</div>
                    </S.DoubleImageWrapper>
                  </S.DoubleImageGrid>

                  {/* Sub-tabs */}
                  <S.SubTabContainer>
                    {[1, 2, 3].map((idx) => {
                      const isTabDone = !!answers[`1-${idx}`];
                      return (
                        <S.SubTab 
                          key={idx}
                          $active={currentSubIndex === idx}
                          $color="#ea580c"
                          onClick={() => handleSubTabChange(idx)}
                        >
                          Câu {idx} {isTabDone && '✓'}
                        </S.SubTab>
                      );
                    })}
                  </S.SubTabContainer>

                  <S.QuestionBox $borderColor="#ea580c">
                    <div className="q-badge">
                      {currentSubIndex === 1 ? 'So sánh hai tranh (Compare)' : 'Giải thích nguyên nhân (Reasons)'}
                    </div>
                    <div className="q-text">{activeQuestion.questionText}</div>
                  </S.QuestionBox>
                </S.ContentCard>
              </S.LeftColumn>

              <S.RightColumn>
                <SpeakingController 
                  prepTime={45} // 45 giây chuẩn bị
                  recordingTime={45} // Ghi âm 45 giây
                  statusColor="#ea580c"
                  title={`p3-q${currentSubIndex}`}
                  onCompleted={handleRecordComplete}
                />
                {/* Collapsible Sample Answer */}
                <S.CollapsibleWrapper>
                  <S.CollapsibleHeader onClick={() => setShowSampleAnswer(!showSampleAnswer)}>
                    <span>
                      <UnlockOutlined style={{ marginRight: '8px', color: '#ea580c' }} /> 
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
                                background: activeSampleIdx === sIdx ? '#ea580c' : undefined,
                                borderColor: activeSampleIdx === sIdx ? '#ea580c' : undefined,
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

export default Part3Page;
