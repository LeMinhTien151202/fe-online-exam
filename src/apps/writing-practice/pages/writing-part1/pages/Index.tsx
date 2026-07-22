import { BulbOutlined,CheckSquareOutlined,ClockCircleOutlined,LeftOutlined,RightOutlined } from '@ant-design/icons';
import { Button, Space, Tag } from 'antd';
import { ExamLoading, ExamEmpty } from '@/shared/components/ExamState';
import React from 'react';
import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import { SampleAnswerModal } from '../components/SampleAnswerModal';
import { QuestionBoard } from '@/shared/components/QuestionBoard';
import { usePart1Action } from '../hook/usePart1Action';
import * as S from '../styles/styled';

export const Part1Page: React.FC = () => {
  const {
    isLoading,
    hasData,
    instruction,
    wordMin,
    wordMax,
    answers,
    timer,
    handleAnswerChange,
    isWordCountValid,
    getWordCount,
    handleSubmit,
    handleBack,
    questions,
    total,
    currentNumber,
    hasNext,
    hasPrev,
    handleNext,
    handlePrev,
    goTo,
    boardItems,
    activeSetIndex
  } = usePart1Action();

  const [showSample, setShowSample] = React.useState(false);
  const hasSample = questions.some((q) => q.sampleAnswer);
  const sampleContent = [
    {
      label: 'Đáp án mẫu',
      content: (
        <S.SampleAnswersList>
          {questions.map((q) => (
            <S.SampleAnswerItem key={q.id}>
              <S.SampleAnswerTitle>{q.id}. {q.questionText}</S.SampleAnswerTitle>
              <S.SampleAnswerText1>&rarr; {q.sampleAnswer || '(chưa có)'}</S.SampleAnswerText1>
            </S.SampleAnswerItem>
          ))}
        </S.SampleAnswersList>
      ),
    },
  ];

  return (
    <HomeS.MainLayout>
      <Sidebar />
      <HomeS.RightColumn>
        <S.PageContainer>
          <S.Header>
            <Space size="middle">
              <S.BackLink to="/writing">
                <LeftOutlined /> Quay lại
              </S.BackLink>
              <S.HeaderTitle>
                Part 1: Word-level Writing
              </S.HeaderTitle>
              {total > 0 && (
                <Tag color="blue" style={{ fontWeight: 600 }}>Câu {currentNumber}/{total}</Tag>
              )}
            </Space>

            <S.TimerWrapper>
              <ClockCircleOutlined className="text-[#fbbf24] mr-1" />
              {timer.formatTime()}
            </S.TimerWrapper>
          </S.Header>

          <S.MainContent $hasBoard={total > 1}>
            <S.CenteredContainer className="max-w-[1100px]">
              <S.ContentCard className="py-2">
                <S.TitleArea className="mb-4">
                  <div>
                    <h2>Nhập thông tin cơ bản vào biểu mẫu đăng ký</h2>
                    <div className="subtitle">Writing Part 1 • Fill out the form ({wordMin} - {wordMax} words)</div>
                  </div>
                  {hasSample && (
                    <S.ViewSampleButton type="dashed" icon={<BulbOutlined />} onClick={() => setShowSample(true)}>
                      Xem đáp án mẫu
                    </S.ViewSampleButton>
                  )}
                </S.TitleArea>

                {instruction && (
                  <S.InstructionBox $borderColor="#0284c7" className="mb-4 text-[0.9rem] py-3 px-4">
                    {instruction}
                  </S.InstructionBox>
                )}

                {isLoading ? (
                  <ExamLoading />
                ) : !hasData ? (
                  <ExamEmpty />
                ) : (
                  <S.QuestionsWrapper>
                    {questions.map((q) => {
                      const textVal = answers[q.id] || '';
                      const wordCount = getWordCount(textVal);
                      const isValid = isWordCountValid(textVal);

                      return (
                        <S.QuestionItem key={q.id} className="mb-0 gap-1">
                          <div className="q-text text-[0.92rem] font-bold">
                            {q.id}. {q.questionText}
                          </div>
                          <S.ModernInput
                            placeholder="Nhập câu trả lời của bạn tại đây..."
                            value={textVal}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            $isValid={isValid}
                            $hasText={!!textVal}
                          />
                          <div className="flex justify-between items-center min-h-[1.25rem] mt-0.5">
                            <div className="flex-1">
                              {textVal && !isValid && (
                                <S.ErrorText>
                                  Phải từ {wordMin} đến {wordMax} từ
                                </S.ErrorText>
                              )}
                            </div>
                            {textVal && (
                              <S.ModernWordBadge $isValid={isValid} $hasText={!!textVal} className="text-[0.7rem] py-0.5 px-2">
                                {wordCount}/{wordMax} từ
                              </S.ModernWordBadge>
                            )}
                          </div>
                        </S.QuestionItem>
                      );
                    })}
                  </S.QuestionsWrapper>
                )}
              </S.ContentCard>
            </S.CenteredContainer>

            {total > 1 && (
              <QuestionBoard
                items={boardItems}
                activeKey={activeSetIndex}
                onJump={goTo}
                sectionLabel="Danh sách đề"
                showPartial
                answeredLabel="Đã nộp"
                partialLabel="Đang viết"
              />
            )}
          </S.MainContent>

          <S.Footer>
            <Space size="middle">
              <S.FooterButton
                type="default"
                icon={<LeftOutlined />}
                size="large"
                onClick={handleBack}
              >
                Danh sách
              </S.FooterButton>
              {hasPrev && (
                <Button size="large" onClick={handlePrev}>Câu trước</Button>
              )}
            </Space>

            <Space size="middle">
              <S.SubmitButton
                type="primary"
                icon={<CheckSquareOutlined />}
                size="large"
                onClick={handleSubmit}
                disabled={!hasData}
              >
                Nộp câu trả lời
              </S.SubmitButton>
              {hasNext && (
                <Button type="primary" size="large" icon={<RightOutlined />} onClick={handleNext}>
                  Câu tiếp theo
                </Button>
              )}
            </Space>
          </S.Footer>
        </S.PageContainer>

        <SampleAnswerModal
          open={showSample}
          onClose={() => setShowSample(false)}
          title="Word-level Writing"
          partTitle="Part 1"
          sampleAnswers={sampleContent}
        />
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default Part1Page;
