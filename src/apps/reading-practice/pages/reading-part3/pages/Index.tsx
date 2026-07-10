import { CheckCircleOutlined,ClockCircleOutlined,LeftOutlined,RightOutlined,RollbackOutlined } from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import { Badge,Button,Progress,Radio,Space,Tag } from 'antd';
import { ExamLoading, ExamEmpty } from '@/shared/components/ExamState';
import React from 'react';
import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import { usePart3Action } from '../hook/usePart3Action';
import * as S from '../styles/styled';

export const Part3Page: React.FC = () => {
  const navigate = useNavigate();
  const {
    isLoading,
    data,
    questionCount,
    correctAnswers,
    total,
    currentNumber,
    hasNext,
    hasPrev,
    handleNext,
    handlePrev,
    answers,
    timeLeft,
    isSubmitted,
    handleRadioChange,
    handleSubmit,
    handleRetry,
    answeredCount,
    progressPercent,
    correctCount,
    formatTime
  } = usePart3Action();

  const opinions = data?.opinions ?? [];
  const questions = data?.questions ?? [];

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
              {total > 0 && (
                <Tag color="blue" style={{ fontWeight: 600 }}>Câu {currentNumber}/{total}</Tag>
              )}
              {isSubmitted && questionCount > 0 && (
                <Tag color={correctCount >= Math.ceil(questionCount * 0.7) ? 'success' : 'warning'} style={{ fontWeight: 600 }}>
                  Kết quả: {correctCount}/{questionCount}
                </Tag>
              )}
            </Space>

            <Space size="large" className="flex items-center">
              <Progress
                type="circle"
                percent={progressPercent}
                size={40}
                strokeColor="#10b981"
                trailColor="rgba(255,255,255,0.2)"
                format={() => <S.ProgressText>{answeredCount}/{questionCount || 0}</S.ProgressText>}
              />
              <S.TimerWrapper>
                <ClockCircleOutlined className="text-[#fbbf24] mr-1" />
                {formatTime(timeLeft)}
              </S.TimerWrapper>
            </Space>
          </S.Header>

          {isLoading ? (
            <ExamLoading />
          ) : !data ? (
            <div style={{ padding: '3rem' }}>
              <ExamEmpty />
            </div>
          ) : (
          <S.MainContent>
            <S.Column>
              <S.SectionHeader>
                <Badge status="processing" text={<S.SectionTitle>Ý KIẾN CỦA {opinions.length} NGƯỜI</S.SectionTitle>} />
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
                <S.SectionTitle>CÁC PHÁT BIỂU ĐƯỢC ĐƯA RA ({questionCount} CÂU)</S.SectionTitle>
                <S.SectionSubtitle>{answeredCount}/{questionCount} Đã chọn</S.SectionSubtitle>
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
                            : (isAnswered ? '#3b5b8c' : '#94a3b8'),
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
                          {opinions.map((o) => (
                            <Radio.Button key={o.id} value={o.id}>{o.id}</Radio.Button>
                          ))}
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
          )}

          <S.Footer>
            <Space size="middle">
              <S.FooterButton
                type="default"
                icon={<LeftOutlined />}
                size="large"
                onClick={() => navigate({ to: '/reading' })}
              >
                Quay lại danh sách
              </S.FooterButton>
              {hasPrev && (
                <Button size="large" onClick={handlePrev}>Câu trước</Button>
              )}
            </Space>

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
                  disabled={!data}
                >
                  Nộp bài
                </S.SubmitButton>
              )}
              {hasNext && (
                <Button type="primary" size="large" icon={<RightOutlined />} onClick={handleNext}>
                  Câu tiếp theo
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
