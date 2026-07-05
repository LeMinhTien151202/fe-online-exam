import { BulbOutlined,CheckSquareOutlined,ClockCircleOutlined,LeftOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import React from 'react';
import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import { SampleAnswerModal } from '../../writing-part1/components/SampleAnswerModal';
import * as S from '../../writing-part1/styles/styled';
import { usePart2Action } from '../hook/usePart2Action';

export const Part2Page: React.FC = () => {
  const {
    answer,
    timer,
    showSampleModal,
    setShowSampleModal,
    handleAnswerChange,
    isWordCountValid,
    getWordCount,
    handleSubmit,
    handleBack,
    question
  } = usePart2Action();

  const wordCount = getWordCount(answer);
  const isValid = isWordCountValid(answer);

  // Chuẩn bị dữ liệu hiển thị trong modal đáp án mẫu
  const sampleAnswersForModal = question.sampleAnswers.map((ans, idx) => ({
    label: `Gợi ý đáp án mẫu ${idx + 1}`,
    content: (
      <S.SampleAnswerContainer>
        "{ans}"
        <S.SampleAnswerWordCount>
          Số từ: {getWordCount(ans)} từ
        </S.SampleAnswerWordCount>
      </S.SampleAnswerContainer>
    )
  }));

  return (
    <HomeS.MainLayout>
      <Sidebar />
      <HomeS.RightColumn>
        <S.PageContainer>
          <S.Header>
            <Space size="middle">
              <S.BackLink to="/writing/part/1">
                <LeftOutlined /> Quay lại Part 1
              </S.BackLink>
              <S.HeaderTitle>
                Part 2: Short Text Writing
              </S.HeaderTitle>
            </Space>

            <S.TimerWrapper>
              <ClockCircleOutlined className="text-[#fbbf24] mr-1" />
              {timer.formatTime()}
            </S.TimerWrapper>
          </S.Header>

          <S.MainContent>
            <S.CenteredContainer>
              <S.ContentCard>
                <S.TitleArea>
                  <div>
                    <h2>Giới thiệu bản thân ngắn gọn cho câu lạc bộ</h2>
                    <div className="subtitle">Writing Part 2 • Write in sentences (20 - 30 words)</div>
                  </div>
                  <S.ViewSampleButton
                    type="dashed"
                    icon={<BulbOutlined />}
                    onClick={() => setShowSampleModal(true)}
                  >
                    Xem đáp án mẫu
                  </S.ViewSampleButton>
                </S.TitleArea>

                <S.InstructionBox $borderColor="#4f46e5">
                  {question.instruction} (Khuyên dùng: Dành ra khoảng 3 phút cho phần này).
                </S.InstructionBox>

                <div className="flex flex-col gap-4">
                  <div className="text-[1.05rem] font-bold text-[#0f172a]">
                    Prompt: {question.prompt}
                  </div>

                  <S.ModernTextArea
                    placeholder="Nhập đoạn văn giới thiệu bản thân của bạn tại đây (20 - 30 từ)..."
                    value={answer}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    rows={6}
                    $isValid={isValid}
                    $hasText={!!answer}
                  />

                  <div className="flex justify-between items-center min-h-[1.5rem]">
                    <div className="flex-1 pr-1">
                      {answer && !isValid && (
                        <span className="text-[0.8rem] color-[#ef4444] font-semibold">
                          {wordCount < 20 ? `Cần thêm ${20 - wordCount} từ` : `Cần bớt ${wordCount - 30} từ`}
                        </span>
                      )}
                    </div>
                    <S.ModernWordBadge $isValid={isValid} $hasText={!!answer}>
                      {wordCount} / 20-30 từ
                    </S.ModernWordBadge>
                  </div>
                </div>
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
              Quay lại Part 1
            </S.FooterButton>

            <Space size="middle">
              <S.SubmitButton
                type="primary"
                icon={<CheckSquareOutlined />}
                size="large"
                onClick={handleSubmit}
              >
                Tiếp tục (Part 3)
              </S.SubmitButton>
            </Space>
          </S.Footer>
        </S.PageContainer>

        <SampleAnswerModal
          open={showSampleModal}
          onClose={() => setShowSampleModal(false)}
          title="Giới thiệu bản thân - Art Club"
          partTitle="Part 2"
          sampleAnswers={sampleAnswersForModal}
        />
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default Part2Page;
