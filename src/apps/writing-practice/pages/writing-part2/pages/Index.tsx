import { BulbOutlined,CheckSquareOutlined,LeftOutlined,RightOutlined,RollbackOutlined } from '@ant-design/icons';
import { Button, Space, Tag } from 'antd';
import { ExamLoading, ExamEmpty } from '@/shared/components/ExamState';
import React from 'react';
import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import { SampleAnswerModal } from '../../writing-part1/components/SampleAnswerModal';
import { QuestionBoard } from '@/shared/components/QuestionBoard';
import { QuestionGradeCard } from '@/shared/components/AiGrade';
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
    handleRetry,
    isSubmitted,
    isGrading,
    grade,
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
    goTo,
    boardItems,
    activeSetIndex,
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
              {grade && (
                <Tag color="green" style={{ fontWeight: 600 }}>
                  AI chấm: {grade.aiScore}/100{grade.band ? ` • Band ${grade.band}` : ''}
                </Tag>
              )}
            </Space>
          </S.Header>

          <S.MainContent $hasBoard={total > 1}>
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
                  <ExamLoading />
                ) : !hasData ? (
                  <ExamEmpty />
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
                      disabled={isSubmitted}
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
                {/* Kết quả AI của đúng đề đang làm — hiện ngay sau khi nộp */}
                <div style={{ marginTop: '1rem' }}>
                  <QuestionGradeCard loading={isGrading} grade={grade} />
                </div>
              </S.ContentCard>
            </S.CenteredContainer>

            {total > 1 && (
              <QuestionBoard
                items={boardItems}
                activeKey={activeSetIndex}
                onJump={goTo}
                sectionLabel="Danh sách đề"
                showPartial
                answeredLabel="Đã chấm"
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
              {isSubmitted ? (
                <S.SubmitButton
                  type="primary"
                  icon={<RollbackOutlined />}
                  size="large"
                  onClick={handleRetry}
                  style={{ background: '#f59e0b', borderColor: '#f59e0b' }}
                >
                  Làm lại
                </S.SubmitButton>
              ) : (
                <S.SubmitButton
                  type="primary"
                  icon={<CheckSquareOutlined />}
                  size="large"
                  loading={isGrading}
                  onClick={handleSubmit}
                  disabled={!hasData}
                >
                  Nộp &amp; chấm câu này
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
