import React from 'react';
import { Space, Button } from 'antd';
import { LeftOutlined, BulbOutlined, ClockCircleOutlined, CheckSquareOutlined } from '@ant-design/icons';
import * as S from '../../writing-part1/styles/styled';
import * as HomeS from '../../../../home/pages/styled';
import { Sidebar } from '../../../../home/components/Sidebar';
import { usePart4Action } from '../hook/usePart4Action';
import { SampleAnswerModal } from '../../writing-part1/components/SampleAnswerModal';

export const Part4Page: React.FC = () => {
  const {
    informalEmail,
    formalEmail,
    timer,
    showSampleModal,
    setShowSampleModal,
    handleInformalChange,
    handleFormalChange,
    isInformalValid,
    isFormalValid,
    getWordCount,
    handleSubmit,
    handleBack,
    scenario
  } = usePart4Action();

  const informalWc = getWordCount(informalEmail);
  const formalWc = getWordCount(formalEmail);

  const isInfValid = isInformalValid(informalEmail);
  const isFormValid = isFormalValid(formalEmail);

  // Chuẩn bị dữ liệu hiển thị trong modal đáp án mẫu
  const sampleAnswersForModal = scenario.sampleAnswers.map((set) => ({
    label: set.label,
    content: (
      <S.SampleModalListLarge>
        <div>
          <S.SampleModalSubHeader>
            1. EMAIL THÂN MẬT (INFORMAL EMAIL) - ~50 words
          </S.SampleModalSubHeader>
          <S.SampleModalTextCard>
            {set.informal}
          </S.SampleModalTextCard>
          <S.SampleModalWordCount>
            Số từ: {getWordCount(set.informal)} từ
          </S.SampleModalWordCount>
        </div>

        <div>
          <S.SampleModalSubHeader2>
            2. EMAIL TRANG TRỌNG (FORMAL EMAIL) - 120-150 words
          </S.SampleModalSubHeader2>
          <S.SampleModalTextCard>
            {set.formal}
          </S.SampleModalTextCard>
          <S.SampleModalWordCount>
            Số từ: {getWordCount(set.formal)} từ
          </S.SampleModalWordCount>
        </div>
      </S.SampleModalListLarge>
    )
  }));

  return (
    <HomeS.MainLayout>
      <Sidebar />
      <HomeS.RightColumn>
        <S.PageContainer>
          <S.Header>
            <Space size="middle">
              <S.BackLink to="/writing/part/3">
                <LeftOutlined /> Quay lại Part 3
              </S.BackLink>
              <S.HeaderTitle>
                Part 4: Formal and Informal Emails
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
                    <h2>Question 4 of 4 - Email Writing</h2>
                    <S.Subtitle>
                      Write a short email (about 50 words) to your friend, and a longer email (120-150 words) to the president of the club.
                    </S.Subtitle>
                  </div>
                  <S.ViewSampleButton
                    type="dashed"
                    icon={<BulbOutlined />}
                    onClick={() => setShowSampleModal(true)}
                  >
                    Xem đáp án mẫu
                  </S.ViewSampleButton>
                </S.TitleArea>

                {/* THÔNG BÁO / TÌNH HUỐNG (CHỈ HIỂN THỊ 1 LẦN Ở TRÊN CÙNG) */}
                <S.InstructionBox $borderColor="#3b82f6" className="mb-6 p-4 text-[0.9rem] bg-[#eff6ff] text-[#1e40af]">
                  <S.SituationTitle>
                    Tình huống giả định (Club Notification)
                  </S.SituationTitle>
                  <S.SituationBody>
                    {scenario.situation}
                  </S.SituationBody>
                </S.InstructionBox>

                <S.EmailSectionWrapper>
                  {/* EMAIL THÂN MẬT */}
                  <S.EmailGroup>
                    <div>
                      <S.EmailHeaderLabel>
                        1. Thư thân mật (Informal Email)
                      </S.EmailHeaderLabel>
                      <S.EmailPromptText>
                        {scenario.informalPrompt}
                      </S.EmailPromptText>
                    </div>

                    <S.ModernTextArea
                      placeholder="Viết thư gửi cho bạn của bạn tại đây (khoảng 50 từ)..."
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
                            {informalWc < 40 ? `Cần thêm ${40 - informalWc} từ` : informalWc > 60 ? `Cần bớt ${informalWc - 60} từ` : 'Yêu cầu khoảng 50 từ'}
                          </span>
                        )}
                      </div>
                      <S.ModernWordBadge $isValid={isInfValid} $hasText={!!informalEmail}>
                        {informalWc} / 40-60 từ
                      </S.ModernWordBadge>
                    </div>
                  </S.EmailGroup>

                  {/* EMAIL TRANG TRỌNG */}
                  <S.EmailGroup>
                    <div>
                      <S.EmailHeaderLabel2>
                        2. Thư trang trọng (Formal Email)
                      </S.EmailHeaderLabel2>
                      <S.EmailPromptText>
                        {scenario.formalPrompt}
                      </S.EmailPromptText>
                    </div>

                    <S.ModernTextArea
                      placeholder="Viết thư trang trọng gửi Ban quản lý câu lạc bộ tại đây (120 - 150 từ)..."
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
                            {formalWc < 120 ? `Cần thêm ${120 - formalWc} từ` : formalWc > 150 ? `Cần bớt ${formalWc - 150} từ` : 'Yêu cầu 120 - 150 từ'}
                          </span>
                        )}
                      </div>
                      <S.ModernWordBadge $isValid={isFormValid} $hasText={!!formalEmail}>
                        {formalWc} / 120-150 từ
                      </S.ModernWordBadge>
                    </div>
                  </S.EmailGroup>
                </S.EmailSectionWrapper>
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
              Quay lại Part 3
            </S.FooterButton>

            <Space size="middle">
              <S.SubmitButtonPurple
                type="primary"
                icon={<CheckSquareOutlined />}
                size="large"
                onClick={handleSubmit}
              >
                Nộp toàn bộ bài thi
              </S.SubmitButtonPurple>
            </Space>
          </S.Footer>
        </S.PageContainer>

        <SampleAnswerModal
          open={showSampleModal}
          onClose={() => setShowSampleModal(false)}
          title="Tình huống viết thư gửi câu lạc bộ - Art Club"
          partTitle="Part 4"
          sampleAnswers={sampleAnswersForModal}
        />
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default Part4Page;
