import React, { useState, useEffect } from 'react';
import { Button, Space, Progress, Modal, Typography, Tooltip, message } from 'antd';
import { useNavigate, useParams } from '@tanstack/react-router';
import { 
  LeftOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  RollbackOutlined,
  AlertOutlined,
  UnlockOutlined,
  DownOutlined,
  UpOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import { SpeakingController } from '../../../components/SpeakingController';
import * as S from '../styles/styled';

const { Title, Text, Paragraph } = Typography;

interface ISpeakingQuestion {
  id: number;
  questionText: string;
  sampleAnswers: string[];
  tips: string[];
}

export const SpeakingMockTestPage: React.FC = () => {
  const { testId } = useParams({ strict: false }) as { testId: string };
  const navigate = useNavigate();

  const testTitle = testId === 'm2' ? 'Đề Nói số 2' : testId === 'm3' ? 'Đề Nói số 3' : 'Đề Nói số 1';
  const totalQuestions = 12;

  // Answers state for each question
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // Collapsible sample answers state per question
  const [showSampleMap, setShowSampleMap] = useState<Record<number, boolean>>({});
  const [activeSampleIdxMap, setActiveSampleIdxMap] = useState<Record<number, number>>({});

  // Active question number (1 to 12)
  const [activeQuestionNum, setActiveQuestionNum] = useState<number>(1);
  const activePart = activeQuestionNum <= 3 ? 1 : activeQuestionNum <= 6 ? 2 : activeQuestionNum <= 9 ? 3 : 4;

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0 || isSubmitted) {
      if (timeLeft <= 0 && !isSubmitted) {
        handleAutoSubmit();
      }
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).filter(k => answers[Number(k)]).length;

  const handleAutoSubmit = () => {
    setIsSubmitted(true);
    setShowReport(true);
    message.warning('Đã hết thời gian làm bài! Hệ thống tự động nộp bài.');
    saveProgressToLocalStorage();
  };

  const handleManualSubmit = () => {
    setIsSubmitted(true);
    setShowReport(true);
    message.success('Bạn đã nộp bài thi nói thành công!');
    saveProgressToLocalStorage();
  };

  const saveProgressToLocalStorage = () => {
    const saved = localStorage.getItem('aptis_speaking_mock_progress');
    let progressObj: Record<string, number> = {};
    if (saved) {
      try {
        progressObj = JSON.parse(saved);
      } catch (e) {}
    }
    // Since speaking is self-evaluated, we save completed status as 100
    progressObj[testId] = 100;
    localStorage.setItem('aptis_speaking_mock_progress', JSON.stringify(progressObj));
  };

  const handleRetry = () => {
    setAnswers({});
    setTimeLeft(20 * 60);
    setIsSubmitted(false);
    setShowReport(false);
    setActiveQuestionNum(1);
    setShowSampleMap({});
    setActiveSampleIdxMap({});
  };

  const handleBackToLanding = () => {
    if (isSubmitted) {
      navigate({ to: '/speaking' });
      return;
    }
    Modal.confirm({
      title: 'Xác nhận thoát khỏi đề thi?',
      icon: <AlertOutlined style={{ color: '#faad14' }} />,
      content: 'Tiến độ làm bài nói của bạn sẽ không được lưu nếu bạn thoát ra lúc này.',
      okText: 'Thoát ra',
      cancelText: 'Làm tiếp',
      onOk: () => {
        navigate({ to: '/speaking' });
      }
    });
  };

  const handleNavigateQuestion = (qNum: number) => {
    setActiveQuestionNum(qNum);
  };

  const handlePrevQuestion = () => {
    if (activePart === 2) {
      handleNavigateQuestion(1);
    } else if (activePart === 3) {
      handleNavigateQuestion(4);
    } else if (activePart === 4) {
      handleNavigateQuestion(7);
    }
  };

  const handleNextQuestion = () => {
    if (activePart === 1) {
      handleNavigateQuestion(4);
    } else if (activePart === 2) {
      handleNavigateQuestion(7);
    } else if (activePart === 3) {
      handleNavigateQuestion(10);
    }
  };

  const handleSubmitClick = () => {
    const unansweredCount = totalQuestions - answeredCount;
    const hasUnanswered = unansweredCount > 0;

    Modal.confirm({
      title: 'Xác nhận nộp bài thi nói?',
      icon: <CheckCircleOutlined style={{ color: '#10b981' }} />,
      content: hasUnanswered
        ? `Bạn còn ${unansweredCount} câu hỏi chưa trả lời ghi âm. Bạn có thực sự muốn nộp bài thi ngay bây giờ không?`
        : 'Bạn đã hoàn thành ghi âm toàn bộ 12 câu hỏi. Bạn có chắc chắn muốn nộp bài để xem đáp án mẫu không?',
      okText: 'Nộp bài',
      cancelText: 'Làm tiếp',
      onOk: handleManualSubmit
    });
  };

  const toggleSample = (qNum: number) => {
    setShowSampleMap(prev => ({ ...prev, [qNum]: !prev[qNum] }));
  };

  const setSampleIndex = (qNum: number, sIdx: number) => {
    setActiveSampleIdxMap(prev => ({ ...prev, [qNum]: sIdx }));
  };

  // Data Banks
  const part1Questions: ISpeakingQuestion[] = [
    {
      id: 1,
      questionText: "Please tell me about your family.",
      sampleAnswers: [
        "My family is quite small, with just three people: my parents and myself. My father is an engineer, and my mother is a high school teacher. We are very close and love spending our weekends cooking meals and watching movies together.",
        "I come from a large family with five members. I have an older sister and a younger brother. We live in Hanoi. Even though we are all busy with work and study, we try to gather for dinner every evening to share our day."
      ],
      tips: [
        "Hãy nêu quy mô gia đình trực tiếp (nhỏ hay lớn, số lượng thành viên).",
        "Kể sơ lược nghề nghiệp của bố mẹ hoặc nơi sinh sống.",
        "Bổ sung một sở thích chung để câu trả lời thêm sinh động."
      ]
    },
    {
      id: 2,
      questionText: "What do you like to do in your free time?",
      sampleAnswers: [
        "In my spare time, I am a big fan of reading books and listening to music. Reading helps me broaden my knowledge and relax, while music helps to ease my mind. Occasionally, I go jogging in the park near my house to stay fit.",
        "Honestly, my favorite leisure activity is cooking. I enjoy researching and experimenting with different food recipes on the weekend. Cooking is a creative process for me, and I feel very happy when my family enjoys my dishes."
      ],
      tips: [
        "Đưa ra hoạt động yêu thích chính ngay câu đầu tiên.",
        "Giải thích lý do tại sao bạn thích hoạt động đó.",
        "Đề cập đến tần suất hoặc hoạt động phụ nếu còn thời gian."
      ]
    },
    {
      id: 3,
      questionText: "What is the weather like in your country today?",
      sampleAnswers: [
        "Today the weather is very pleasant and warm. The sky is bright blue and sunny with a light breeze. It is perfect for outdoor activities. Personally, I prefer this type of warm weather over cold, rainy days.",
        "It is currently quite cloudy and cool today. It has been drizzling slightly since morning, which makes the air a bit damp. Most people are staying indoors. I hope the clouds will clear up by this evening."
      ],
      tips: [
        "Mô tả thời tiết hiện tại (nhiệt độ, nắng/mưa, mây).",
        "Nói xem kiểu thời tiết này ảnh hưởng gì đến mọi người (ra ngoài hay ở nhà).",
        "Bày tỏ sở thích thời tiết cá nhân."
      ]
    }
  ];

  const part2Questions: ISpeakingQuestion[] = [
    {
      id: 4,
      questionText: "Describe this picture. Tell me what you can see in the photo.",
      sampleAnswers: [
        "In this picture, I can see a family of three cooking together in a bright, modern kitchen. The parents are smiling warmly at their young son, who is standing between them and helping chop some yellow bell peppers. On the kitchen counter, there are fresh vegetables like tomatoes and lettuce. They all look very happy and are enjoying their family bonding time.",
        "This photo shows a lovely family moment in a cozy kitchen. A couple is preparing a healthy meal with their little son. The mother is holding a bowl, the father is looking at his son with a proud smile, and the boy is busy slicing vegetables. It looks like a clean, well-lit environment, highlighting family teamwork in cooking."
      ],
      tips: [
        "Bắt đầu bằng cái nhìn tổng quan: ai đang làm gì, ở đâu.",
        "Tả chi tiết: hành động (smile, chop, hold), đồ vật (vegetables, counter).",
        "Nhận xét cảm xúc hoặc không khí chung (cozy, happy)."
      ]
    },
    {
      id: 5,
      questionText: "Why do you think it is important for families to cook or eat meals together?",
      sampleAnswers: [
        "I believe cooking and eating together is crucial because it helps strengthen family bonds. In today's busy world, mealtime is one of the few opportunities where family members can sit down, share their daily experiences, and communicate. Moreover, home-cooked meals are generally healthier.",
        "From my perspective, dining together creates a sense of belonging and security for children. It allows parents to listen to their kids' problems and offer guidance. Also, sharing cooking responsibilities teaches teamwork and life skills to younger members."
      ],
      tips: [
        "Đưa ra ý kiến trực tiếp (quan trọng vì giúp gắn kết, chia sẻ).",
        "Mở rộng ý bằng lý do: cuộc sống bận rộn cần thời gian trò chuyện.",
        "Bổ sung khía cạnh sức khỏe (dinh dưỡng tốt hơn)."
      ]
    },
    {
      id: 6,
      questionText: "Tell me about a memorable meal you had with your family.",
      sampleAnswers: [
        "A memorable meal I had was last New Year's Eve at my grandparents' house. My entire family gathered to prepare a traditional feast. We talked, laughed, and recalled happy memories from the past year. It was special because it was the first time in years that all of my cousins and relatives were present.",
        "I remember a dinner we had during our summer vacation in Nha Trang two years ago. We sat at an outdoor restaurant by the beach and ate fresh grilled seafood while listening to the sound of waves. My father told funny jokes from his youth, which made it unforgettable."
      ],
      tips: [
        "Sử dụng thì Quá khứ đơn (quá khứ rõ ràng).",
        "Nêu rõ bối cảnh: ở đâu, khi nào, ăn gì.",
        "Giải thích tại sao bữa ăn đó đáng nhớ (sum họp, vui vẻ)."
      ]
    }
  ];

  const part3Questions: ISpeakingQuestion[] = [
    {
      id: 7,
      questionText: "Compare these two pictures. What are the differences between them?",
      sampleAnswers: [
        "The two pictures show different dining settings. The picture on the left depicts people dining out at a busy restaurant with modern decorations and professional service. In contrast, the picture on the right shows a group preparing food at home in a cozy, intimate kitchen. Eating out looks more formal, while home dining seems warmer and more relaxed.",
        "Both photos relate to eating, but in very different environments. In the first image, a couple is enjoying their dinner at a high-end restaurant, being served by staff. In the second image, a family is actively cooking their own meal in their kitchen. The main difference lies in service and convenience versus personal involvement and home atmosphere."
      ],
      tips: [
        "Bắt đầu bằng điểm chung (đều về ăn uống).",
        "Chỉ ra sự khác biệt lớn: ăn ngoài hàng (phục vụ, trang trọng) vs ăn tại nhà (tự chuẩn bị, ấm cúng).",
        "Sử dụng các từ nối so sánh: 'In contrast', 'On the other hand', 'While'."
      ]
    },
    {
      id: 8,
      questionText: "What are the advantages of eating out at restaurants?",
      sampleAnswers: [
        "One major advantage of eating out is convenience. You don't have to spend time buying ingredients, cooking, or washing dishes, which is ideal for busy people. Additionally, restaurants offer a wide variety of cuisines and dishes that you might not know how to cook at home, and they provide a great social atmosphere.",
        "Dining at restaurants is a fantastic way to socialize and celebrate special events. It offers a change of scenery and lets you try international foods like sushi or pasta. Furthermore, professional service makes the dining experience stress-free and highly enjoyable."
      ],
      tips: [
        "Nêu các ưu điểm chính: tiết kiệm công sức dọn dẹp, đa dạng món ăn.",
        "Nói về khía cạnh xã hội (gặp bạn bè, không gian đẹp).",
        "Dùng trạng từ liên kết: 'Additionally', 'Furthermore'."
      ]
    },
    {
      id: 9,
      questionText: "Why is eating home-cooked food often considered healthier?",
      sampleAnswers: [
        "Eating home-cooked food is healthier because you have complete control over the ingredients. You can choose fresh vegetables, use less oil, salt, and sugar, and avoid artificial preservatives. In contrast, restaurant foods often contain hidden fats and high sodium to enhance flavor, which can be bad for long-term health.",
        "I believe home-cooked meals are much safer and more hygienic. You prepare the food yourself, ensuring clean utensils and proper handling. Also, cooking at home allows you to adjust portion sizes and maintain a balanced diet easily, which is crucial for physical well-being."
      ],
      tips: [
        "Giải thích lý do: kiểm soát được gia vị (dầu mỡ, muối, đường) và nguyên liệu.",
        "So sánh với đồ nhà hàng (nhiều chất béo, bột ngọt).",
        "Đề cập đến vệ sinh an toàn thực phẩm."
      ]
    }
  ];

  const part4Questions: ISpeakingQuestion[] = [
    {
      id: 10,
      questionText: "Tell me about a time you had to make an important decision. What was the decision and why was it important? What was the outcome of your decision?",
      sampleAnswers: [
        "An important decision I had to make was choosing my university major four years ago. I was torn between studying business management, which my parents preferred, and computer science, which was my true passion. It was a crucial decision because it would shape my future career path and lifestyle. In the end, I decided to follow my passion and chose computer science. The outcome has been fantastic; I graduated with honors, recently secured a software engineering job, and I truly enjoy my work every day. This experience taught me that trusting your instincts and pursuing what you love is key to long-term satisfaction."
      ],
      tips: [
        "Luyện tập nháp trong 1 phút chuẩn bị bằng cách viết từ khóa chính.",
        "Cấu trúc bài nói 2 phút: Phần mở đầu giới thiệu quyết định ➔ Phần thân bài kể chi tiết diễn biến & nguyên nhân quan trọng ➔ Phần kết quả (outcome) và bài học rút ra.",
        "Nói liên tục, trôi chảy, sử dụng các từ nối thời gian: 'At first', 'After that', 'Eventually', 'Looking back'."
      ]
    }
  ];

  const renderActiveQuestionContent = () => {
    // PART 1 (Questions 1 - 3)
    if (activeQuestionNum <= 3) {
      const q = part1Questions[activeQuestionNum - 1];
      return (
        <S.QuestionBox $borderColor="#0284c7">
          <div className="q-badge">Câu hỏi {q.id}</div>
          <div className="q-text">{q.questionText}</div>
        </S.QuestionBox>
      );
    }

    // PART 2 (Questions 4 - 6)
    if (activeQuestionNum >= 4 && activeQuestionNum <= 6) {
      const q = part2Questions[activeQuestionNum - 4];
      return (
        <S.SectionColumn>
          <S.ImageWrapper $height="280px">
            <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=60" alt="Family Cooking" />
          </S.ImageWrapper>

          <S.QuestionBox $borderColor="#059669">
            <div className="q-badge">{activeQuestionNum === 4 ? 'Mô tả tranh (Describe)' : 'Câu hỏi mở rộng (Explain)'}</div>
            <div className="q-text">{q.questionText}</div>
          </S.QuestionBox>
        </S.SectionColumn>
      );
    }

    // PART 3 (Questions 7 - 9)
    if (activeQuestionNum >= 7 && activeQuestionNum <= 9) {
      const q = part3Questions[activeQuestionNum - 7];
      return (
        <S.SectionColumn>
          <S.PhotosGrid>
            <S.ImageWrapper $height="200px">
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800" alt="Restaurant dining" />
            </S.ImageWrapper>
            <S.ImageWrapper $height="200px">
              <img src="https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=800" alt="Home dining" />
            </S.ImageWrapper>
          </S.PhotosGrid>

          <S.QuestionBox $borderColor="#d97706">
            <div className="q-badge">{activeQuestionNum === 7 ? 'So sánh tranh (Compare)' : 'Câu hỏi mở rộng (Explain)'}</div>
            <div className="q-text">{q.questionText}</div>
          </S.QuestionBox>
        </S.SectionColumn>
      );
    }

    // PART 4 (Questions 10 - 12)
    if (activeQuestionNum >= 10 && activeQuestionNum <= 12) {
      return (
        <S.QuestionBox $borderColor="#7c3aed">
          <div className="q-badge">Part 4: Thuyết trình dài về chủ đề trừu tượng (Câu 10, 11 & 12)</div>
          <div className="q-text">
            Trả lời 3 câu hỏi sau đây trong một bài thuyết trình hoàn chỉnh:<br /><br />
            10. Tell me about a time you had to make an important decision.<br />
            11. What was the decision and why was it important?<br />
            12. What was the outcome of your decision?
          </div>
        </S.QuestionBox>
      );
    }

    return null;
  };

  const renderActiveQuestionRight = () => {
    // PART 1 (Questions 1 - 3)
    if (activeQuestionNum <= 3) {
      const q = part1Questions[activeQuestionNum - 1];
      const showSample = showSampleMap[q.id] ?? false;
      const sampleIdx = activeSampleIdxMap[q.id] ?? 0;

      return (
        <>
          <SpeakingController 
            prepTime={0}
            recordingTime={30}
            statusColor="#0284c7"
            title={`speak-test-p1-q${q.id}`}
            onCompleted={(url: string | null) => setAnswers(prev => ({ ...prev, [q.id]: url || 'recorded_mock' }))}
          />

          {isSubmitted && (
            <S.CollapsibleWrapper>
              <S.CollapsibleHeader onClick={() => toggleSample(q.id)}>
                <span>
                  <UnlockOutlined style={{ marginRight: '8px', color: '#0284c7' }} /> 
                  Xem đáp án mẫu & Gợi ý
                </span>
                {showSample ? <UpOutlined /> : <DownOutlined />}
              </S.CollapsibleHeader>
              {showSample && (
                <S.CollapsibleBody>
                  <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {q.sampleAnswers.map((_, sIdx) => (
                      <Button 
                        key={sIdx}
                        size="small"
                        type={sampleIdx === sIdx ? "primary" : "default"}
                        onClick={() => setSampleIndex(q.id, sIdx)}
                        style={{ 
                          borderRadius: '12px', 
                          fontSize: '12px',
                          background: sampleIdx === sIdx ? '#0284c7' : undefined,
                          borderColor: sampleIdx === sIdx ? '#0284c7' : undefined,
                        }}
                      >
                        Gợi ý {sIdx + 1}
                      </Button>
                    ))}
                  </div>
                  <Paragraph style={{ fontStyle: 'italic', color: '#334155', lineHeight: 1.6 }}>
                    {q.sampleAnswers[sampleIdx]}
                  </Paragraph>
                  <div style={{ marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                    <strong style={{ color: '#0284c7', fontSize: '0.85rem' }}>Mẹo trả lời:</strong>
                    <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.25rem', fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>
                      {q.tips.map((t, idx) => <li key={idx}>{t}</li>)}
                    </ul>
                  </div>
                </S.CollapsibleBody>
              )}
            </S.CollapsibleWrapper>
          )}
        </>
      );
    }

    // PART 2 (Questions 4 - 6)
    if (activeQuestionNum >= 4 && activeQuestionNum <= 6) {
      const q = part2Questions[activeQuestionNum - 4];
      const showSample = showSampleMap[q.id] ?? false;
      const sampleIdx = activeSampleIdxMap[q.id] ?? 0;

      return (
        <>
          <SpeakingController 
            prepTime={45}
            recordingTime={45}
            statusColor="#059669"
            title={`speak-test-p2-q${q.id}`}
            onCompleted={(url: string | null) => setAnswers(prev => ({ ...prev, [q.id]: url || 'recorded_mock' }))}
          />

          {isSubmitted && (
            <S.CollapsibleWrapper>
              <S.CollapsibleHeader onClick={() => toggleSample(q.id)}>
                <span>
                  <UnlockOutlined style={{ marginRight: '8px', color: '#059669' }} /> 
                  Xem đáp án mẫu & Gợi ý
                </span>
                {showSample ? <UpOutlined /> : <DownOutlined />}
              </S.CollapsibleHeader>
              {showSample && (
                <S.CollapsibleBody>
                  <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {q.sampleAnswers.map((_, sIdx) => (
                      <Button 
                        key={sIdx}
                        size="small"
                        type={sampleIdx === sIdx ? "primary" : "default"}
                        onClick={() => setSampleIndex(q.id, sIdx)}
                        style={{ 
                          borderRadius: '12px', 
                          fontSize: '12px',
                          background: sampleIdx === sIdx ? '#059669' : undefined,
                          borderColor: sampleIdx === sIdx ? '#059669' : undefined,
                        }}
                      >
                        Gợi ý {sIdx + 1}
                      </Button>
                    ))}
                  </div>
                  <Paragraph style={{ fontStyle: 'italic', color: '#334155', lineHeight: 1.6 }}>
                    {q.sampleAnswers[sampleIdx]}
                  </Paragraph>
                  <div style={{ marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                    <strong style={{ color: '#059669', fontSize: '0.85rem' }}>Mẹo trả lời:</strong>
                    <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.25rem', fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>
                      {q.tips.map((t, idx) => <li key={idx}>{t}</li>)}
                    </ul>
                  </div>
                </S.CollapsibleBody>
              )}
            </S.CollapsibleWrapper>
          )}
        </>
      );
    }

    // PART 3 (Questions 7 - 9)
    if (activeQuestionNum >= 7 && activeQuestionNum <= 9) {
      const q = part3Questions[activeQuestionNum - 7];
      const showSample = showSampleMap[q.id] ?? false;
      const sampleIdx = activeSampleIdxMap[q.id] ?? 0;

      return (
        <>
          <SpeakingController 
            prepTime={45}
            recordingTime={45}
            statusColor="#d97706"
            title={`speak-test-p3-q${q.id}`}
            onCompleted={(url: string | null) => setAnswers(prev => ({ ...prev, [q.id]: url || 'recorded_mock' }))}
          />

          {isSubmitted && (
            <S.CollapsibleWrapper>
              <S.CollapsibleHeader onClick={() => toggleSample(q.id)}>
                <span>
                  <UnlockOutlined style={{ marginRight: '8px', color: '#d97706' }} /> 
                  Xem đáp án mẫu & Gợi ý
                </span>
                {showSample ? <UpOutlined /> : <DownOutlined />}
              </S.CollapsibleHeader>
              {showSample && (
                <S.CollapsibleBody>
                  <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {q.sampleAnswers.map((_, sIdx) => (
                      <Button 
                        key={sIdx}
                        size="small"
                        type={sampleIdx === sIdx ? "primary" : "default"}
                        onClick={() => setSampleIndex(q.id, sIdx)}
                        style={{ 
                          borderRadius: '12px', 
                          fontSize: '12px',
                          background: sampleIdx === sIdx ? '#d97706' : undefined,
                          borderColor: sampleIdx === sIdx ? '#d97706' : undefined,
                        }}
                      >
                        Gợi ý {sIdx + 1}
                      </Button>
                    ))}
                  </div>
                  <Paragraph style={{ fontStyle: 'italic', color: '#334155', lineHeight: 1.6 }}>
                    {q.sampleAnswers[sampleIdx]}
                  </Paragraph>
                  <div style={{ marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                    <strong style={{ color: '#d97706', fontSize: '0.85rem' }}>Mẹo trả lời:</strong>
                    <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.25rem', fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>
                      {q.tips.map((t, idx) => <li key={idx}>{t}</li>)}
                    </ul>
                  </div>
                </S.CollapsibleBody>
              )}
            </S.CollapsibleWrapper>
          )}
        </>
      );
    }

    // PART 4 (Questions 10 - 12)
    if (activeQuestionNum >= 10 && activeQuestionNum <= 12) {
      const q = part4Questions[0];
      const showSample = showSampleMap[q.id] ?? false;

      return (
        <>
          <SpeakingController 
            prepTime={60}
            recordingTime={120}
            statusColor="#7c3aed"
            title={`speak-test-p4-q10`}
            onCompleted={(url: string | null) => {
              setAnswers(prev => ({ 
                ...prev, 
                [10]: url || 'recorded_mock',
                [11]: url || 'recorded_mock',
                [12]: url || 'recorded_mock'
              }));
            }}
          />

          {isSubmitted && (
            <S.CollapsibleWrapper>
              <S.CollapsibleHeader onClick={() => toggleSample(q.id)}>
                <span>
                  <UnlockOutlined style={{ marginRight: '8px', color: '#7c3aed' }} /> 
                  Xem đáp án mẫu & Gợi ý
                </span>
                {showSample ? <UpOutlined /> : <DownOutlined />}
              </S.CollapsibleHeader>
              {showSample && (
                <S.CollapsibleBody>
                  <Paragraph style={{ fontStyle: 'italic', color: '#334155', lineHeight: 1.6 }}>
                    {q.sampleAnswers[0]}
                  </Paragraph>
                  <div style={{ marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                    <strong style={{ color: '#7c3aed', fontSize: '0.85rem' }}>Mẹo trả lời:</strong>
                    <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.25rem', fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>
                      {q.tips.map((t, idx) => <li key={idx}>{t}</li>)}
                    </ul>
                  </div>
                </S.CollapsibleBody>
              )}
            </S.CollapsibleWrapper>
          )}
        </>
      );
    }

    return null;
  };

  const renderQuestionNav = () => {
    const getStatus = (qNum: number): 'unanswered' | 'answered' => {
      return answers[qNum] ? 'answered' : 'unanswered';
    };

    const renderGridButtons = (qNums: number[]) => {
      return (
        <S.ButtonGrid>
          {qNums.map((n) => {
            const status = getStatus(n);
            const isActive = activeQuestionNum === n;

            let placement: 'top' | 'topRight' | 'topLeft' = 'top';
            if (n % 4 === 1) {
              placement = 'topRight';
            } else if (n % 4 === 0) {
              placement = 'topLeft';
            }

            return (
              <Tooltip
                key={n}
                title={`Câu ${n}: ${status === 'answered' ? 'Đã thu âm' : 'Chưa thu âm'}`}
                placement={placement}
                mouseEnterDelay={0.15}
              >
                <S.NavGridButton
                  $active={isActive}
                  $status={status}
                  onClick={() => handleNavigateQuestion(n)}
                >
                  {n}
                </S.NavGridButton>
              </Tooltip>
            );
          })}
        </S.ButtonGrid>
      );
    };

    return (
      <S.NavPanel>
        <S.PanelTitle>Bảng câu hỏi</S.PanelTitle>
        
        <S.SectionLabel>Part 1: Cá nhân (1 - 3)</S.SectionLabel>
        {renderGridButtons([1, 2, 3])}

        <S.SectionLabel>Part 2: Miêu tả (4 - 6)</S.SectionLabel>
        {renderGridButtons([4, 5, 6])}

        <S.SectionLabel>Part 3: So sánh (7 - 9)</S.SectionLabel>
        {renderGridButtons([7, 8, 9])}

        <S.SectionLabel>Part 4: Thuyết trình (10 - 12)</S.SectionLabel>
        {renderGridButtons([10, 11, 12])}

        <S.Legend>
          <S.LegendItem>
            <div className="color-dot" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1' }} />
            <span>Chưa thu âm</span>
          </S.LegendItem>
          <S.LegendItem>
            <div className="color-dot" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }} />
            <span>Đã ghi âm</span>
          </S.LegendItem>
          <S.LegendItem>
            <div className="color-dot" style={{ background: 'white', border: '1.5px solid #00205B' }} />
            <span>Đang chọn</span>
          </S.LegendItem>
        </S.Legend>
      </S.NavPanel>
    );
  };

  const getPartTitleAndInstruction = () => {
    switch (activePart) {
      case 1:
        return {
          title: 'Trả lời 3 câu hỏi ngắn về bản thân',
          subtitle: `Speaking Part 1 • Question ${activeQuestionNum} of 3`
        };
      case 2:
        return {
          title: 'Miêu tả tranh và trả lời 2 câu hỏi',
          subtitle: 'Speaking Part 2 • 3 Questions'
        };
      case 3:
        return {
          title: 'So sánh hai bức tranh và trả lời câu hỏi',
          subtitle: 'Speaking Part 3 • 3 Questions'
        };
      case 4:
      default:
        return {
          title: 'Trả lời liên tục 3 câu hỏi về chủ đề',
          subtitle: 'Speaking Part 4 • Abstract Topic'
        };
    }
  };

  const { title: partTitle, subtitle: partSubtitle } = getPartTitleAndInstruction();

  return (
    <HomeS.MainLayout>
      <Sidebar />
      <HomeS.RightColumn>
        <S.PageContainer>
          <S.Header>
            <Space size="large">
              <Button
                type="text"
                icon={<LeftOutlined />}
                onClick={handleBackToLanding}
                style={{ color: '#cbd5e1', fontWeight: 'bold' }}
              >
                Quay lại
              </Button>
              <S.HeaderTitle>
                {testTitle} • {activePart === 1 ? 'Part 1: Personal Information' : activePart === 2 ? 'Part 2: Describe, Express Opinion & Explain' : activePart === 3 ? 'Part 3: Compare & Provide Reasons' : 'Part 4: Abstract Topic (Band B2 Decisive)'}
              </S.HeaderTitle>
            </Space>

            <Space size="large" style={{ display: 'flex', alignItems: 'center' }}>
              {isSubmitted ? (
                <Space>
                  <Button
                    type="primary"
                    onClick={() => setShowReport(true)}
                    style={{ background: '#00205B', borderColor: '#00205B', borderRadius: '2rem', fontWeight: 700 }}
                  >
                    Xem báo cáo điểm
                  </Button>
                  <Button 
                    type="primary" 
                    icon={<RollbackOutlined />}
                    onClick={handleRetry}
                    style={{ background: '#6366f1', borderColor: '#6366f1', borderRadius: '2rem', fontWeight: 700 }}
                  >
                    Thi lại đề này
                  </Button>
                </Space>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 700 }}>TIẾN ĐỘ:</span>
                    <Progress
                      type="circle"
                      percent={Math.round(answeredCount / totalQuestions * 100)}
                      size={40}
                      strokeColor="#10b981"
                      trailColor="rgba(255,255,255,0.2)"
                      format={() => (
                        <span style={{ color: 'white', fontSize: '11px', fontWeight: 'bold' }}>
                          {answeredCount}/12
                        </span>
                      )}
                    />
                  </div>

                  <S.TimerWrapper>
                    <ClockCircleOutlined style={{ color: '#fbbf24', marginRight: '4px' }} />
                    {formatTime(timeLeft)}
                  </S.TimerWrapper>
                </>
              )}
            </Space>
          </S.Header>

          {isSubmitted && showReport ? (
            <S.ReportContainer>
              <S.ReportCard>
                <Space direction="vertical" size="small" style={{ marginBottom: '1.5rem' }}>
                  <Title level={2} style={{ color: '#00205B', margin: 0 }}>Kết quả làm bài thi Nói</Title>
                  <Text type="secondary" style={{ fontSize: '1rem', fontWeight: 500 }}>
                    Bạn đã hoàn thành {testTitle} kỹ năng Nói
                  </Text>
                </Space>

                <S.ScoreRingWrapper>
                  <Progress 
                    type="circle" 
                    percent={100} 
                    size={140}
                    strokeWidth={10}
                    strokeColor="#10b981"
                    format={() => (
                      <S.ScoreLabel>
                        <span className="score-val" style={{ fontSize: '1.6rem', color: '#10b981' }}>HOÀN THÀNH</span>
                        <span className="score-max">{answeredCount}/12 câu ghi âm</span>
                      </S.ScoreLabel>
                    )}
                  />
                </S.ScoreRingWrapper>

                <S.ReportGrid>
                  <S.ReportStatItem>
                    <span className="stat-label">Số câu trả lời ghi âm</span>
                    <span className="stat-value">{answeredCount} / 12 câu</span>
                  </S.ReportStatItem>
                  <S.ReportStatItem>
                    <span className="stat-label">Tổng thời gian làm bài</span>
                    <span className="stat-value">{formatTime(20 * 60 - timeLeft)}</span>
                  </S.ReportStatItem>
                </S.ReportGrid>

                <div style={{ width: '100%', textAlign: 'left', background: '#f8fafc', padding: '1.25rem 1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '6px', color: '#00205B', fontWeight: 700 }}>
                    <AlertOutlined /> <span>Lưu ý về tự đánh giá bài Nói:</span>
                  </div>
                  <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>
                    Bài thi Nói là phần thi tự luận được ghi âm trực tiếp. Hãy bấm nút dưới đây để chuyển sang **Chế độ xem lại**, nghe lại bài nói của chính mình và đối chiếu trực tiếp với **Gợi ý đáp án mẫu** của giáo viên và **Mẹo chấm điểm (Tips)** tương ứng từng câu để tự đánh giá mức độ lưu loát, từ vựng và ngữ pháp của bản thân.
                  </p>
                </div>

                <Button 
                  type="primary" 
                  size="large"
                  style={{ borderRadius: '2rem', height: '48px', padding: '0 2.5rem', fontWeight: 700, background: '#00205B', borderColor: '#00205B' }}
                  onClick={() => setShowReport(false)}
                >
                  Xem lại chi tiết bài nói & Đáp án mẫu
                </Button>
              </S.ReportCard>
            </S.ReportContainer>
          ) : (
            <>
              <S.ContentBody style={{ overflowY: 'auto' }}>
                <S.WorkspaceGrid>
                  <S.ContentGrid>
                    <S.LeftColumn>
                      <S.ContentCard>
                        <S.TitleArea>
                          <h2>{partTitle}</h2>
                          <div className="subtitle">{partSubtitle}</div>
                        </S.TitleArea>

                        {activePart === 1 && (
                          <S.SubTabContainer>
                            {[1, 2, 3].map((num) => (
                              <S.SubTab
                                key={num}
                                $active={activeQuestionNum === num}
                                $color="#0284c7"
                                onClick={() => handleNavigateQuestion(num)}
                              >
                                Câu {num} {answers[num] ? '✓' : ''}
                              </S.SubTab>
                            ))}
                          </S.SubTabContainer>
                        )}

                        {activePart === 2 && (
                          <S.SubTabContainer>
                            {[4, 5, 6].map((num) => (
                              <S.SubTab
                                key={num}
                                $active={activeQuestionNum === num}
                                $color="#059669"
                                onClick={() => handleNavigateQuestion(num)}
                              >
                                Câu {num - 3} {answers[num] ? '✓' : ''}
                              </S.SubTab>
                            ))}
                          </S.SubTabContainer>
                        )}

                        {activePart === 3 && (
                          <S.SubTabContainer>
                            {[7, 8, 9].map((num) => (
                              <S.SubTab
                                key={num}
                                $active={activeQuestionNum === num}
                                $color="#d97706"
                                onClick={() => handleNavigateQuestion(num)}
                              >
                                Câu {num - 6} {answers[num] ? '✓' : ''}
                              </S.SubTab>
                            ))}
                          </S.SubTabContainer>
                        )}

                        {renderActiveQuestionContent()}
                      </S.ContentCard>
                    </S.LeftColumn>

                    <S.RightColumn>
                      {renderActiveQuestionRight()}
                    </S.RightColumn>
                  </S.ContentGrid>
                </S.WorkspaceGrid>
              </S.ContentBody>

              <S.Footer>
                <Button
                  type="default"
                  icon={<ArrowLeftOutlined />}
                  size="large"
                  style={{ borderRadius: '2rem', fontWeight: 600, padding: '0 1.5rem', border: '1px solid #e2e8f0', color: '#64748b' }}
                  onClick={handlePrevQuestion}
                  disabled={activePart === 1}
                >
                  Phần trước
                </Button>

                <span style={{ fontWeight: 700, color: '#475569', fontSize: '0.95rem' }}>
                  Phần {activePart} trên 4 (Câu {activeQuestionNum} / 12)
                </span>

                <Space size="middle">
                  {!isSubmitted && (
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
                      onClick={handleSubmitClick}
                    >
                      Nộp bài
                    </Button>
                  )}
                  {isSubmitted && (
                    <Button
                      type="default"
                      icon={<RollbackOutlined />}
                      size="large"
                      style={{ borderRadius: '2rem', fontWeight: 600, padding: '0 1.5rem', border: '1px solid #cbd5e1' }}
                      onClick={() => navigate({ to: '/speaking' })}
                    >
                      Thoát xem lại
                    </Button>
                  )}
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
                    onClick={handleNextQuestion}
                    disabled={activePart === 4}
                  >
                    Phần tiếp theo <ArrowRightOutlined style={{ fontSize: '12px' }} />
                  </Button>
                </Space>
              </S.Footer>
            </>
          )}
        </S.PageContainer>
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default SpeakingMockTestPage;
