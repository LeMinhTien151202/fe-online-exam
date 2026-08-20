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
import { usePart3Action } from '../hook/usePart3Action';

const AVATAR_COLORS = ['#3b82f6', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6'];

export const Part3Page: React.FC = () => {
  const {
    isLoading,
    hasData,
    wordMin,
    wordMax,
    answers,
    handleRetry,
    isSubmitted,
    isGrading,
    grade,
    handleAnswerChange,
    isWordCountValid,
    getWordCount,
    handleSubmit,
    handleBack,
    messages,
    total,
    currentNumber,
    hasNext,
    hasPrev,
    handleNext,
    handlePrev,
    goTo,
    boardItems,
    activeSetIndex
  } = usePart3Action();

  const [showSample, setShowSample] = React.useState(false);
  const hasSample = messages.some((m) => m.sampleAnswer);

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
                Part 3: Social Network Interaction
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
            <S.CenteredContainer className="max-w-[900px]">
              <S.ContentCard className="py-2">
                <S.TitleArea className="mb-5">
                  <div>
                    <h2>Tương tác trong nhóm chat/diễn đàn câu lạc bộ</h2>
                    <div className="subtitle">Writing Part 3 • Chat with other members ({wordMin} - {wordMax} words per answer)</div>
                  </div>
                  {hasSample && (
                    <S.ViewSampleButton type="dashed" icon={<BulbOutlined />} onClick={() => setShowSample(true)}>
                      Xem đáp án mẫu
                    </S.ViewSampleButton>
                  )}
                </S.TitleArea>

                <S.InstructionText>
                  Respond to fellow members in full sentences ({wordMin}-{wordMax} words per answer).
                </S.InstructionText>

                {isLoading ? (
                  <ExamLoading />
                ) : !hasData ? (
                  <ExamEmpty />
                ) : (
                  <div className="flex flex-col gap-6">
                    {messages.map((m, idx) => {
                      const textVal = answers[m.id] || '';
                      const wordCount = getWordCount(textVal);
                      const isValid = isWordCountValid(textVal);
                      const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];

                      return (
                        <div key={m.id} className="flex flex-col gap-2">
                          <S.ChatHeader>
                            <S.AvatarBadge $bgColor={avatarColor}>
                              {m.avatar}
                            </S.AvatarBadge>
                            <S.SenderName>
                              {m.sender}
                            </S.SenderName>
                          </S.ChatHeader>

                          <S.ChatMessageText className="self-start max-w-[85%]">
                            {m.messageText}
                          </S.ChatMessageText>

                          <S.ModernTextArea
                            placeholder={`Trả lời cho ${m.sender} tại đây (${wordMin} - ${wordMax} từ)...`}
                            value={textVal}
                            onChange={(e) => handleAnswerChange(m.id, e.target.value)}
                            rows={4}
                            $isValid={isValid}
                            $hasText={!!textVal}
                            disabled={isSubmitted}
                          />

                          <div className="flex justify-between items-center min-h-[1.5rem]">
                            <div className="flex-1">
                              {textVal && !isValid && (
                                <span className="text-[0.75rem] color-[#ef4444] font-semibold">
                                  {wordCount < wordMin ? `Cần thêm ${wordMin - wordCount} từ` : `Cần bớt ${wordCount - wordMax} từ`}
                                </span>
                              )}
                            </div>
                            <S.ModernWordBadge $isValid={isValid} $hasText={!!textVal}>
                              {wordCount} / {wordMin}-{wordMax} từ
                            </S.ModernWordBadge>
                          </div>
                        </div>
                      );
                    })}
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
          title="Social Network Interaction"
          partTitle="Part 3"
          sampleAnswers={[
            {
              label: 'Đáp án mẫu',
              content: (
                <S.SampleModalList>
                  {messages.map((m) => (
                    <S.SampleModalItem key={m.id}>
                      <S.SampleModalHeader>TRẢ LỜI CHO {m.sender.toUpperCase()}</S.SampleModalHeader>
                      <S.SampleModalQuestionText>&ldquo;{m.messageText}&rdquo;</S.SampleModalQuestionText>
                      <S.SampleModalAnswerText>&rarr; {m.sampleAnswer || '(chưa có)'}</S.SampleModalAnswerText>
                      {m.sampleAnswer && (
                        <S.SampleModalWordCount>Số từ: {getWordCount(m.sampleAnswer)} từ</S.SampleModalWordCount>
                      )}
                    </S.SampleModalItem>
                  ))}
                </S.SampleModalList>
              ),
            },
          ]}
        />
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default Part3Page;
