import { BulbOutlined,CheckSquareOutlined,ClockCircleOutlined,LeftOutlined,RightOutlined } from '@ant-design/icons';
import { Button, Empty, Space, Spin, Tag } from 'antd';
import React from 'react';
import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import { SampleAnswerModal } from '../../writing-part1/components/SampleAnswerModal';
import * as S from '../../writing-part1/styles/styled';
import { usePart2Action } from '../hook/usePart2Action';

export const Part2Page: React.FC = () => {
  const {
    isLoading,
    hasData,
    prompt,
    sampleAnswer,
    wordMin,
    wordMax,
    answer,
    timer,
    handleAnswerChange,
    isWordCountValid,
    getWordCount,
    handleSubmit,
    handleBack,
    total,
    currentNumber,
    hasNext,
    hasPrev,
    handleNext,
    handlePrev,
  } = usePart2Action();

  const wordCount = getWordCount(answer);
  const isValid = isWordCountValid(answer);
  const [showSample, setShowSample] = React.useState(false);

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
                Part 2: Short Text Writing
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

          <S.MainContent>
            <S.CenteredContainer>
              <S.ContentCard>
                <S.TitleArea>
                  <div>
                    <h2>Giới thiệu bản thân ngắn gọn cho câu lạc bộ</h2>
                    <div className="subtitle">Writing Part 2 • Write in sentences ({wordMin} - {wordMax} words)</div>
                  </div>
                  {sampleAnswer && (
                    <S.ViewSampleButton type="dashed" icon={<BulbOutlined />} onClick={() => setShowSample(true)}>
                      Xem đáp án mẫu
                    </S.ViewSampleButton>
                  )}
                </S.TitleArea>

                <S.InstructionBox $borderColor="#4f46e5">
                  Write in sentences. Use {wordMin}-{wordMax} words. (Khuyên dùng: Dành ra khoảng 3 phút cho phần này).
                </S.InstructionBox>

                {isLoading ? (
                  <div style={{ textAlign: 'center', padding: '3rem' }}><Spin size="large" /></div>
                ) : !hasData ? (
                  <Empty description="Chưa có câu hỏi cho phần này. Vui lòng quay lại sau." />
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="text-[1.05rem] font-bold text-[#0f172a]">
                      Prompt: {prompt}
                    </div>

                    <S.ModernTextArea
                      placeholder={`Nhập đoạn văn giới thiệu bản thân của bạn tại đây (${wordMin} - ${wordMax} từ)...`}
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
                            {wordCount < wordMin ? `Cần thêm ${wordMin - wordCount} từ` : `Cần bớt ${wordCount - wordMax} từ`}
                          </span>
                        )}
                      </div>
                      <S.ModernWordBadge $isValid={isValid} $hasText={!!answer}>
                        {wordCount} / {wordMin}-{wordMax} từ
                      </S.ModernWordBadge>
                    </div>
                  </div>
                )}
              </S.ContentCard>
            </S.CenteredContainer>
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
          title="Short Text Writing"
          partTitle="Part 2"
          sampleAnswers={[
            {
              label: 'Đáp án mẫu',
              content: (
                <S.SampleAnswerContainer>
                  "{sampleAnswer}"
                  <S.SampleAnswerWordCount>Số từ: {getWordCount(sampleAnswer || '')} từ</S.SampleAnswerWordCount>
                </S.SampleAnswerContainer>
              ),
            },
          ]}
        />
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default Part2Page;
