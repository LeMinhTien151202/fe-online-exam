import React from 'react';
import { Space, Button, Input } from 'antd';
import { LeftOutlined, BulbOutlined, ClockCircleOutlined, CheckSquareOutlined } from '@ant-design/icons';
import * as S from '../part1/styled'; // Tái sử dụng styled components chung của Part 1
import * as HomeS from '../../../../home/pages/styled';
import { Sidebar } from '../../../../home/components/Sidebar';
import { usePart4Data } from '../../../hooks/usePart4Data';
import { usePart4Action } from '../../../hooks/usePart4Action';
import { SampleAnswerModal } from '../../../components/SampleAnswerModal';

const { TextArea } = Input;

export const Part4Page: React.FC = () => {
  const {
    informalEmail,
    setInformalEmail,
    formalEmail,
    setFormalEmail,
    timer,
    scenario,
    getWordCount,
    isInformalValid,
    isFormalValid
  } = usePart4Data();

  const {
    showSampleModal,
    setShowSampleModal,
    handleInformalChange,
    handleFormalChange,
    handleSubmit,
    handleBack
  } = usePart4Action(informalEmail, setInformalEmail, formalEmail, setFormalEmail);

  const informalWc = getWordCount(informalEmail);
  const formalWc = getWordCount(formalEmail);

  const isInfValid = isInformalValid(informalEmail);
  const isFormValid = isFormalValid(formalEmail);

  // Chuẩn bị dữ liệu hiển thị trong modal đáp án mẫu
  const sampleAnswersForModal = scenario.sampleAnswers.map((set) => ({
    label: set.label,
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <div style={{ fontWeight: 800, color: '#4f46e5', fontSize: '1rem', borderBottom: '2px solid #e0e7ff', paddingBottom: '4px', marginBottom: '8px' }}>
            1. EMAIL THÂN MẬT (INFORMAL EMAIL) - ~50 words
          </div>
          <div style={{ whiteSpace: 'pre-line', fontStyle: 'italic', color: '#1e293b', background: '#f8fafc', padding: '12px', borderRadius: '6px' }}>
            {set.informal}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
            Số từ: {getWordCount(set.informal)} từ
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 800, color: '#9333ea', fontSize: '1rem', borderBottom: '2px solid #f3e8ff', paddingBottom: '4px', marginBottom: '8px' }}>
            2. EMAIL TRANG TRỌNG (FORMAL EMAIL) - 120-150 words
          </div>
          <div style={{ whiteSpace: 'pre-line', fontStyle: 'italic', color: '#1e293b', background: '#f8fafc', padding: '12px', borderRadius: '6px' }}>
            {set.formal}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
            Số từ: {getWordCount(set.formal)} từ
          </div>
        </div>
      </div>
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
              <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white' }}>
                Part 4: Formal and Informal Emails
              </span>
            </Space>

            <S.TimerWrapper>
              <ClockCircleOutlined style={{ color: '#fbbf24', marginRight: '4px' }} />
              {timer.formatTime()}
            </S.TimerWrapper>
          </S.Header>

          <S.MainContent>
            <S.CenteredContainer style={{ maxWidth: '900px' }}>
              <S.ContentCard style={{ padding: '0.5rem 0' }}>
                <S.TitleArea style={{ marginBottom: '1.25rem' }}>
                  <div>
                    <h2>Question 4 of 4 - Email Writing</h2>
                    <div className="subtitle" style={{ fontSize: '0.92rem', color: '#475569', fontWeight: 600, marginTop: '4px' }}>
                      Write a short email (about 50 words) to your friend, and a longer email (120-150 words) to the president of the club.
                    </div>
                  </div>
                  <Button
                    type="dashed"
                    icon={<BulbOutlined />}
                    onClick={() => setShowSampleModal(true)}
                    style={{ borderRadius: '1.5rem', color: '#9333ea', borderColor: '#d8b4fe', fontWeight: 600 }}
                  >
                    Xem đáp án mẫu
                  </Button>
                </S.TitleArea>

                {/* THÔNG BÁO / TÌNH HUỐNG (CHỈ HIỂN THỊ 1 LẦN Ở TRÊN CÙNG) */}
                <S.InstructionBox $borderColor="#3b82f6" style={{ marginBottom: '1.5rem', padding: '0.85rem 1.25rem', fontSize: '0.9rem', background: '#eff6ff', color: '#244b80' }}>
                  <div style={{ fontWeight: 800, color: '#1d4ed8', marginBottom: '0.25rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                    Tình huống giả định (Club Notification)
                  </div>
                  <div style={{ whiteSpace: 'pre-line', fontWeight: 500, lineHeight: 1.45 }}>
                    {scenario.situation}
                  </div>
                </S.InstructionBox>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {/* EMAIL THÂN MẬT */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div>
                      <div style={{ fontWeight: 800, color: '#4f46e5', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                        1. Thư thân mật (Informal Email)
                      </div>
                      <div style={{ fontSize: '0.95rem', color: '#334155', fontWeight: 600, lineHeight: 1.45 }}>
                        {scenario.informalPrompt}
                      </div>
                    </div>

                    <S.ModernTextArea
                      placeholder="Viết thư gửi cho bạn của bạn tại đây (khoảng 50 từ)..."
                      value={informalEmail}
                      onChange={(e) => handleInformalChange(e.target.value)}
                      rows={10}
                      $isValid={isInfValid}
                      $hasText={!!informalEmail}
                    />
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '1.5rem' }}>
                      <div style={{ flex: 1 }}>
                        {informalEmail && !isInfValid && (
                          <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>
                            {informalWc < 40 ? `Cần thêm ${40 - informalWc} từ` : informalWc > 60 ? `Cần bớt ${informalWc - 60} từ` : 'Yêu cầu khoảng 50 từ'}
                          </span>
                        )}
                      </div>
                      <S.ModernWordBadge $isValid={isInfValid} $hasText={!!informalEmail}>
                        {informalWc} / 40-60 từ
                      </S.ModernWordBadge>
                    </div>
                  </div>

                  {/* EMAIL TRANG TRỌNG */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div>
                      <div style={{ fontWeight: 800, color: '#9333ea', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                        2. Thư trang trọng (Formal Email)
                      </div>
                      <div style={{ fontSize: '0.95rem', color: '#334155', fontWeight: 600, lineHeight: 1.45 }}>
                        {scenario.formalPrompt}
                      </div>
                    </div>

                    <S.ModernTextArea
                      placeholder="Viết thư trang trọng gửi Ban quản lý câu lạc bộ tại đây (120 - 150 từ)..."
                      value={formalEmail}
                      onChange={(e) => handleFormalChange(e.target.value)}
                      rows={10}
                      $isValid={isFormValid}
                      $hasText={!!formalEmail}
                    />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '1.5rem' }}>
                      <div style={{ flex: 1 }}>
                        {formalEmail && !isFormValid && (
                          <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>
                            {formalWc < 120 ? `Cần thêm ${120 - formalWc} từ` : formalWc > 150 ? `Cần bớt ${formalWc - 150} từ` : 'Yêu cầu 120 - 150 từ'}
                          </span>
                        )}
                      </div>
                      <S.ModernWordBadge $isValid={isFormValid} $hasText={!!formalEmail}>
                        {formalWc} / 120-150 từ
                      </S.ModernWordBadge>
                    </div>
                  </div>
                </div>
              </S.ContentCard>
            </S.CenteredContainer>
          </S.MainContent>

          <S.Footer>
            <Button
              type="default"
              icon={<LeftOutlined />}
              size="large"
              style={{ borderRadius: '2rem', fontWeight: 600, padding: '0 1.5rem', color: '#64748b' }}
              onClick={handleBack}
            >
              Quay lại Part 3
            </Button>

            <Space size="middle">
              <Button
                type="primary"
                icon={<CheckSquareOutlined />}
                size="large"
                style={{
                  borderRadius: '2rem',
                  fontWeight: 600,
                  background: '#9333ea',
                  borderColor: '#9333ea',
                  padding: '0 2.5rem',
                  boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)'
                }}
                onClick={handleSubmit}
              >
                Nộp toàn bộ bài thi
              </Button>
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
