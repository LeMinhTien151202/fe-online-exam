import { BulbOutlined,CheckSquareOutlined,ClockCircleOutlined,LeftOutlined,RightOutlined } from '@ant-design/icons';
import { Button, Space, Tag } from 'antd';
import { ExamLoading, ExamEmpty } from '@/shared/components/ExamState';
import React from 'react';
import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import { SampleAnswerModal } from '../../writing-part1/components/SampleAnswerModal';
import * as S from '../../writing-part1/styles/styled';
import { usePart4Action } from '../hook/usePart4Action';

export const Part4Page: React.FC = () => {
  const {
    isLoading,
    hasData,
    total,
    currentNumber,
    hasNext,
    hasPrev,
    handleNext,
    handlePrev,
    situation,
    informalPrompt,
    formalPrompt,
    informalSample,
    formalSample,
    informalMin,
    informalMax,
    formalMin,
    formalMax,
    informalEmail,
    formalEmail,
    timer,
    handleInformalChange,
    handleFormalChange,
    isInformalValid,
    isFormalValid,
    getWordCount,
    handleSubmit,
    handleBack,
  } = usePart4Action();

  const informalWc = getWordCount(informalEmail);
  const formalWc = getWordCount(formalEmail);
  const isInfValid = isInformalValid(informalEmail);
  const isFormValid = isFormalValid(formalEmail);
  const [showSample, setShowSample] = React.useState(false);
  const hasSample = !!(informalSample || formalSample);

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
                Part 4: Formal and Informal Emails
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
            <S.CenteredContainer className="max-w-[900px]">
              <S.ContentCard className="py-2">
                <S.TitleArea className="mb-5">
                  <div>
                    <h2>Question 4 of 4 - Email Writing</h2>
                    <S.Subtitle>
                      Write a short email ({informalMin}-{informalMax} words) to your friend, and a longer email ({formalMin}-{formalMax} words) to the president of the club.
                    </S.Subtitle>
                  </div>
                  {hasSample && (
                    <S.ViewSampleButton type="dashed" icon={<BulbOutlined />} onClick={() => setShowSample(true)}>
                      Xem đáp án mẫu
                    </S.ViewSampleButton>
                  )}
                </S.TitleArea>

                {isLoading ? (
                  <ExamLoading />
                ) : !hasData ? (
                  <ExamEmpty />
                ) : (
                  <>
                    <S.InstructionBox $borderColor="#3b82f6" className="mb-6 p-4 text-[0.9rem] bg-[#eff6ff] text-[#244b80]">
                      <S.SituationTitle>
                        Tình huống giả định (Club Notification)
                      </S.SituationTitle>
                      <S.SituationBody>
                        {situation}
                      </S.SituationBody>
                    </S.InstructionBox>

                    <S.EmailSectionWrapper>
                      <S.EmailGroup>
                        <div>
                          <S.EmailHeaderLabel>
                            1. Thư thân mật (Informal Email)
                          </S.EmailHeaderLabel>
                          <S.EmailPromptText>
                            {informalPrompt}
                          </S.EmailPromptText>
                        </div>

                        <S.ModernTextArea
                          placeholder={`Viết thư gửi cho bạn của bạn tại đây (${informalMin} - ${informalMax} từ)...`}
                          value={informalEmail}
                          onChange={(e) => handleInformalChange(e.target.value)}
                          rows={10}
                          $isValid={isInfValid}
                          $hasText={!!informalEmail}
                        />

                        <div className="flex justify-between items-center min-h-[1.5rem]">
                          <div className="flex-1">
                            {informalEmail && !isInfValid && (
                              <span className="text-[0.75rem] color-[#ef4444] font-semibold">
                                {informalWc < informalMin ? `Cần thêm ${informalMin - informalWc} từ` : `Cần bớt ${informalWc - informalMax} từ`}
                              </span>
                            )}
                          </div>
                          <S.ModernWordBadge $isValid={isInfValid} $hasText={!!informalEmail}>
                            {informalWc} / {informalMin}-{informalMax} từ
                          </S.ModernWordBadge>
                        </div>
                      </S.EmailGroup>

                      <S.EmailGroup>
                        <div>
                          <S.EmailHeaderLabel2>
                            2. Thư trang trọng (Formal Email)
                          </S.EmailHeaderLabel2>
                          <S.EmailPromptText>
                            {formalPrompt}
                          </S.EmailPromptText>
                        </div>

                        <S.ModernTextArea
                          placeholder={`Viết thư trang trọng gửi Ban quản lý câu lạc bộ tại đây (${formalMin} - ${formalMax} từ)...`}
                          value={formalEmail}
                          onChange={(e) => handleFormalChange(e.target.value)}
                          rows={10}
                          $isValid={isFormValid}
                          $hasText={!!formalEmail}
                        />

                        <div className="flex justify-between items-center min-h-[1.5rem]">
                          <div className="flex-1">
                            {formalEmail && !isFormValid && (
                              <span className="text-[0.75rem] color-[#ef4444] font-semibold">
                                {formalWc < formalMin ? `Cần thêm ${formalMin - formalWc} từ` : `Cần bớt ${formalWc - formalMax} từ`}
                              </span>
                            )}
                          </div>
                          <S.ModernWordBadge $isValid={isFormValid} $hasText={!!formalEmail}>
                            {formalWc} / {formalMin}-{formalMax} từ
                          </S.ModernWordBadge>
                        </div>
                      </S.EmailGroup>
                    </S.EmailSectionWrapper>
                  </>
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
              <S.SubmitButtonPurple
                type="primary"
                icon={<CheckSquareOutlined />}
                size="large"
                onClick={handleSubmit}
                disabled={!hasData}
              >
                Nộp câu trả lời
              </S.SubmitButtonPurple>
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
          title="Formal & Informal Emails"
          partTitle="Part 4"
          sampleAnswers={[
            {
              label: 'Đáp án mẫu',
              content: (
                <S.SampleModalListLarge>
                  <div>
                    <S.SampleModalSubHeader>1. EMAIL THÂN MẬT (INFORMAL)</S.SampleModalSubHeader>
                    <S.SampleModalTextCard>{informalSample || '(chưa có)'}</S.SampleModalTextCard>
                    {informalSample && (
                      <S.SampleModalWordCount>Số từ: {getWordCount(informalSample)} từ</S.SampleModalWordCount>
                    )}
                  </div>
                  <div>
                    <S.SampleModalSubHeader2>2. EMAIL TRANG TRỌNG (FORMAL)</S.SampleModalSubHeader2>
                    <S.SampleModalTextCard>{formalSample || '(chưa có)'}</S.SampleModalTextCard>
                    {formalSample && (
                      <S.SampleModalWordCount>Số từ: {getWordCount(formalSample)} từ</S.SampleModalWordCount>
                    )}
                  </div>
                </S.SampleModalListLarge>
              ),
            },
          ]}
        />
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default Part4Page;
