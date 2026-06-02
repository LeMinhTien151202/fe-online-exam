import React from 'react';
import { Space, Button, Input } from 'antd';
import { LeftOutlined, BulbOutlined, ClockCircleOutlined, CheckSquareOutlined } from '@ant-design/icons';
import * as S from '../part1/styled'; // Tái sử dụng styled components chung của Part 1
import * as HomeS from '../../../../home/pages/styled';
import { Sidebar } from '../../../../home/components/Sidebar';
import { usePart3Data } from '../../../hooks/usePart3Data';
import { usePart3Action } from '../../../hooks/usePart3Action';
import { SampleAnswerModal } from '../../../components/SampleAnswerModal';

const { TextArea } = Input;

export const Part3Page: React.FC = () => {
  const {
    answers,
    setAnswers,
    timer,
    messages,
    getWordCount,
    isWordCountValid
  } = usePart3Data();

  const {
    showSampleModal,
    setShowSampleModal,
    handleAnswerChange,
    handleSubmit,
    handleBack
  } = usePart3Action(answers, setAnswers);

  // Chuẩn bị dữ liệu hiển thị trong modal đáp án mẫu
  const sampleAnswersForModal = [
    {
      label: "Gợi ý đáp án mẫu 1",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((m) => (
            <div key={m.id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              <div style={{ fontWeight: 700, color: '#475569', fontSize: '0.85rem' }}>
                TRẢ LỜI CHO {m.sender.toUpperCase()}
              </div>
              <div style={{ color: '#0f172a', fontWeight: 600, fontSize: '0.9rem', margin: '4px 0' }}>
                &ldquo;{m.messageText}&rdquo;
              </div>
              <div style={{ color: '#9333ea', fontStyle: 'italic', marginTop: '6px' }}>
                &rarr; {m.sampleAnswers[0]}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
                Số từ: {getWordCount(m.sampleAnswers[0])} từ
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      label: "Gợi ý đáp án mẫu 2",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((m) => (
            <div key={m.id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              <div style={{ fontWeight: 700, color: '#475569', fontSize: '0.85rem' }}>
                TRẢ LỜI CHO {m.sender.toUpperCase()}
              </div>
              <div style={{ color: '#0f172a', fontWeight: 600, fontSize: '0.9rem', margin: '4px 0' }}>
                &ldquo;{m.messageText}&rdquo;
              </div>
              <div style={{ color: '#7c3aed', fontStyle: 'italic', marginTop: '6px' }}>
                &rarr; {m.sampleAnswers[1]}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
                Số từ: {getWordCount(m.sampleAnswers[1])} từ
              </div>
            </div>
          ))}
        </div>
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
              <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white' }}>
                Part 3: Social Network Interaction
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
                    <h2>Tương tác trong nhóm chat/diễn đàn câu lạc bộ</h2>
                    <div className="subtitle">Writing Part 3 • Chat with other members (30 - 40 words per answer)</div>
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

                <div style={{ fontSize: '0.92rem', color: '#475569', fontWeight: 600, marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  You are speaking to fellow members of the Art club in a group chat. Respond to them in full sentences (30-40 words per answer).
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {messages.map((m) => {
                    const textVal = answers[m.id] || '';
                    const wordCount = getWordCount(textVal);
                    const isValid = isWordCountValid(textVal);
                    const avatarColor = m.sender === 'Sam' ? '#3b82f6' : m.sender === 'Jenny' ? '#ec4899' : '#f59e0b';

                    return (
                      <div key={m.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <S.ChatHeader>
                          <S.AvatarBadge $bgColor={avatarColor}>
                            {m.avatar}
                          </S.AvatarBadge>
                          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
                            {m.sender}
                          </span>
                        </S.ChatHeader>
                        
                        <S.ChatMessageText style={{ alignSelf: 'flex-start', maxWidth: '85%' }}>
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

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '1.5rem' }}>
                          <div style={{ flex: 1 }}>
                            {textVal && !isValid && (
                              <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>
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
            <Button
              type="default"
              icon={<LeftOutlined />}
              size="large"
              style={{ borderRadius: '2rem', fontWeight: 600, padding: '0 1.5rem', color: '#64748b' }}
              onClick={handleBack}
            >
              Quay lại Part 2
            </Button>

            <Space size="middle">
              <Button
                type="primary"
                icon={<CheckSquareOutlined />}
                size="large"
                style={{
                  borderRadius: '2rem',
                  fontWeight: 600,
                  background: '#10b981',
                  borderColor: '#10b981',
                  padding: '0 2rem',
                }}
                onClick={handleSubmit}
              >
                Tiếp tục (Part 4)
              </Button>
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
