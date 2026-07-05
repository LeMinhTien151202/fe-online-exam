import { CheckCircleOutlined,ClockCircleOutlined,LeftOutlined,RollbackOutlined } from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import { Alert,Badge,Progress,Radio,Space,Typography } from 'antd';
import React from 'react';
import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import { usePart3Action } from '../hook/usePart3Action';
import { correctAnswers,opinions,questions } from '../services/data';
import * as S from '../styles/styled';

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
              <S.HeaderTitle>Part 3: Opinion Matching</S.HeaderTitle>
            </Space>
            
            <Space size="large" className="flex items-center">
              <Progress 
                type="circle" 
                percent={progressPercent} 
                size={40} 
                strokeColor="#10b981" 
                trailColor="rgba(255,255,255,0.2)"
                format={() => <S.ProgressText>{answeredCount}/7</S.ProgressText>}
              />
              <S.TimerWrapper>
                <ClockCircleOutlined className="text-[#fbbf24] mr-1" />
                {formatTime(timeLeft)}
              </S.TimerWrapper>
            </Space>
          </S.Header>

          {isSubmitted && (
            <S.AlertOuterWrapper>
              <S.AlertWrapper>
                <Alert
                  message={
                    <span className="font-semibold">
                      Kết quả làm bài: {correctCount}/7 câu đúng ({Math.round(correctCount / 7 * 100)}%)
                    </span>
                  }
                  description="Các câu trả lời đúng có nền xanh lá. Các câu trả lời sai có nền đỏ kèm đáp án đúng."
                  type={correctCount >= 5 ? "success" : "warning"}
                  showIcon
                  closable
                />
              </S.AlertWrapper>
            </S.AlertOuterWrapper>
          )}

          <S.MainContent>
            <S.Column>
              <S.SectionHeader>
                <Badge status="processing" text={<S.SectionTitle>Ý KIẾN CỦA 4 NGƯỜI (A, B, C, D)</S.SectionTitle>} />
              </S.SectionHeader>

              {opinions.map(person => (
                <S.PersonCard key={person.id}>
                  <S.PersonHeader>
                    <S.PersonAvatar $color={person.color}>{person.id}</S.PersonAvatar>
                    <S.PersonName>{person.name}</S.PersonName>
                  </S.PersonHeader>
                  <S.PersonText>
                    {person.text}
                  </S.PersonText>
                </S.PersonCard>
              ))}
            </S.Column>

            <S.Column>
              <S.QuestionHeader>
                <S.SectionTitle>CÁC PHÁT BIỂU ĐƯỢC ĐƯA RA (7 CÂU)</S.SectionTitle>
                <S.SectionSubtitle>{answeredCount}/7 Đã chọn</S.SectionSubtitle>
              </S.QuestionHeader>

              {questions.map((q, idx) => {
                const isAnswered = !!answers[q.id];
                const isCorrect = answers[q.id] === correctAnswers[q.id];
                return (
                  <S.StatementCard 
                    key={q.id} 
                    $isAnswered={isAnswered}
                    $status={isSubmitted ? (isCorrect ? 'success' : 'error') : 'default'}
                  >
                    <S.QuestionRowLayout>
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
                      <S.QuestionBody>
                        <S.QuestionText>
                          {q.text}
                        </S.QuestionText>
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
                          <S.CorrectAnswerText>
                            Đáp án đúng: {correctAnswers[q.id]} ({opinions.find(o => o.id === correctAnswers[q.id])?.name})
                          </S.CorrectAnswerText>
                        )}
                      </S.QuestionBody>
                    </S.QuestionRowLayout>
                  </S.StatementCard>
                );
              })}
            </S.Column>
          </S.MainContent>

          <S.Footer>
            <S.FooterButton 
              type="default" 
              icon={<LeftOutlined />} 
              size="large"
              onClick={() => navigate({ to: '/reading' })}
            >
              Quay lại danh sách
            </S.FooterButton>

            <Space size="middle">
              {isSubmitted ? (
                <S.RetryButton
                  type="primary"
                  icon={<RollbackOutlined />}
                  size="large"
                  onClick={handleRetry}
                >
                  Làm lại
                </S.RetryButton>
              ) : (
                <S.SubmitButton 
                  type="primary" 
                  icon={<CheckCircleOutlined />} 
                  size="large"
                  onClick={handleSubmit}
                >
                  Nộp bài
                </S.SubmitButton>
              )}
            </Space>
          </S.Footer>
        </S.PageContainer>
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default Part3Page;
