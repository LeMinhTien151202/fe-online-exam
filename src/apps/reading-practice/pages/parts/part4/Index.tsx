import React from 'react';
import { Select, Button, Typography, Space, Progress, Badge, message } from 'antd';
import { ClockCircleOutlined, LeftOutlined, CheckCircleOutlined, BookOutlined } from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import * as S from './styled';

const { Title, Text, Paragraph } = Typography;

export const Part4Page: React.FC = () => {
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

  const handleSelectChange = (paragraphNum: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [paragraphNum]: value
    }));
  };

  const handleSubmit = () => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < 7) {
      message.warning(`Bạn đã trả lời ${answeredCount}/7 tiêu đề. Vui lòng gán tiêu đề cho cả 7 đoạn văn!`);
      return;
    }
    message.success('Chúc mừng! Bạn đã hoàn thành toàn bộ bài kiểm tra Aptis Reading!');
    navigate({ to: '/reading' });
  };

  const headings = [
    { value: 'h1', label: 'I. The rise of industrial automation and its impact' },
    { value: 'h2', label: 'II. Economic benefits and cost efficiency' },
    { value: 'h3', label: 'III. Historical roots of manufacturing processes' },
    { value: 'h4', label: 'IV. Challenges in worker displacement and job retraining' },
    { value: 'h5', label: 'V. Predictions for the next technological revolution' },
    { value: 'h6', label: 'VI. Software algorithms and computer vision evolution' },
    { value: 'h7', label: 'VII. Safety improvements in hazardous work settings' },
    { value: 'h8', label: 'VIII. Public reactions and consumer attitudes' }
  ];

  const paragraphs = [
    {
      num: 1,
      text: 'Industrial automation has experienced exponential growth over the past few decades. Modern factories now rely heavily on sophisticated robotic arms and automated conveyor belts to assemble complex products. This technological shift has altered the fundamental structure of manufacturing worldwide.'
    },
    {
      num: 2,
      text: 'Historically, the concept of automation dates back to simple mechanical systems designed during the Industrial Revolution. However, today\'s automation is powered by digital microprocessors and advanced electrical systems, allowing machines to perform intricate processes with microscopic precision.'
    },
    {
      num: 3,
      text: 'One of the primary drivers behind this trend is sheer economic efficiency. Automated assembly lines can operate 24 hours a day, 7 days a week, without breaks or fatigue. Companies that implement automated machinery report massive increases in production volumes alongside significant reductions in operating overhead.'
    },
    {
      num: 4,
      text: 'Furthermore, automation has vastly improved factory safety. Heavy lifting, handling of hazardous chemicals, and working in extreme temperatures are now frequently delegated to resilient machinery. As a result, industrial workplace injuries have dropped dramatically in highly automated sectors.'
    },
    {
      num: 5,
      text: 'Despite these benefits, the rapid transition has triggered severe challenges for the labor force. Thousands of assembly-line workers have faced displacement as their manual skills become redundant. Experts emphasize the urgent need for robust government-sponsored job retraining programs to transition these workers into technical roles.'
    },
    {
      num: 6,
      text: 'At the heart of modern automation lies software sophistication. Machine learning algorithms, coupled with advanced high-speed computer vision systems, allow robots to detect defects in real-time, sort items dynamically, and make logical decisions on the factory floor without human intervention.'
    },
    {
      num: 7,
      text: 'Looking ahead, futurists predict that the next generation of automation will incorporate artificial general intelligence. Cobots—collaborative robots designed to work safely alongside humans—will become commonplace, permanently shifting the nature of human labor and industrial design.'
    }
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
              <Title level={4} style={{ color: 'white', margin: 0 }}>Part 4: Long Text Comprehension</Title>
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
            <S.ScrollableColumn>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <Badge status="processing" text={<Text strong style={{ color: '#0f172a' }}>VĂN BẢN ĐỌC HIỂU (7 ĐOẠN VĂN)</Text>} />
              </div>

              {paragraphs.map(p => (
                <S.ParagraphWrapper key={p.num}>
                  <S.ParagraphNumber>{p.num}</S.ParagraphNumber>
                  <Paragraph style={{ margin: 0, fontSize: '0.975rem', lineHeight: 1.7, color: '#334155' }}>
                    {p.text}
                  </Paragraph>
                </S.ParagraphWrapper>
              ))}
            </S.ScrollableColumn>

            <S.ScrollableColumn>
              {/* Removed Sticky Heading Bank as requested */}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.5rem 0 0.25rem 0' }}>
                <Text strong style={{ color: '#0f172a' }}>GÁN TIÊU ĐỀ CHO TỪNG ĐOẠN VĂN</Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>{answeredCount}/7 Đã gán</Text>
              </div>

              {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                const isAnswered = !!answers[num];
                return (
                  <S.QuestionSlot key={num} $isAnswered={isAnswered}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <Text strong style={{ color: '#334155', fontSize: '0.95rem' }}>
                        Đoạn văn {num}:
                      </Text>
                      <Select
                        placeholder="Chọn tiêu đề phù hợp từ Heading Bank..."
                        style={{ width: '100%' }}
                        value={answers[num]}
                        onChange={(val) => handleSelectChange(num, val as string)}
                        size="large"
                        allowClear
                      >
                        {headings.map(h => (
                          <Select.Option key={h.value} value={h.value}>
                            {h.label}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  </S.QuestionSlot>
                );
              })}
            </S.ScrollableColumn>
          </S.MainContent>

          <S.Footer>
            <Button 
              type="default" 
              icon={<LeftOutlined />} 
              size="large"
              style={{ borderRadius: '2rem', fontWeight: 600, padding: '0 1.5rem', border: '1px solid #e2e8f0', color: '#64748b' }}
              onClick={() => navigate({ to: '/reading/part/3' })}
            >
              Trở lại Part 3
            </Button>

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
              Hoàn thành bài thi
            </Button>
          </S.Footer>
        </S.PageContainer>
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default Part4Page;
