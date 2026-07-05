import {
CheckCircleOutlined,
ClockCircleOutlined,
DownOutlined,
LeftOutlined,
RightOutlined,
UnlockOutlined,
UpOutlined
} from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import { Button,Progress,Select,Space,message } from 'antd';
import React,{ useEffect,useState } from 'react';
import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import { SpeakingController } from '../../../components/SpeakingController';
import * as S from './styled';

interface IQuestion {
  id: number;
  questionText: string;
  sampleAnswers: string[];
  tips: string[];
}

const mockQuestions: IQuestion[] = [
  {
    id: 1,
    questionText: "Tell me about your favourite sports or hobbies. Why do you enjoy them?",
    sampleAnswers: [
      "In my free time, I really enjoy playing football. I usually play with my friends twice a week. It helps me stay healthy and relax after a busy working day. Besides that, I also love reading books, especially science fiction, which helps to expand my imagination.",
      "Honestly, my absolute favorite hobby is cooking. I love experimenting with new recipes from different countries every weekend. Cooking is like a therapy for me; it allows me to express my creativity and make my family happy with delicious dishes."
    ],
    tips: [
      "Hãy trả lời trực tiếp vào câu hỏi trong 1-2 câu đầu tiên.",
      "Mở rộng ý bằng cách đưa ra lý do (Why) hoặc tần suất (How often).",
      "Giữ tốc độ nói tự nhiên, phát âm rõ ràng, trôi chảy."
    ]
  },
  {
    id: 2,
    questionText: "What do you like to do when you have free time on the weekend?",
    sampleAnswers: [
      "On weekends, I prefer spending time outdoors. I often go cycling in the local park in the morning. In the afternoon, I meet up with my close friends at a cafe, where we catch up and chat. On Sunday nights, I usually watch a movie at home.",
      "During the weekend, I love relaxing at home. I usually sleep in, then clean my apartment while listening to music. In the evening, I often order some pizza and play video games or read a good novel. It helps me recharge for the upcoming week."
    ],
    tips: [
      "Nêu cụ thể hoạt động cuối tuần (thường là ngoài trời hoặc gặp gỡ bạn bè).",
      "Sử dụng các trạng từ chỉ tần suất như 'often', 'usually', 'prefer'.",
      "Đảm bảo kết thúc bài nói trong khoảng 25-30 giây."
    ]
  },
  {
    id: 3,
    questionText: "Tell me about your typical weekday morning routine.",
    sampleAnswers: [
      "On a typical weekday, I get up around 6:30 AM. First, I do some light exercises for 15 minutes to wake up my body. Then, I take a quick shower and have breakfast, which is usually bread and eggs. Finally, I leave my house for work at 7:45 AM.",
      "My morning routine is quite fast. I wake up at 7:00 AM, brush my teeth, and immediately grab a cup of hot black coffee. I don't usually eat a heavy breakfast; I just have some fruits. I then dress up quickly and catch the 7:30 bus to get to my classes on time."
    ],
    tips: [
      "Liệt kê các hoạt động theo trình tự thời gian (First, Then, Finally).",
      "Sử dụng thì Hiện tại đơn để nói về thói quen hàng ngày.",
      "Giữ cấu trúc đơn giản, rõ ràng."
    ]
  },
  {
    id: 4,
    questionText: "What is your favorite type of weather? Why?",
    sampleAnswers: [
      "My favorite type of weather is cool, autumn weather. I love it because the temperature is very comfortable, neither too hot nor too cold. It is perfect for walking in the park, drinking coffee, and wearing light jackets. Rain makes me feel a bit lazy.",
      "I am a big fan of sunny and warm weather. When the sun is shining, I feel much more energetic and motivated to go outside. It allows me to go to the beach, swim, and hang out with friends without worrying about rain or freezing temperatures."
    ],
    tips: [
      "Đưa ra sở thích thời tiết ngay câu đầu tiên.",
      "Liệt kê 2-3 lý do tại sao bạn thích kiểu thời tiết đó.",
      "Dùng tính từ mô tả cảm xúc: comfortable, refreshing, relaxing."
    ]
  },
  {
    id: 5,
    questionText: "Tell me about the last book you read or movie you watched.",
    sampleAnswers: [
      "The last movie I watched was an science fiction film called 'Interstellar'. It is about space exploration and finding a new home for humanity. I found it extremely fascinating because of its great soundtrack, stunning visual effects, and emotional father-daughter story.",
      "The last book I read was 'Atomic Habits' by James Clear. It is a self-help book that explains how tiny changes can lead to remarkable results. I found it highly practical and inspiring, especially the tips on how to build good habits and break bad ones."
    ],
    tips: [
      "Dùng thì Quá khứ đơn vì câu hỏi hỏi về bộ phim/quyển sách 'gần nhất đã xem/đọc'.",
      "Nêu tên tác phẩm và thể loại sơ lược.",
      "Nêu cảm nghĩ cá nhân (fascinating, emotional, inspiring)."
    ]
  },
  {
    id: 6,
    questionText: "Describe a special celebration or holiday in your country.",
    sampleAnswers: [
      "The most important holiday in Vietnam is Tet, which is the Lunar New Year. During Tet, family members gather together, clean and decorate their houses, and cook traditional foods like banh chung. Children also receive lucky money from adults.",
      "Mid-Autumn Festival is a wonderful celebration in my country, especially for kids. It takes place in August of the lunar calendar. People eat delicious mooncakes, and children carry colorful star-shaped lanterns around the neighborhood while watching lion dances."
    ],
    tips: [
      "Giới thiệu tên ngày lễ và thời điểm diễn ra ngắn gọn.",
      "Liệt kê các hoạt động chính diễn ra trong dịp lễ đó.",
      "Giải thích ý nghĩa của nó đối với bạn hoặc mọi người."
    ]
  },
  {
    id: 7,
    questionText: "How do you usually travel to work or school every day?",
    sampleAnswers: [
      "I usually travel to my office by motorbike. It takes about 20 minutes because the traffic is quite heavy in the morning. I prefer riding a motorbike because it is flexible and helps me weave through traffic jams easily.",
      "I normally take the bus to go to school. Although it takes longer than a motorbike—about 40 minutes—I prefer it because it is cheap and safe. During the ride, I can listen to my favorite podcasts or read some pages of a book."
    ],
    tips: [
      "Nêu phương tiện đi lại chính (motorbike, bus, car, bicycle).",
      "Nêu thời gian di chuyển trung bình.",
      "Đưa ra lý do tại sao chọn phương tiện đó (flexible, cheap, convenient)."
    ]
  },
  {
    id: 8,
    questionText: "What is your favorite food? Do you prefer eating out or cooking at home?",
    sampleAnswers: [
      "My favorite food is Pho, a traditional Vietnamese noodle soup. I generally prefer cooking at home because I can choose fresh ingredients and prepare meals according to my taste. However, I sometimes eat out with my friends on weekends.",
      "I really love pizza and pasta, basically Italian food. I definitely prefer eating out at restaurants because I am not a very good cook, and eating out saves me time from washing dishes. Plus, the atmosphere in Italian diners is amazing."
    ],
    tips: [
      "Trả lời cả 2 ý: món ăn yêu thích và sở thích nấu ăn/ăn ngoài.",
      "Sử dụng từ nối chuyển ý như: 'However', 'On the other hand'.",
      "Nêu lý do vì sức khỏe hoặc tính tiện lợi."
    ]
  },
  {
    id: 9,
    questionText: "Tell me about a teacher who had a significant influence on you.",
    sampleAnswers: [
      "A teacher who influenced me a lot was my high school English teacher, Ms. Lan. She was very patient, enthusiastic, and always encouraged us to speak English. Thanks to her interesting lessons, I fell in love with learning English.",
      "My high school math teacher, Mr. Nam, had a huge impact on me. He was strict but very fair and logical. He didn't just teach us formulas; he taught us how to analyze problems and think critically, which is a skill I still use every day."
    ],
    tips: [
      "Giới thiệu tên giáo viên và môn học dạy bạn.",
      "Mô tả tính cách tốt của họ (patient, kind, inspiring).",
      "Nêu tác động tích cực của họ đối với bạn."
    ]
  },
  {
    id: 10,
    questionText: "What are your plans for your next summer holiday?",
    sampleAnswers: [
      "For my next summer holiday, I plan to visit Da Nang city with my family. We intend to spend four days there exploring the beautiful beaches, visiting Ba Na Hills, and enjoying local seafood. I hope it will be a relaxing trip.",
      "Next summer, I am planning to go on a hiking trip in Sa Pa with my friends. We want to conquer Fansipan peak and experience the local ethnic minority culture. I am really looking forward to this adventure because I love nature."
    ],
    tips: [
      "Sử dụng cấu trúc tương lai/dự định: 'I plan to', 'I intend to', 'We are going to'.",
      "Nêu địa điểm, bạn hành trình và một vài hoạt động dự kiến.",
      "Bày tỏ sự mong đợi đối với chuyến đi."
    ]
  }
];

export const Part1Page: React.FC = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(12 * 60); // 12 phút tổng thời gian Speaking
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  
  const [showTips, setShowTips] = useState(false);
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [activeSampleIdx, setActiveSampleIdx] = useState(0);

  // Global countdown timer
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
    if (currentQuestionIndex < mockQuestions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowSampleAnswer(false);
      setActiveSampleIdx(0);
    } else {
      navigate({ to: '/speaking/part/2' });
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 1) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowSampleAnswer(false);
      setActiveSampleIdx(0);
    } else {
      navigate({ to: '/speaking' });
    }
  };

  const handleSubmit = () => {
    message.success('Đã hoàn thành luyện tập Part 1!');
    navigate({ to: '/speaking/part/2' });
  };

  const handleRecordComplete = (audioUrl: string | null) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: audioUrl || 'recorded_mock'
    }));
  };

  const currentQuestion = mockQuestions[currentQuestionIndex - 1];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / mockQuestions.length) * 100);

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
                Part 1: Personal Information
              </span>
            </Space>

            <Space size="large" style={{ display: 'flex', alignItems: 'center' }}>
              <Progress
                type="circle"
                percent={progressPercent}
                size={40}
                strokeColor="#10b981"
                trailColor="rgba(255,255,255,0.2)"
                format={() => <span style={{ color: 'white', fontSize: '11px', fontWeight: 'bold' }}>{answeredCount}/{mockQuestions.length}</span>}
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <h2>Trả lời 3 câu hỏi ngắn về bản thân</h2>
                        <div className="subtitle">
                          Speaking Part 1 • Question {currentQuestionIndex} of {mockQuestions.length}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Chọn câu:</span>
                        <Select
                          value={currentQuestionIndex}
                          onChange={(val) => {
                            setCurrentQuestionIndex(val as number);
                            setShowSampleAnswer(false);
                            setActiveSampleIdx(0);
                          }}
                          style={{ width: 140 }}
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

                  <S.QuestionBox $borderColor="#0284c7">
                    <div className="q-badge">Câu hỏi {currentQuestionIndex}</div>
                    <div className="q-text">{currentQuestion.questionText}</div>
                  </S.QuestionBox>
                </S.ContentCard>
              </S.LeftColumn>

              <S.RightColumn>
                <SpeakingController 
                  prepTime={0} // Không có thời gian chuẩn bị
                  recordingTime={30} // Ghi âm 30 giây
                  statusColor="#0284c7"
                  title={`p1-q${currentQuestionIndex}`}
                  onCompleted={handleRecordComplete}
                />
                {/* Collapsible Sample Answer */}
                <S.CollapsibleWrapper>
                  <S.CollapsibleHeader onClick={() => setShowSampleAnswer(!showSampleAnswer)}>
                    <span>
                      <UnlockOutlined style={{ marginRight: '8px', color: '#0284c7' }} /> 
                      Xem đáp án mẫu
                    </span>
                    {showSampleAnswer ? <UpOutlined /> : <DownOutlined />}
                  </S.CollapsibleHeader>
                  {showSampleAnswer && (
                    <S.CollapsibleBody>
                      {currentQuestion.sampleAnswers && currentQuestion.sampleAnswers.length > 1 && (
                        <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {currentQuestion.sampleAnswers.map((_, sIdx) => (
                            <Button 
                              key={sIdx}
                              size="small"
                              type={activeSampleIdx === sIdx ? "primary" : "default"}
                              onClick={() => setActiveSampleIdx(sIdx)}
                              style={{ 
                                borderRadius: '12px', 
                                fontSize: '12px',
                                background: activeSampleIdx === sIdx ? '#0284c7' : undefined,
                                borderColor: activeSampleIdx === sIdx ? '#0284c7' : undefined,
                              }}
                            >
                              Đáp án {sIdx + 1}
                            </Button>
                          ))}
                        </div>
                      )}
                      {currentQuestion.sampleAnswers[activeSampleIdx]}
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
              {currentQuestionIndex === 1 ? 'Bảng điều khiển' : 'Quay lại câu trước'}
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
                {currentQuestionIndex < mockQuestions.length ? 'Câu tiếp theo' : 'Tiếp theo (Part 2)'} <RightOutlined style={{ fontSize: '12px' }} />
              </Button>
            </Space>
          </S.Footer>
        </S.PageContainer>
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default Part1Page;
