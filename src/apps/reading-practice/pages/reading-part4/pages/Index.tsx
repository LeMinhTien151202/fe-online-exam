import { CheckCircleOutlined,ClockCircleOutlined,LeftOutlined,RightOutlined,RollbackOutlined } from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import { Badge,Button,Progress,Select,Space,Tag } from 'antd';
import { ExamLoading, ExamEmpty } from '@/shared/components/ExamState';
import React from 'react';
import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import { usePart4Action } from '../hook/usePart4Action';
import * as S from '../styles/styled';

export const Part4Page: React.FC = () => {
  const navigate = useNavigate();
  const {
    isLoading,
    data,
    paragraphCount,
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
    handleSelectChange,
    handleSubmit,
    handleRetry,
    answeredCount,
    progressPercent,
    correctCount,
    formatTime
  } = usePart4Action();

  const paragraphs = data?.paragraphs ?? [];
  const headings = data?.headings ?? [];

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
              <S.HeaderTitle>Part 4: Long Text Comprehension</S.HeaderTitle>
              {total > 0 && (
                <Tag color="blue" style={{ fontWeight: 600 }}>Câu {currentNumber}/{total}</Tag>
              )}
              {isSubmitted && paragraphCount > 0 && (
                <Tag color={correctCount >= Math.ceil(paragraphCount * 0.7) ? 'success' : 'warning'} style={{ fontWeight: 600 }}>
                  Kết quả: {correctCount}/{paragraphCount}
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
                format={() => <S.ProgressText>{answeredCount}/{paragraphCount || 0}</S.ProgressText>}
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
            <S.ScrollableColumn>
              <S.SectionHeader>
                <Badge status="processing" text={<S.SectionTitle>VĂN BẢN ĐỌC HIỂU ({paragraphCount} ĐOẠN VĂN)</S.SectionTitle>} />
              </S.SectionHeader>

              {paragraphs.map(p => (
                <S.ParagraphWrapper key={p.num}>
                  <S.ParagraphNumber>{p.num}</S.ParagraphNumber>
                  <S.ParagraphText>
                    {p.text}
                  </S.ParagraphText>
                </S.ParagraphWrapper>
              ))}
            </S.ScrollableColumn>

            <S.ScrollableColumn>
              <S.QuestionHeader>
                <S.SectionTitle>GÁN TIÊU ĐỀ CHO TỪNG ĐOẠN VĂN</S.SectionTitle>
                <S.SectionSubtitle>{answeredCount}/{paragraphCount} Đã gán</S.SectionSubtitle>
              </S.QuestionHeader>

              {paragraphs.map(({ num }) => {
                const isAnswered = !!answers[num];
                const isCorrect = answers[num] === correctAnswers[num];
                return (
                  <S.QuestionSlot
                    key={num}
                    $isAnswered={isAnswered}
                    $status={isSubmitted ? (isCorrect ? 'success' : 'error') : 'default'}
                  >
                    <S.SlotInner>
                      <S.QuestionLabel>
                        Đoạn văn {num}:
                      </S.QuestionLabel>
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
                        <S.CorrectAnswerText>
                          Đáp án đúng: {headings.find(h => h.value === correctAnswers[num])?.label}
                        </S.CorrectAnswerText>
                      )}
                    </S.SlotInner>
                  </S.QuestionSlot>
                );
              })}
            </S.ScrollableColumn>
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

export default Part4Page;
