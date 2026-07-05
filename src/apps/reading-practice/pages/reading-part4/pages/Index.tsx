import { CheckCircleOutlined,ClockCircleOutlined,LeftOutlined,RollbackOutlined } from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import { Alert,Badge,Progress,Select,Space,Typography } from 'antd';
import React from 'react';
import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import { usePart4Action } from '../hook/usePart4Action';
import { correctAnswers,headings,paragraphs } from '../services/data';
import * as S from '../styles/styled';

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
              <S.HeaderTitle>Part 4: Long Text Comprehension</S.HeaderTitle>
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
                  description="Các tiêu đề đúng có viền xanh lá. Các tiêu đề sai có viền đỏ kèm đáp án đúng."
                  type={correctCount >= 5 ? "success" : "warning"}
                  showIcon
                  closable
                />
              </S.AlertWrapper>
            </S.AlertOuterWrapper>
          )}

          <S.MainContent>
            <S.ScrollableColumn>
              <S.SectionHeader>
                <Badge status="processing" text={<S.SectionTitle>VĂN BẢN ĐỌC HIỂU (7 ĐOẠN VĂN)</S.SectionTitle>} />
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
                <S.SectionSubtitle>{answeredCount}/7 Đã gán</S.SectionSubtitle>
              </S.QuestionHeader>

              {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                const isAnswered = !!answers[num];
                const isCorrect = answers[num] === correctAnswers[num];
                return (
                  <S.QuestionSlot 
                    key={num} 
                    $isAnswered={isAnswered}
                    $status={isSubmitted ? (isCorrect ? 'success' : 'error') : 'default'}
                  >
                    <div className="flex flex-col gap-2">
                      <S.QuestionLabel>
                        Đoạn văn {num}:
                      </S.QuestionLabel>
                      <Select
                        placeholder="Chọn tiêu đề phù hợp từ Heading Bank..."
                        className="w-full"
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
                    </div>
                  </S.QuestionSlot>
                );
              })}
            </S.ScrollableColumn>
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

export default Part4Page;
