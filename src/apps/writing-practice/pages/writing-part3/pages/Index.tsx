import { BulbOutlined,CheckSquareOutlined,ClockCircleOutlined,LeftOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import React from 'react';
import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import { SampleAnswerModal } from '../../writing-part1/components/SampleAnswerModal';
import * as S from '../../writing-part1/styles/styled';
import { usePart3Action } from '../hook/usePart3Action';
import type { IPart3Message } from '../services/data';

export const Part3Page: React.FC = () => {
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
    messages
  } = usePart3Action();

  // Chuẩn bị dữ liệu hiển thị trong modal đáp án mẫu
  const sampleAnswersForModal = [
    {
      label: "Gợi ý đáp án mẫu 1",
      content: (
        <S.SampleModalList>
          {messages.map((m: IPart3Message) => (
            <S.SampleModalItem key={m.id}>
              <S.SampleModalHeader>
                TRẢ LỜI CHO {m.sender.toUpperCase()}
              </S.SampleModalHeader>
              <S.SampleModalQuestionText>
                &ldquo;{m.messageText}&rdquo;
              </S.SampleModalQuestionText>
              <S.SampleModalAnswerText>
                &rarr; {m.sampleAnswers[0]}
              </S.SampleModalAnswerText>
              <S.SampleModalWordCount>
                Số từ: {getWordCount(m.sampleAnswers[0])} từ
              </S.SampleModalWordCount>
            </S.SampleModalItem>
          ))}
        </S.SampleModalList>
      )
    },
    {
      label: "Gợi ý đáp án mẫu 2",
      content: (
        <S.SampleModalList>
          {messages.map((m: IPart3Message) => (
            <S.SampleModalItem key={m.id}>
              <S.SampleModalHeader>
                TRẢ LỜI CHO {m.sender.toUpperCase()}
              </S.SampleModalHeader>
              <S.SampleModalQuestionText>
                &ldquo;{m.messageText}&rdquo;
              </S.SampleModalQuestionText>
              <S.SampleModalAnswerText2>
                &rarr; {m.sampleAnswers[1]}
              </S.SampleModalAnswerText2>
              <S.SampleModalWordCount>
                Số từ: {getWordCount(m.sampleAnswers[1])} từ
              </S.SampleModalWordCount>
            </S.SampleModalItem>
          ))}
        </S.SampleModalList>
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
              <S.BackLink to="/writing/part/2">
                <LeftOutlined /> Quay lại Part 2
              </S.BackLink>
              <S.HeaderTitle>
                Part 3: Social Network Interaction
              </S.HeaderTitle>
            </Space>

            <S.TimerWrapper>
              <ClockCircleOutlined className="text-[#fbbf24] mr-1" />
              {timer.formatTime()}
            </S.TimerWrapper>
          </S.Header>

          <S.MainContent>
            <S.CenteredContainer className="max-w-[900px]">
              <S.ContentCard className="py-2">
                <S.TitleArea className="mb-5">
                  <div>
                    <h2>Tương tác trong nhóm chat/diễn đàn câu lạc bộ</h2>
                    <div className="subtitle">Writing Part 3 • Chat with other members (30 - 40 words per answer)</div>
                  </div>
                  <S.ViewSampleButton
                    type="dashed"
                    icon={<BulbOutlined />}
                    onClick={() => setShowSampleModal(true)}
                  >
                    Xem đáp án mẫu
                  </S.ViewSampleButton>
                </S.TitleArea>

                <S.InstructionText>
                  You are speaking to fellow members of the Art club in a group chat. Respond to them in full sentences (30-40 words per answer).
                </S.InstructionText>

                <div className="flex flex-col gap-6">
                  {messages.map((m: IPart3Message) => {
                    const textVal = answers[m.id] || '';
                    const wordCount = getWordCount(textVal);
                    const isValid = isWordCountValid(textVal);
                    const avatarColor = m.sender === 'Sam' ? '#3b82f6' : m.sender === 'Jenny' ? '#ec4899' : '#f59e0b';

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
                          placeholder={`Trả lời cho ${m.sender} tại đây (30 - 40 từ)...`}
                          value={textVal}
                          onChange={(e) => handleAnswerChange(m.id, e.target.value)}
                          rows={4}
                          $isValid={isValid}
                          $hasText={!!textVal}
                        />

                        <div className="flex justify-between items-center min-h-[1.5rem]">
                          <div className="flex-1">
                            {textVal && !isValid && (
                              <span className="text-[0.75rem] color-[#ef4444] font-semibold">
                                {wordCount < 30 ? `Cần thêm ${30 - wordCount} từ` : `Cần bớt ${wordCount - 40} từ`}
                              </span>
                            )}
                          </div>
                          <S.ModernWordBadge $isValid={isValid} $hasText={!!textVal}>
                            {wordCount} / 30-40 từ
                          </S.ModernWordBadge>
                        </div>
                      </div>
                    );
                  })}
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
              Quay lại Part 2
            </S.FooterButton>

            <Space size="middle">
              <S.SubmitButton
                type="primary"
                icon={<CheckSquareOutlined />}
                size="large"
                onClick={handleSubmit}
              >
                Tiếp tục (Part 4)
              </S.SubmitButton>
            </Space>
          </S.Footer>
        </S.PageContainer>

        <SampleAnswerModal
          open={showSampleModal}
          onClose={() => setShowSampleModal(false)}
          title="Tương tác mạng xã hội - Art Club"
          partTitle="Part 3"
          sampleAnswers={sampleAnswersForModal}
        />
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default Part3Page;
