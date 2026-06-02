import React from 'react';
import { Select, Button, Typography, Space, Progress, Badge, Alert } from 'antd';
import { ClockCircleOutlined, LeftOutlined, CheckCircleOutlined, RollbackOutlined } from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import * as S from '../styles/styled';
import { usePart4Action } from '../hook/usePart4Action';
import { headings, paragraphs, correctAnswers } from '../services/data';

const { Title, Text, Paragraph } = Typography;

export const Part4Page: React.FC = () => {
  const navigate = useNavigate();
  const {
    timeLeft,
    answers,
    isSubmitted,
    handleSelectChange,
    handleSubmit,
    handleRetry,
    answeredCount,
    progressPercent,
    correctCount,
    formatTime
  } = usePart4Action();

  return (
    <HomeS.MainLayout>
      <Sidebar />
      <HomeS.RightColumn>
        <S.PageContainer>
          <S.Header>
            <Space size="large">
              <S.BackLink to="/reading">
                <LeftOutlined /> Quay lại danh sách
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

          {isSubmitted && (
            <div style={{ padding: '1.5rem 2rem 0 2rem' }}>
              <Alert
                message={
                  <span style={{ fontWeight: 600 }}>
                    Kết quả làm bài: {correctCount}/7 câu đúng ({Math.round(correctCount / 7 * 100)}%)
                  </span>
                }
                description="Các tiêu đề đúng có viền xanh lá. Các tiêu đề sai có viền đỏ kèm đáp án đúng."
                type={correctCount >= 5 ? "success" : "warning"}
                showIcon
                closable
                style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}
              />
            </div>
          )}

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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.5rem 0 0.25rem 0' }}>
                <Text strong style={{ color: '#0f172a' }}>GÁN TIÊU ĐỀ CHO TỪNG ĐOẠN VĂN</Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>{answeredCount}/7 Đã gán</Text>
              </div>

              {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                const isAnswered = !!answers[num];
                const isCorrect = answers[num] === correctAnswers[num];
                return (
                  <S.QuestionSlot 
                    key={num} 
                    $isAnswered={isAnswered}
                    $status={isSubmitted ? (isCorrect ? 'success' : 'error') : 'default'}
                  >
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
                        disabled={isSubmitted}
                      >
                        {headings.map(h => (
                          <Select.Option key={h.value} value={h.value}>
                            {h.label}
                          </Select.Option>
                        ))}
                      </Select>

                      {isSubmitted && !isCorrect && (
                        <div style={{ marginTop: '0.25rem', color: '#10b981', fontWeight: 600, fontSize: '0.9rem' }}>
                          Đáp án đúng: {headings.find(h => h.value === correctAnswers[num])?.label}
                        </div>
                      )}
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
              onClick={() => navigate({ to: '/reading' })}
            >
              Quay lại danh sách
            </Button>

            <Space size="middle">
              {isSubmitted ? (
                <Button
                  type="primary"
                  icon={<RollbackOutlined />}
                  size="large"
                  style={{
                    borderRadius: '2rem',
                    fontWeight: 600,
                    background: '#6366f1',
                    borderColor: '#6366f1',
                    padding: '0 2rem',
                    boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.2)'
                  }}
                  onClick={handleRetry}
                >
                  Làm lại
                </Button>
              ) : (
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
              )}
            </Space>
          </S.Footer>
        </S.PageContainer>
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default Part4Page;
