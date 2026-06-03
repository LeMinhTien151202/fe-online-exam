import React from 'react';
import { Select, Button, Space, Progress, Alert } from 'antd';
import { useNavigate } from '@tanstack/react-router';
import {
  LeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  BulbOutlined,
  RollbackOutlined
} from '@ant-design/icons';
import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import * as S from '../styles/styled';
import { usePart1Action } from '../hook/usePart1Action';
import { questions, correctAnswers } from '../services/data';

export const Part1Page: React.FC = () => {
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
  } = usePart1Action();

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
              <S.HeaderTitle>
                Part 1: Sentence Comprehension
              </S.HeaderTitle>
            </Space>

            <Space size="large" className="flex items-center">
              <Progress
                type="circle"
                percent={progressPercent}
                size={40}
                strokeColor="#10b981"
                trailColor="rgba(255,255,255,0.2)"
                format={() => <S.ProgressText>{answeredCount}/5</S.ProgressText>}
              />
              <S.TimerWrapper>
                <ClockCircleOutlined className="text-[#fbbf24] mr-1" />
                {formatTime(timeLeft)}
              </S.TimerWrapper>
            </Space>
          </S.Header>

          <S.MainContent>
            {isSubmitted && (
              <S.AlertWrapper>
                <Alert
                  message={
                    <span className="font-semibold">
                      Kết quả làm bài: {correctCount}/5 câu đúng ({Math.round(correctCount / 5 * 100)}%)
                    </span>
                  }
                  description="Bạn có thể kiểm tra lại các câu trả lời đúng (màu xanh lá) và sai (màu đỏ) bên dưới."
                  type={correctCount >= 4 ? "success" : "warning"}
                  showIcon
                  closable
                />
              </S.AlertWrapper>
            )}

            <S.ContentCard>
              <S.TitleArea>
                <h2>Hoàn thành các câu hỏi dưới đây</h2>
                <div className="subtitle">
                  Select the correct word from the dropdown to complete each sentence.
                </div>
                <S.TipBox>
                  💡 Tip: Double-click vào từ tiếng Anh bất kỳ để tra nghĩa
                </S.TipBox>
              </S.TitleArea>

              <div className="flex flex-col">
                <S.QuestionRow>
                  <S.BadgeNumber>1</S.BadgeNumber>
                  <S.QuestionText>
                    The new policies will be{' '}
                    <S.InlineSentenceSelect
                      placeholder="Select option"
                      onChange={(val) => handleSelectChange(1, val as string)}
                      value={answers[1]}
                      dropdownMatchSelectWidth={false}
                      $hasValue={!!answers[1]}
                      $status={
                        isSubmitted
                          ? answers[1] === correctAnswers[1]
                            ? 'success'
                            : 'error'
                          : 'default'
                      }
                      disabled={isSubmitted}
                    >
                      {questions[0].options.map(opt => (
                        <Select.Option key={opt} value={opt}>{opt}</Select.Option>
                      ))}
                    </S.InlineSentenceSelect>{' '}
                    starting next semester.
                    {isSubmitted && answers[1] !== correctAnswers[1] && (
                      <S.CorrectAnswerText>
                        (Đáp án đúng: <strong>{correctAnswers[1]}</strong>)
                      </S.CorrectAnswerText>
                    )}
                  </S.QuestionText>
                </S.QuestionRow>

                <S.QuestionRow>
                  <S.BadgeNumber>2</S.BadgeNumber>
                  <S.QuestionText>
                    Students can now borrow a{' '}
                    <S.InlineSentenceSelect
                      placeholder="Select option"
                      onChange={(val) => handleSelectChange(2, val as string)}
                      value={answers[2]}
                      dropdownMatchSelectWidth={false}
                      $hasValue={!!answers[2]}
                      $status={
                        isSubmitted
                          ? answers[2] === correctAnswers[2]
                            ? 'success'
                            : 'error'
                          : 'default'
                      }
                      disabled={isSubmitted}
                    >
                      {questions[1].options.map(opt => (
                        <Select.Option key={opt} value={opt}>{opt}</Select.Option>
                      ))}
                    </S.InlineSentenceSelect>{' '}
                    of ten books at a time.
                    {isSubmitted && answers[2] !== correctAnswers[2] && (
                      <S.CorrectAnswerText>
                        (Đáp án đúng: <strong>{correctAnswers[2]}</strong>)
                      </S.CorrectAnswerText>
                    )}
                  </S.QuestionText>
                </S.QuestionRow>

                <S.QuestionRow>
                  <S.BadgeNumber>3</S.BadgeNumber>
                  <S.QuestionText>
                    The lending period has been{' '}
                    <S.InlineSentenceSelect
                      placeholder="Select option"
                      onChange={(val) => handleSelectChange(3, val as string)}
                      value={answers[3]}
                      dropdownMatchSelectWidth={false}
                      $hasValue={!!answers[3]}
                      $status={
                        isSubmitted
                          ? answers[3] === correctAnswers[3]
                            ? 'success'
                            : 'error'
                          : 'default'
                      }
                      disabled={isSubmitted}
                    >
                      {questions[2].options.map(opt => (
                        <Select.Option key={opt} value={opt}>{opt}</Select.Option>
                      ))}
                    </S.InlineSentenceSelect>{' '}
                    to three weeks.
                    {isSubmitted && answers[3] !== correctAnswers[3] && (
                      <S.CorrectAnswerText>
                        (Đáp án đúng: <strong>{correctAnswers[3]}</strong>)
                      </S.CorrectAnswerText>
                    )}
                  </S.QuestionText>
                </S.QuestionRow>

                <S.QuestionRow>
                  <S.BadgeNumber>4</S.BadgeNumber>
                  <S.QuestionText>
                    There will be a slight increase in the{' '}
                    <S.InlineSentenceSelect
                      placeholder="Select option"
                      onChange={(val) => handleSelectChange(4, val as string)}
                      value={answers[4]}
                      dropdownMatchSelectWidth={false}
                      $hasValue={!!answers[4]}
                      $status={
                        isSubmitted
                          ? answers[4] === correctAnswers[4]
                            ? 'success'
                            : 'error'
                          : 'default'
                      }
                      disabled={isSubmitted}
                    >
                      {questions[3].options.map(opt => (
                        <Select.Option key={opt} value={opt}>{opt}</Select.Option>
                      ))}
                    </S.InlineSentenceSelect>{' '}
                    for returning books late.
                    {isSubmitted && answers[4] !== correctAnswers[4] && (
                      <S.CorrectAnswerText>
                        (Đáp án đúng: <strong>{correctAnswers[4]}</strong>)
                      </S.CorrectAnswerText>
                    )}
                  </S.QuestionText>
                </S.QuestionRow>

                <S.QuestionRow>
                  <S.BadgeNumber>5</S.BadgeNumber>
                  <S.QuestionText>
                    Students are encouraged to{' '}
                    <S.InlineSentenceSelect
                      placeholder="Select option"
                      onChange={(val) => handleSelectChange(5, val as string)}
                      value={answers[5]}
                      dropdownMatchSelectWidth={false}
                      $hasValue={!!answers[5]}
                      $status={
                        isSubmitted
                          ? answers[5] === correctAnswers[5]
                            ? 'success'
                            : 'error'
                          : 'default'
                      }
                      disabled={isSubmitted}
                    >
                      {questions[4].options.map(opt => (
                        <Select.Option key={opt} value={opt}>{opt}</Select.Option>
                      ))}
                    </S.InlineSentenceSelect>{' '}
                    their items online.
                    {isSubmitted && answers[5] !== correctAnswers[5] && (
                      <S.CorrectAnswerText>
                        (Đáp án đúng: <strong>{correctAnswers[5]}</strong>)
                      </S.CorrectAnswerText>
                    )}
                  </S.QuestionText>
                </S.QuestionRow>
              </div>
            </S.ContentCard>

            <S.AdminExperienceCard>
              <div className="info-left">
                <div className="icon-bulb">
                  <BulbOutlined />
                </div>
                <div className="text-content">
                  <div className="title">Kinh nghiệm của Admin cho Part 1</div>
                  <div className="subtitle">Sentence Comprehension</div>
                </div>
              </div>
              <button className="btn-show">Show</button>
            </S.AdminExperienceCard>
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

export default Part1Page;
