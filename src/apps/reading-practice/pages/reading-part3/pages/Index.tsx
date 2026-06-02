import React from 'react';
import { Radio, Button, Typography, Space, Progress, Badge, Alert } from 'antd';
import { useNavigate } from '@tanstack/react-router';
import { ClockCircleOutlined, LeftOutlined, CheckCircleOutlined, RollbackOutlined } from '@ant-design/icons';
import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import * as S from '../styles/styled';
import { usePart3Action } from '../hook/usePart3Action';
import { opinions, questions, correctAnswers } from '../services/data';

const { Title, Text, Paragraph } = Typography;

export const Part3Page: React.FC = () => {
  const navigate = useNavigate();
  const {
    timeLeft,
    answers,
    isSubmitted,
    handleRadioChange,
    handleSubmit,
    handleRetry,
    answeredCount,
    progressPercent,
    correctCount,
    formatTime
  } = usePart3Action();

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
              <Title level={4} style={{ color: 'white', margin: 0 }}>Part 3: Opinion Matching</Title>
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
                description="Các câu trả lời đúng có nền xanh lá. Các câu trả lời sai có nền đỏ kèm đáp án đúng."
                type={correctCount >= 5 ? "success" : "warning"}
                showIcon
                closable
                style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}
              />
            </div>
          )}

          <S.MainContent>
            <S.Column>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <Badge status="processing" text={<Text strong style={{ color: '#0f172a' }}>Ý KIẾN CỦA 4 NGƯỜI (A, B, C, D)</Text>} />
              </div>

              {opinions.map(person => (
                <S.PersonCard key={person.id}>
                  <S.PersonHeader>
                    <S.PersonAvatar $color={person.color}>{person.id}</S.PersonAvatar>
                    <Text strong style={{ fontSize: '1.05rem', color: '#1e293b' }}>{person.name}</Text>
                  </S.PersonHeader>
                  <Paragraph style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6, color: '#475569' }}>
                    {person.text}
                  </Paragraph>
                </S.PersonCard>
              ))}
            </S.Column>

            <S.Column>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <Text strong style={{ color: '#0f172a' }}>CÁC PHÁT BIỂU ĐƯỢC ĐƯA RA (7 CÂU)</Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>{answeredCount}/7 Đã chọn</Text>
              </div>

              {questions.map((q, idx) => {
                const isAnswered = !!answers[q.id];
                const isCorrect = answers[q.id] === correctAnswers[q.id];
                return (
                  <S.StatementCard 
                    key={q.id} 
                    $isAnswered={isAnswered}
                    $status={isSubmitted ? (isCorrect ? 'success' : 'error') : 'default'}
                  >
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <Badge 
                        count={idx + 1} 
                        style={{ 
                          backgroundColor: isSubmitted 
                            ? (isCorrect ? '#10b981' : '#ef4444')
                            : (isAnswered ? '#2563eb' : '#94a3b8'), 
                          color: 'white', 
                          fontWeight: 'bold' 
                        }} 
                      />
                      <div style={{ flex: 1 }}>
                        <Text strong style={{ fontSize: '1rem', color: '#1e293b', display: 'block', marginBottom: '0.5rem' }}>
                          {q.text}
                        </Text>
                        <S.StyledRadioGroup 
                          optionType="button" 
                          buttonStyle="solid"
                          value={answers[q.id]}
                          onChange={(e) => handleRadioChange(q.id, e.target.value as string)}
                          disabled={isSubmitted}
                        >
                          <Radio.Button value="A">A</Radio.Button>
                          <Radio.Button value="B">B</Radio.Button>
                          <Radio.Button value="C">C</Radio.Button>
                          <Radio.Button value="D">D</Radio.Button>
                        </S.StyledRadioGroup>

                        {isSubmitted && !isCorrect && (
                          <div style={{ marginTop: '0.5rem', color: '#10b981', fontWeight: 600, fontSize: '0.9rem' }}>
                            Đáp án đúng: {correctAnswers[q.id]} ({opinions.find(o => o.id === correctAnswers[q.id])?.name})
                          </div>
                        )}
                      </div>
                    </div>
                  </S.StatementCard>
                );
              })}
            </S.Column>
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

export default Part3Page;
