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
import * as S from '../styles/styled';

const { Title, Text, Paragraph } = Typography;

interface IWritingQuestion {
  id: number;
  questionText: string;
  minWords: number;
  maxWords: number;
  sampleAnswers: string[];
  tips: string[];
}

export const WritingMockTestPage: React.FC = () => {
  const { testId } = useParams({ strict: false }) as { testId: string };
  const navigate = useNavigate();

  const testTitle = testId === 'm2' ? 'Đề Viết số 2' : testId === 'm3' ? 'Đề Viết số 3' : 'Đề Viết số 1';
  const totalQuestions = 11;

  // Answers state: Q1 - Q11
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(50 * 60); // 50 minutes in seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // Collapsible sample answers state per question
  const [showSampleMap, setShowSampleMap] = useState<Record<number, boolean>>({});
  const [activeSampleIdxMap, setActiveSampleIdxMap] = useState<Record<number, number>>({});

  // Active question number (1 to 11)
  const [activeQuestionNum, setActiveQuestionNum] = useState<number>(1);
  const activePart = activeQuestionNum <= 5 ? 1 : activeQuestionNum === 6 ? 2 : activeQuestionNum <= 9 ? 3 : 4;

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

  const getWordCount = (text: string) => {
    if (!text || !text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

  const isWordCountValid = (text: string, min: number, max: number) => {
    const count = getWordCount(text);
    return count >= min && count <= max;
  };

  const answeredCount = Object.keys(answers).filter(k => answers[Number(k)] && answers[Number(k)].trim()).length;

  const handleAutoSubmit = () => {
    setIsSubmitted(true);
    setShowReport(true);
    message.warning('Đã hết thời gian làm bài! Hệ thống tự động nộp bài.');
    saveProgressToLocalStorage();
  };

  const handleManualSubmit = () => {
    setIsSubmitted(true);
    setShowReport(true);
    message.success('Bạn đã nộp bài thi viết thành công!');
    saveProgressToLocalStorage();
  };

  const saveProgressToLocalStorage = () => {
    const saved = localStorage.getItem('aptis_writing_mock_progress');
    let progressObj: Record<string, number> = {};
    if (saved) {
      try {
        progressObj = JSON.parse(saved);
      } catch (e) {}
    }
    // Since writing is self-evaluated, we save completed status as 100
    progressObj[testId] = 100;
    localStorage.setItem('aptis_writing_mock_progress', JSON.stringify(progressObj));
  };

  const handleRetry = () => {
    setAnswers({});
    setTimeLeft(50 * 60);
    setIsSubmitted(false);
    setShowReport(false);
    setActiveQuestionNum(1);
    setShowSampleMap({});
    setActiveSampleIdxMap({});
  };

  const handleBackToLanding = () => {
    if (isSubmitted) {
      navigate({ to: '/writing' });
      return;
    }
    Modal.confirm({
      title: 'Xác nhận thoát khỏi đề thi?',
      icon: <AlertOutlined style={{ color: '#faad14' }} />,
      content: 'Tiến độ làm bài viết của bạn sẽ không được lưu nếu bạn thoát ra lúc này.',
      okText: 'Thoát ra',
      cancelText: 'Làm tiếp',
      onOk: () => {
        navigate({ to: '/writing' });
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
      handleNavigateQuestion(6);
    } else if (activePart === 4) {
      handleNavigateQuestion(7);
    }
  };

  const handleNextQuestion = () => {
    if (activePart === 1) {
      handleNavigateQuestion(6);
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
      title: 'Xác nhận nộp bài thi viết?',
      icon: <CheckCircleOutlined style={{ color: '#10b981' }} />,
      content: hasUnanswered
        ? `Bạn còn ${unansweredCount} câu hỏi chưa hoàn thành câu trả lời. Bạn có thực sự muốn nộp bài viết ngay bây giờ không?`
        : 'Bạn đã hoàn thành viết đầy đủ 11 câu hỏi. Bạn có chắc chắn muốn nộp bài viết để xem đáp án mẫu không?',
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
  const part1Questions: IWritingQuestion[] = [
    {
      id: 1,
      questionText: "What is your job?",
      minWords: 1,
      maxWords: 5,
      sampleAnswers: [
        "I am a software developer.",
        "I study business at university.",
        "I work as an architect."
      ],
      tips: [
        "Đảm bảo số từ trong khoảng quy định (1-5 từ).",
        "Bắt đầu bằng chữ cái viết hoa và kết thúc bằng dấu chấm.",
        "Dùng cấu trúc đơn giản như 'I am a [job]'."
      ]
    },
    {
      id: 2,
      questionText: "What is your favorite camera type?",
      minWords: 1,
      maxWords: 5,
      sampleAnswers: [
        "I prefer mirrorless digital cameras.",
        "My favorite is film camera.",
        "I love DSLR cameras."
      ],
      tips: [
        "Chỉ viết câu trả lời ngắn gọn (1-5 từ).",
        "Tránh viết quá dài hoặc dùng mệnh đề phức tạp."
      ]
    },
    {
      id: 3,
      questionText: "What do you like to photograph?",
      minWords: 1,
      maxWords: 5,
      sampleAnswers: [
        "I love photographing natural landscapes.",
        "I enjoy taking street portraits.",
        "I like shooting city streets."
      ],
      tips: [
        "Trả lời trực diện chủ đề nhiếp ảnh yêu thích (landscape, portraits, street).",
        "Chú ý viết hoa chữ cái đầu câu."
      ]
    },
    {
      id: 4,
      questionText: "Where do you live?",
      minWords: 1,
      maxWords: 5,
      sampleAnswers: [
        "I live in Hanoi, Vietnam.",
        "I reside in Da Nang.",
        "My home is in Saigon."
      ],
      tips: [
        "Nêu tên thành phố hoặc quốc gia bạn đang sống.",
        "Chỉ viết tối đa 5 từ."
      ]
    },
    {
      id: 5,
      questionText: "How often do you take photos?",
      minWords: 1,
      maxWords: 5,
      sampleAnswers: [
        "I take photos every weekend.",
        "I shoot pictures daily.",
        "Occasionally, about twice a week."
      ],
      tips: [
        "Nêu tần suất chụp ảnh bằng trạng từ ngắn (daily, weekly, every weekend).",
        "Đếm kỹ số từ trước khi hoàn thành."
      ]
    }
  ];

  const part2Question: IWritingQuestion = {
    id: 6,
    questionText: "Please tell us why you are interested in photography and when you first started.",
    minWords: 20,
    maxWords: 30,
    sampleAnswers: [
      "I have been interested in photography since high school when my dad gave me a camera. I love it because it allows me to capture and preserve beautiful family moments.",
      "I became fascinated by photography two years ago. I enjoy capturing the beauty of nature and street landscapes. It helps me express my personal creativity and relax after work."
    ],
    tips: [
      "Câu trả lời bắt buộc phải nằm trong giới hạn từ 20 đến 30 từ.",
      "Trả lời cả hai ý: Lý do thích (Why) và thời điểm bắt đầu (When).",
      "Sử dụng các thì Hiện tại hoàn thành để diễn đạt thời gian bắt đầu học."
    ]
  };

  const part3Questions: IWritingQuestion[] = [
    {
      id: 7,
      questionText: "Welcome! Tell us about your last holiday. Where did you go and did you take any photos?",
      minWords: 30,
      maxWords: 40,
      sampleAnswers: [
        "Last summer, I spent a week visiting Da Nang. I took hundreds of photographs of the beautiful beaches and local food. The scenery was stunning, making it a perfect trip for landscape photography.",
        "My last holiday was in Sa Pa. I went trekking with my close friends and captured many pictures of the terrace fields and minority villages. The weather was perfect and the photos turned out amazing."
      ],
      tips: [
        "Viết trong giới hạn từ 30 đến 40 từ.",
        "Nêu địa điểm của kỳ nghỉ gần nhất và xác nhận có chụp ảnh hay không.",
        "Sử dụng thì Quá khứ đơn."
      ]
    },
    {
      id: 8,
      questionText: "I want to buy a new camera lens but they are very expensive. What do you think I should do?",
      minWords: 30,
      maxWords: 40,
      sampleAnswers: [
        "Since new lenses are costly, I recommend looking for a high-quality second-hand lens from reputable stores. Alternatively, you could rent the lens first to test it before making a major financial decision.",
        "You should consider saving money or purchasing a third-party brand lens, which is often much cheaper than official ones. Another good option is to trade in your old equipment to get a discount."
      ],
      tips: [
        "Nêu ý kiến đề xuất giải pháp (mua cũ, thuê trước, hoặc mua hãng thứ ba).",
        "Đảm bảo câu văn mạch lạc, từ vựng chuẩn xác trong phạm vi 30-40 từ.",
        "Sử dụng các cấu trúc gợi ý: 'I recommend...', 'You should consider...'."
      ]
    },
    {
      id: 9,
      questionText: "Many members think digital cameras are better than mobile phones for photography. What is your opinion?",
      minWords: 30,
      maxWords: 40,
      sampleAnswers: [
        "In my opinion, digital cameras are superior because they offer larger sensors and optical zoom. However, mobile phones are extremely convenient for daily snapshots. It depends on whether you value image quality or portability.",
        "I agree that digital cameras deliver better image details and control. Nevertheless, smartphone cameras have improved rapidly and are perfect for beginners who don't want to carry heavy, expensive camera gear around."
      ],
      tips: [
        "Nêu rõ quan điểm cá nhân đồng ý hay phản đối (chọn máy ảnh vì chất lượng hay điện thoại vì tiện lợi).",
        "Sử dụng từ nối chuyển ý phản bác: 'However', 'Nevertheless', 'On the other hand'.",
        "Viết đúng 30-40 từ."
      ]
    }
  ];

  const part4Questions: IWritingQuestion[] = [
    {
      id: 10,
      questionText: "Write an email to a friend who is also a club member. Tell them about the change (cancelling the weekend exhibition and holding it online) and say what you think. Write about 50 words.",
      minWords: 40,
      maxWords: 60,
      sampleAnswers: [
        "Hi John,\n\nDid you hear about the exhibition change? The club cancelled the weekend physical event and moved it online instead. Honestly, I'm quite disappointed because I wanted to meet everyone in person. However, doing it online is still better than cancelling completely. What do you think about this?\n\nBest,\nDavid"
      ],
      tips: [
        "Dùng văn phong thân mật (Informal email): Chào hỏi bằng 'Hi [Name]', kết bằng 'Best', 'Cheers' hoặc 'Write back soon'.",
        "Viết ngắn gọn, trực diện, thể hiện cảm xúc cá nhân (disappointed, surprised).",
        "Giữ độ dài câu viết khoảng 40 - 60 từ (mục tiêu ~50 từ)."
      ]
    },
    {
      id: 11,
      questionText: "Write an email to the president of the club. Express your disappointment with the decision and suggest alternative ideas for future exhibitions. Write 120-150 words.",
      minWords: 120,
      maxWords: 150,
      sampleAnswers: [
        "Dear Mr. President,\n\nI am writing to express my disappointment regarding the recent announcement that our upcoming weekend photography exhibition has been cancelled and moved online.\n\nWhile I understand the decision was made due to low registration numbers, many members, including myself, had spent weeks preparing their print photographs. A virtual exhibition, although convenient, cannot replicate the networking experience and high-fidelity viewing of a physical gallery event.\n\nFor future events, I would like to suggest organizing joint exhibitions with other local art groups to increase participation. Additionally, the club could promote exhibitions on social media platforms earlier to attract more public visitors.\n\nI hope you will consider these recommendations to ensure our upcoming events are successful.\n\nYours sincerely,\nDavid Miller"
      ],
      tips: [
        "Dùng văn phong trang trọng (Formal letter): Bắt đầu bằng 'Dear [Name/Title]', kết bằng 'Yours sincerely' hoặc 'Yours faithfully'.",
        "Bố cục thư rõ ràng: Nêu mục đích viết thư ➔ Trình bày sự thất vọng một cách lịch sự ➔ Đưa ra gợi ý giải pháp cải thiện cụ thể ➔ Lời chào trang trọng.",
        "Sử dụng các cấu trúc trang trọng: 'I am writing to...', 'I would like to suggest...', 'I look forward to hearing from you'.",
        "Đếm kỹ từ đảm bảo nằm đúng trong giới hạn 120 - 150 từ."
      ]
    }
  ];

  const renderActiveQuestionContent = () => {
    // PART 1 (Questions 1 - 5)
    if (activeQuestionNum <= 5) {
      return (
        <S.SectionColumn>
          <S.InstructionBox $borderColor="#0284c7">
            <strong>Part 1: Word-level Writing.</strong> Điền thông tin vào biểu mẫu đăng ký Photography Club. Trả lời các câu hỏi bằng câu ngắn từ 1 đến 5 từ.
          </S.InstructionBox>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {part1Questions.map((q) => {
              const answer = answers[q.id] || '';
              const wordCount = getWordCount(answer);
              const isValid = isWordCountValid(answer, q.minWords, q.maxWords);
              const showSample = showSampleMap[q.id] ?? false;
              const sampleIdx = activeSampleIdxMap[q.id] ?? 0;

              return (
                <S.FormQuestionItem key={q.id}>
                  <S.QuestionLabel>{q.id}. {q.questionText}</S.QuestionLabel>
                  <S.ModernInput 
                    placeholder="Type your answer here..."
                    value={answer}
                    onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    $isValid={isValid}
                    $hasText={!!answer}
                    disabled={isSubmitted}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                    <div>
                      {answer && !isValid && (
                        <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>
                          Câu trả lời phải từ 1 đến 5 từ.
                        </span>
                      )}
                    </div>
                    {answer && (
                      <S.WordCountBadge $isValid={isValid} $hasText={!!answer}>
                        {wordCount} / 5 từ
                      </S.WordCountBadge>
                    )}
                  </div>

                  {isSubmitted && (
                    <S.CollapsibleWrapper>
                      <S.CollapsibleHeader onClick={() => toggleSample(q.id)}>
                        <span>
                          <UnlockOutlined style={{ marginRight: '8px', color: '#0284c7' }} /> 
                          Gợi ý đáp án mẫu & Mẹo
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
                            &rarr; {q.sampleAnswers[sampleIdx]}
                          </Paragraph>
                          <div style={{ marginTop: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem' }}>
                            <strong style={{ color: '#0284c7', fontSize: '0.85rem' }}>Tips:</strong>
                            <ul style={{ margin: '0.25rem 0 0 0', paddingLeft: '1.25rem', fontSize: '0.9rem', color: '#475569' }}>
                              {q.tips.map((t, idx) => <li key={idx}>{t}</li>)}
                            </ul>
                          </div>
                        </S.CollapsibleBody>
                      )}
                    </S.CollapsibleWrapper>
                  )}
                </S.FormQuestionItem>
              );
            })}
          </div>
        </S.SectionColumn>
      );
    }

    // PART 2 (Question 6)
    if (activeQuestionNum === 6) {
      const q = part2Question;
      const answer = answers[6] || '';
      const wordCount = getWordCount(answer);
      const isValid = isWordCountValid(answer, q.minWords, q.maxWords);
      const showSample = showSampleMap[6] ?? false;
      const sampleIdx = activeSampleIdxMap[6] ?? 0;

      return (
        <S.SectionColumn>
          <S.InstructionBox $borderColor="#059669">
            <strong>Part 2: Forum Post.</strong> Viết một bài viết ngắn lên diễn đàn Photography Club. Bạn phải viết từ 20 đến 30 từ.
          </S.InstructionBox>

          <S.FormQuestionItem>
            <S.QuestionLabel>{q.questionText}</S.QuestionLabel>
            <S.ModernTextArea 
              placeholder="Write your post here (20-30 words)..."
              value={answer}
              onChange={(e) => setAnswers(prev => ({ ...prev, [6]: e.target.value }))}
              $isValid={isValid}
              $hasText={!!answer}
              disabled={isSubmitted}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
              <div>
                {answer && !isValid && (
                  <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>
                    Độ dài không hợp lệ (Phải viết từ 20 đến 30 từ).
                  </span>
                )}
              </div>
              <S.WordCountBadge $isValid={isValid} $hasText={!!answer}>
                {wordCount} / 20-30 từ
              </S.WordCountBadge>
            </div>

            {isSubmitted && (
              <S.CollapsibleWrapper>
                <S.CollapsibleHeader onClick={() => toggleSample(6)}>
                  <span>
                    <UnlockOutlined style={{ marginRight: '8px', color: '#059669' }} /> 
                    Gợi ý đáp án mẫu & Mẹo
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
                          onClick={() => setSampleIndex(6, sIdx)}
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
                    <div style={{ marginTop: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem' }}>
                      <strong style={{ color: '#059669', fontSize: '0.85rem' }}>Tips:</strong>
                      <ul style={{ margin: '0.25rem 0 0 0', paddingLeft: '1.25rem', fontSize: '0.9rem', color: '#475569' }}>
                        {q.tips.map((t, idx) => <li key={idx}>{t}</li>)}
                      </ul>
                    </div>
                  </S.CollapsibleBody>
                )}
              </S.CollapsibleWrapper>
            )}
          </S.FormQuestionItem>
        </S.SectionColumn>
      );
    }

    // PART 3 (Questions 7 - 9)
    if (activeQuestionNum >= 7 && activeQuestionNum <= 9) {
      return (
        <S.SectionColumn>
          <S.InstructionBox $borderColor="#d97706">
            <strong>Part 3: Social Club Chat Room.</strong> Bạn đang nói chuyện trong phòng chat với các thành viên khác. Trả lời 3 câu hỏi của họ, mỗi câu trả lời viết từ 30 đến 40 từ.
          </S.InstructionBox>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {part3Questions.map((q) => {
              const answer = answers[q.id] || '';
              const wordCount = getWordCount(answer);
              const isValid = isWordCountValid(answer, q.minWords, q.maxWords);
              const showSample = showSampleMap[q.id] ?? false;
              const sampleIdx = activeSampleIdxMap[q.id] ?? 0;

              return (
                <S.FormQuestionItem key={q.id}>
                  <S.QuestionLabel>{q.questionText}</S.QuestionLabel>
                  <S.ModernTextArea 
                    placeholder="Write your chat response here (30-40 words)..."
                    value={answer}
                    onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    $isValid={isValid}
                    $hasText={!!answer}
                    style={{ height: '7rem' }}
                    disabled={isSubmitted}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                    <div>
                      {answer && !isValid && (
                        <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>
                          Độ dài không hợp lệ (Phải viết từ 30 đến 40 từ).
                        </span>
                      )}
                    </div>
                    <S.WordCountBadge $isValid={isValid} $hasText={!!answer}>
                      {wordCount} / 30-40 từ
                    </S.WordCountBadge>
                  </div>

                  {isSubmitted && (
                    <S.CollapsibleWrapper>
                      <S.CollapsibleHeader onClick={() => toggleSample(q.id)}>
                        <span>
                          <UnlockOutlined style={{ marginRight: '8px', color: '#d97706' }} /> 
                          Gợi ý đáp án mẫu & Mẹo
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
                          <div style={{ marginTop: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem' }}>
                            <strong style={{ color: '#d97706', fontSize: '0.85rem' }}>Tips:</strong>
                            <ul style={{ margin: '0.25rem 0 0 0', paddingLeft: '1.25rem', fontSize: '0.9rem', color: '#475569' }}>
                              {q.tips.map((t, idx) => <li key={idx}>{t}</li>)}
                            </ul>
                          </div>
                        </S.CollapsibleBody>
                      )}
                    </S.CollapsibleWrapper>
                  )}
                </S.FormQuestionItem>
              );
            })}
          </div>
        </S.SectionColumn>
      );
    }

    // PART 4 (Questions 10 - 11)
    if (activeQuestionNum >= 10 && activeQuestionNum <= 11) {
      const isInformal = activeQuestionNum === 10;
      const q = isInformal ? part4Questions[0] : part4Questions[1];
      const answer = answers[q.id] || '';
      const wordCount = getWordCount(answer);
      const isValid = isWordCountValid(answer, q.minWords, q.maxWords);
      const showSample = showSampleMap[q.id] ?? false;

      return (
        <S.SectionColumn>
          <S.InstructionBox $borderColor="#7c3aed">
            <strong>Part 4: Email Writing.</strong> Nhận được thông báo từ Photography Club: <i>Hủy bỏ triển lãm trực tiếp vào cuối tuần và chuyển sang tổ chức trực tuyến do số lượng đăng ký tham gia thấp.</i>
          </S.InstructionBox>

          <S.FormQuestionItem>
            <S.QuestionLabel>
              {isInformal 
                ? 'Câu 10: Viết email cho một người bạn (Khoảng 50 từ - Informal)' 
                : 'Câu 11: Viết email cho chủ tịch câu lạc bộ (120 - 150 từ - Formal)'}
            </S.QuestionLabel>
            <Paragraph style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '1rem', fontStyle: 'italic' }}>
              {q.questionText}
            </Paragraph>
            <S.ModernTextArea 
              placeholder={isInformal ? "Write informal email to a friend (40-60 words)..." : "Write formal email to the president (120-150 words)..."}
              value={answer}
              onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
              $isValid={isValid}
              $hasText={!!answer}
              style={{ height: isInformal ? '10rem' : '16rem' }}
              disabled={isSubmitted}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
              <div>
                {answer && !isValid && (
                  <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>
                    Số lượng từ không đúng yêu cầu (Yêu cầu: {q.minWords} - {q.maxWords} từ).
                  </span>
                )}
              </div>
              <S.WordCountBadge $isValid={isValid} $hasText={!!answer}>
                {wordCount} / {q.minWords}-{q.maxWords} từ
              </S.WordCountBadge>
            </div>

            {isSubmitted && (
              <S.CollapsibleWrapper>
                <S.CollapsibleHeader onClick={() => toggleSample(q.id)}>
                  <span>
                    <UnlockOutlined style={{ marginRight: '8px', color: '#7c3aed' }} /> 
                    Gợi ý đáp án mẫu & Mẹo
                  </span>
                  {showSample ? <UpOutlined /> : <DownOutlined />}
                </S.CollapsibleHeader>
                {showSample && (
                  <S.CollapsibleBody>
                    <Paragraph style={{ whiteSpace: 'pre-line', color: '#334155', lineHeight: 1.6 }}>
                      {q.sampleAnswers[0]}
                    </Paragraph>
                    <div style={{ marginTop: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem' }}>
                      <strong style={{ color: '#7c3aed', fontSize: '0.85rem' }}>Tips:</strong>
                      <ul style={{ margin: '0.25rem 0 0 0', paddingLeft: '1.25rem', fontSize: '0.9rem', color: '#475569' }}>
                        {q.tips.map((t, idx) => <li key={idx}>{t}</li>)}
                      </ul>
                    </div>
                  </S.CollapsibleBody>
                )}
              </S.CollapsibleWrapper>
            )}
          </S.FormQuestionItem>
        </S.SectionColumn>
      );
    }

    return null;
  };

  const renderQuestionNav = () => {
    const getStatus = (qNum: number): 'unanswered' | 'answered' => {
      return answers[qNum] && answers[qNum].trim() ? 'answered' : 'unanswered';
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
                title={`Câu ${n}: ${status === 'answered' ? 'Đã viết' : 'Chưa viết'}`}
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
        
        <S.SectionLabel>Part 1: Điền Form (1 - 5)</S.SectionLabel>
        {renderGridButtons([1, 2, 3, 4, 5])}

        <S.SectionLabel>Part 2: Forum (6)</S.SectionLabel>
        {renderGridButtons([6])}

        <S.SectionLabel>Part 3: Chat Room (7 - 9)</S.SectionLabel>
        {renderGridButtons([7, 8, 9])}

        <S.SectionLabel>Part 4: Thư điện tử (10 - 11)</S.SectionLabel>
        {renderGridButtons([10, 11])}

        <S.Legend>
          <S.LegendItem>
            <div className="color-dot" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1' }} />
            <span>Chưa viết</span>
          </S.LegendItem>
          <S.LegendItem>
            <div className="color-dot" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }} />
            <span>Đã viết</span>
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
          title: 'Nhập thông tin cơ bản vào biểu mẫu đăng ký',
          subtitle: 'Writing Part 1 • Fill out the form (1 - 5 words)'
        };
      case 2:
        return {
          title: 'Giới thiệu bản thân ngắn gọn cho câu lạc bộ',
          subtitle: 'Writing Part 2 • Write in sentences (20 - 30 words)'
        };
      case 3:
        return {
          title: 'Tương tác trong nhóm chat/diễn đàn câu lạc bộ',
          subtitle: 'Writing Part 3 • Chat with other members (30 - 40 words per answer)'
        };
      case 4:
      default:
        return {
          title: 'Question 4 of 4 - Email Writing',
          subtitle: 'Write a short email (about 50 words) to your friend, and a longer email (120-150 words) to the president of the club.'
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
              <S.HeaderTitle>{testTitle}</S.HeaderTitle>
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
                          {answeredCount}/11
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
                  <Title level={2} style={{ color: '#00205B', margin: 0 }}>Kết quả làm bài thi Viết</Title>
                  <Text type="secondary" style={{ fontSize: '1rem', fontWeight: 500 }}>
                    Bạn đã hoàn thành {testTitle} kỹ năng Viết
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
                        <span className="score-max">{answeredCount}/11 câu viết</span>
                      </S.ScoreLabel>
                    )}
                  />
                </S.ScoreRingWrapper>

                <S.ReportGrid>
                  <S.ReportStatItem>
                    <span className="stat-label">Số câu đã hoàn thành</span>
                    <span className="stat-value">{answeredCount} / 11 câu</span>
                  </S.ReportStatItem>
                  <S.ReportStatItem>
                    <span className="stat-label">Tổng thời gian viết</span>
                    <span className="stat-value">{formatTime(50 * 60 - timeLeft)}</span>
                  </S.ReportStatItem>
                </S.ReportGrid>

                <div style={{ width: '100%', textAlign: 'left', background: '#f8fafc', padding: '1.25rem 1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '6px', color: '#00205B', fontWeight: 700 }}>
                    <AlertOutlined /> <span>Lưu ý về tự đánh giá bài Viết:</span>
                  </div>
                  <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>
                    Bài thi Viết là phần tự luận. Hãy bấm nút dưới đây để chuyển sang **Chế độ xem lại**, so sánh bài viết của chính bạn với **Gợi ý đáp án mẫu** của giáo viên và đối chiếu với **Mẹo chấm điểm (Tips)** tương ứng từng câu để tự chấm điểm và rút kinh nghiệm từ vựng, ngữ pháp.
                  </p>
                </div>

                <Button 
                  type="primary" 
                  size="large"
                  style={{ borderRadius: '2rem', height: '48px', padding: '0 2.5rem', fontWeight: 700, background: '#00205B', borderColor: '#00205B' }}
                  onClick={() => setShowReport(false)}
                >
                  Xem lại chi tiết bài viết & Đáp án mẫu
                </Button>
              </S.ReportCard>
            </S.ReportContainer>
          ) : (
            <>
              <S.ContentBody>
                <S.WorkspaceGrid>
                  {/* Cột trái: Vùng làm bài theo Part */}
                  <S.QuestionsColumn>
                    <S.ContentCard>
                      <S.TitleArea>
                        <h2>{partTitle}</h2>
                        <div className="subtitle">{partSubtitle}</div>
                      </S.TitleArea>
                      {renderActiveQuestionContent()}
                    </S.ContentCard>
                  </S.QuestionsColumn>

                  {/* Cột phải: Bảng câu hỏi */}
                  {renderQuestionNav()}
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
                  Phần {activePart} trên 4 (Câu {activeQuestionNum} / 11)
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
                      onClick={() => navigate({ to: '/writing' })}
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

export default WritingMockTestPage;
