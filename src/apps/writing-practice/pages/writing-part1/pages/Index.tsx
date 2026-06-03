import React from 'react';
import { Space, Button } from 'antd';
import { LeftOutlined, BulbOutlined, ClockCircleOutlined, CheckSquareOutlined } from '@ant-design/icons';
import * as S from '../styles/styled';
import * as HomeS from '../../../../home/pages/styled';
import { Sidebar } from '../../../../home/components/Sidebar';
import { usePart1Action } from '../hook/usePart1Action';
import { SampleAnswerModal } from '../components/SampleAnswerModal';
import type { IPart1Question } from '../services/data';

export const Part1Page: React.FC = () => {
  const {
    answers,
    timer,
    showSampleModal,
    setShowSampleModal,
    handleAnswerChange,
    isWordCountValid,
    getWordCount,
    handleSubmit,
    handleBack,
    questions
  } = usePart1Action();

  // Chuẩn bị dữ liệu hiển thị trong modal đáp án mẫu
  const sampleAnswersForModal = [
    {
      label: "Gợi ý đáp án mẫu 1",
      content: (
        <S.SampleAnswersList>
          {questions.map((q: IPart1Question) => (
            <S.SampleAnswerItem key={q.id}>
              <S.SampleAnswerTitle>
                {q.id}. {q.questionText}
              </S.SampleAnswerTitle>
              <S.SampleAnswerText1>
                &rarr; {q.sampleAnswers[0]}
              </S.SampleAnswerText1>
            </S.SampleAnswerItem>
          ))}
        </S.SampleAnswersList>
      )
    },
    {
      label: "Gợi ý đáp án mẫu 2",
      content: (
        <S.SampleAnswersList>
          {questions.map((q: IPart1Question) => (
            <S.SampleAnswerItem key={q.id}>
              <S.SampleAnswerTitle>
                {q.id}. {q.questionText}
              </S.SampleAnswerTitle>
              <S.SampleAnswerText2>
                &rarr; {q.sampleAnswers[1]}
              </S.SampleAnswerText2>
            </S.SampleAnswerItem>
          ))}
        </S.SampleAnswersList>
      )
    },
    {
      label: "Gợi ý đáp án mẫu 3",
      content: (
        <S.SampleAnswersList>
          {questions.map((q: IPart1Question) => (
            <S.SampleAnswerItem key={q.id}>
              <S.SampleAnswerTitle>
                {q.id}. {q.questionText}
              </S.SampleAnswerTitle>
              <S.SampleAnswerText3>
                &rarr; {q.sampleAnswers[2]}
              </S.SampleAnswerText3>
            </S.SampleAnswerItem>
          ))}
        </S.SampleAnswersList>
      )
    }
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
            </Space>

            <S.TimerWrapper>
              <ClockCircleOutlined className="text-[#fbbf24] mr-1" />
              {timer.formatTime()}
            </S.TimerWrapper>
          </S.Header>

          <S.MainContent>
            <S.CenteredContainer className="max-w-[1100px]">
              <S.ContentCard className="py-2">
                <S.TitleArea className="mb-4">
                  <div>
                    <h2>Nhập thông tin cơ bản vào biểu mẫu đăng ký</h2>
                    <div className="subtitle">Writing Part 1 • Fill out the form (1 - 5 words)</div>
                  </div>
                  <S.ViewSampleButton
                    type="dashed"
                    icon={<BulbOutlined />}
                    onClick={() => setShowSampleModal(true)}
                  >
                    Xem đáp án mẫu
                  </S.ViewSampleButton>
                </S.TitleArea>

                <S.InstructionBox $borderColor="#0284c7" className="mb-4 text-[0.9rem] py-3 px-4">
                  You are joining an Art club. Fill out the form. Write short answers (1-5 words) for each message (Bài này nên trả lời từ 1 đến 5 từ, viết hoa chữ cái đầu và có dấu chấm kết thúc câu).
                </S.InstructionBox>

                <S.QuestionsWrapper>
                  {questions.map((q: IPart1Question) => {
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
                                Phải từ 1 đến 5 từ
                              </S.ErrorText>
                            )}
                          </div>
                          {textVal && (
                            <S.ModernWordBadge $isValid={isValid} $hasText={!!textVal} className="text-[0.7rem] py-0.5 px-2">
                              {wordCount}/5 từ
                            </S.ModernWordBadge>
                          )}
                        </div>
                      </S.QuestionItem>
                    );
                  })}
                </S.QuestionsWrapper>
              </S.ContentCard>
            </S.CenteredContainer>
          </S.MainContent>

          <S.Footer>
            <S.FooterButton
              type="default"
              icon={<LeftOutlined />}
              size="large"
              onClick={handleBack}
            >
              Bảng điều khiển
            </S.FooterButton>

            <Space size="middle">
              <S.SubmitButton
                type="primary"
                icon={<CheckSquareOutlined />}
                size="large"
                onClick={handleSubmit}
              >
                Nộp câu trả lời
              </S.SubmitButton>
            </Space>
          </S.Footer>
        </S.PageContainer>

        <SampleAnswerModal
          open={showSampleModal}
          onClose={() => setShowSampleModal(false)}
          title="Đăng ký câu lạc bộ Art Club"
          partTitle="Part 1"
          sampleAnswers={sampleAnswersForModal}
        />
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default Part1Page;
