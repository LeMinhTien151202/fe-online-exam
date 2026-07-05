import {
CheckCircleOutlined,
ClockCircleOutlined,
DownOutlined,
LeftOutlined,
UnlockOutlined,
UpOutlined
} from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import { Button,message,Progress,Space } from 'antd';
import React,{ useEffect,useState } from 'react';
import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import { SpeakingController } from '../../../components/SpeakingController';
import * as S from './styled';

interface IAbstractSet {
  id: number;
  title: string;
  imageUrl: string;
  questions: string[];
  sampleAnswers: string[];
  tips: string[];
}

const mockAbstractSets: IAbstractSet[] = [
  {
    id: 1,
    title: "Set 1: Generosity & Giving",
    imageUrl: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format&fit=crop&q=60",
    questions: [
      "Tell me about the last time you gave someone a possession.",
      "How did you feel about it?",
      "Why should people encourage others to share or do charity?"
    ],
    sampleAnswers: [
      `Here is my response to the three questions:
      
Firstly, regarding the last time I gave someone a possession, it was about three months ago. I decided to give my old laptop to my younger cousin who just started university. His family was facing financial difficulties and couldn't afford a new computer for his studies.
      
Secondly, speaking of how I felt, I felt incredibly happy and fulfilled. Knowing that my old device, which was just sitting in my drawer, could make such a significant difference in his education brought me a deep sense of joy. It made me realize that sharing is far more rewarding than keeping things we no longer need.
      
Lastly, as to why people should encourage others to share or do charity, I believe it builds a stronger and more compassionate society. When we encourage sharing, we help bridge the gap between the rich and the poor, and we foster empathy among citizens. It creates a network of support that ensures nobody is left behind during difficult times.`,
      `Here is an alternative approach to this topic:

First of all, to talk about the last time I gave away a possession, it was just last week. I gifted a set of rare English reference books to a coworker who is preparing for an IELTS exam. Since I had already passed my exam, I thought they would be of much greater use to her.

Secondly, in terms of my feelings, I felt extremely satisfied and proud. Helping a colleague achieve their career goals is very rewarding, and it strengthened our workplace friendship. It also made me feel less cluttered at home, which was a pleasant side effect.

Finally, regarding why sharing and charity should be encouraged, I think it spreads kindness and creates a positive chain reaction. When someone receives help, they are much more likely to help others in the future. Moreover, it reduces social inequality and ensures that resources are distributed to those who actually need them the most.`
    ],
    tips: [
      "Đối với Part 4, bạn có 60 giây để chuẩn bị cho CẢ 3 CÂU HỎI. Hãy dùng nháp để gạch nhanh các ý chính cho từng câu.",
      "Khi nói, bạn phải nói liên tục trong 120 giây. Hãy dùng các từ nối chỉ trình tự như 'Firstly, regarding...', 'Secondly, speaking of...', 'Lastly, as to...' để phân chia bài nói rõ ràng.",
      "Cố gắng phân bổ thời gian đều: khoảng 35-40 giây cho mỗi câu hỏi con để tránh việc nói quá dài ở câu 1 và thiếu thời gian cho câu 3."
    ]
  }
];

export const Part4Page: React.FC = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(12 * 60);
  const [currentSetIndex, setCurrentSetIndex] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string | null>>({});

  const [showTips, setShowTips] = useState(false);
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

  const handleNext = () => {
    if (currentSetIndex < mockAbstractSets.length) {
      setCurrentSetIndex(prev => prev + 1);
      setShowSampleAnswer(false);
    } else {
      message.info('Bạn đã hoàn thành bộ đề Speaking Practice!');
    }
  };

  const handleBack = () => {
    navigate({ to: '/speaking/part/3' });
  };

  const handleSubmit = () => {
    message.success('Xin chúc mừng! Bạn đã hoàn thành toàn bộ bài thi thử Speaking.');
    navigate({ to: '/speaking' });
  };

  const handleRecordComplete = (audioUrl: string | null) => {
    setAnswers(prev => ({
      ...prev,
      [1]: audioUrl || 'recorded_mock'
    }));
  };

  const currentSet = mockAbstractSets[0];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / mockAbstractSets.length) * 100);

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
                Part 4: Abstract Topic (Band B2 Decisive)
              </span>
            </Space>

            <Space size="large" style={{ display: 'flex', alignItems: 'center' }}>
              <Progress
                type="circle"
                percent={progressPercent}
                size={40}
                strokeColor="#10b981"
                trailColor="rgba(255,255,255,0.2)"
                format={() => <span style={{ color: 'white', fontSize: '11px', fontWeight: 'bold' }}>{answeredCount}/{mockAbstractSets.length}</span>}
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
                      <h2>Trả lời liên tục 3 câu hỏi về chủ đề</h2>
                      <div className="subtitle">
                        Speaking Part 4 • Abstract Topic
                      </div>
                    </div>
                  </S.TitleArea>

                  {/* Image Display */}
                  <S.ImageWrapper $height="380px">
                    <img src={currentSet.imageUrl} alt={currentSet.title} />
                  </S.ImageWrapper>

                  {/* Vertically stacked question list */}
                  <S.QListWrapper>
                    {currentSet.questions.map((q, idx) => (
                      <S.QListItem key={idx} $borderColor="#7c3aed">
                        <div className="q-num">{idx + 1}</div>
                        <div className="q-content">{q}</div>
                      </S.QListItem>
                    ))}
                  </S.QListWrapper>
                </S.ContentCard>
              </S.LeftColumn>

              <S.RightColumn>
                <SpeakingController 
                  prepTime={60} // 60 giây chuẩn bị (1 phút)
                  recordingTime={120} // Ghi âm 120 giây (2 phút) liên tục
                  statusColor="#7c3aed"
                  title={`p4-s1`}
                  onCompleted={handleRecordComplete}
                />
                {/* Collapsible Sample Answer */}
                <S.CollapsibleWrapper>
                  <S.CollapsibleHeader onClick={() => setShowSampleAnswer(!showSampleAnswer)}>
                    <span>
                      <UnlockOutlined style={{ marginRight: '8px', color: '#7c3aed' }} /> 
                      Xem đáp án mẫu (Tất cả 3 câu)
                    </span>
                    {showSampleAnswer ? <UpOutlined /> : <DownOutlined />}
                  </S.CollapsibleHeader>
                  {showSampleAnswer && (
                    <S.CollapsibleBody>
                      {currentSet.sampleAnswers && currentSet.sampleAnswers.length > 1 && (
                        <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {currentSet.sampleAnswers.map((_, sIdx) => (
                            <Button 
                              key={sIdx}
                              size="small"
                              type={activeSampleIdx === sIdx ? "primary" : "default"}
                              onClick={() => setActiveSampleIdx(sIdx)}
                              style={{ 
                                borderRadius: '12px', 
                                fontSize: '12px',
                                background: activeSampleIdx === sIdx ? '#7c3aed' : undefined,
                                borderColor: activeSampleIdx === sIdx ? '#7c3aed' : undefined,
                              }}
                            >
                              Đáp án {sIdx + 1}
                            </Button>
                          ))}
                        </div>
                      )}
                      {currentSet.sampleAnswers[activeSampleIdx]}
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
                Nộp toàn bộ bài thi
              </Button>
            </Space>
          </S.Footer>
        </S.PageContainer>
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default Part4Page;
