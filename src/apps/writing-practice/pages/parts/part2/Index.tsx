import React from 'react';
import { Space, Button, Input } from 'antd';
import { LeftOutlined, RightOutlined, BulbOutlined, ClockCircleOutlined, CheckSquareOutlined } from '@ant-design/icons';
import * as S from '../part1/styled'; // Tái sử dụng styled components chung của Part 1
import * as HomeS from '../../../../home/pages/styled';
import { Sidebar } from '../../../../home/components/Sidebar';
import { usePart2Data } from '../../../hooks/usePart2Data';
import { usePart2Action } from '../../../hooks/usePart2Action';
import { SampleAnswerModal } from '../../../components/SampleAnswerModal';

const { TextArea } = Input;

export const Part2Page: React.FC = () => {
  const {
    answer,
    setAnswer,
    timer,
    question,
    getWordCount,
    isWordCountValid
  } = usePart2Data();

  const {
    showSampleModal,
    setShowSampleModal,
    handleAnswerChange,
    handleSubmit,
    handleBack
  } = usePart2Action(answer, setAnswer);

  const wordCount = getWordCount(answer);
  const isValid = isWordCountValid(answer);

  // Chuẩn bị dữ liệu hiển thị trong modal đáp án mẫu
  const sampleAnswersForModal = question.sampleAnswers.map((ans, idx) => ({
    label: `Gợi ý đáp án mẫu ${idx + 1}`,
    content: (
      <div style={{ color: '#1e293b', fontSize: '1rem', fontStyle: 'italic' }}>
        "{ans}"
        <div style={{ marginTop: '12px', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
          Số từ: {getWordCount(ans)} từ
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
              <S.BackLink to="/writing/part/1">
                <LeftOutlined /> Quay lại Part 1
              </S.BackLink>
              <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white' }}>
                Part 2: Short Text Writing
              </span>
            </Space>

            <S.TimerWrapper>
              <ClockCircleOutlined style={{ color: '#fbbf24', marginRight: '4px' }} />
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
                  <Button
                    type="dashed"
                    icon={<BulbOutlined />}
                    onClick={() => setShowSampleModal(true)}
                    style={{ borderRadius: '1.5rem', color: '#9333ea', borderColor: '#d8b4fe' }}
                  >
                    Xem đáp án mẫu
                  </Button>
                </S.TitleArea>

                <S.InstructionBox $borderColor="#4f46e5">
                  {question.instruction} (Khuyên dùng: Dành ra khoảng 3 phút cho phần này).
                </S.InstructionBox>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
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

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '1.5rem' }}>
                    <div style={{ flex: 1, paddingRight: '4px' }}>
                      {answer && !isValid && (
                        <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 600 }}>
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
            <Button
              type="default"
              icon={<LeftOutlined />}
              size="large"
              style={{ borderRadius: '2rem', fontWeight: 600, padding: '0 1.5rem', color: '#64748b' }}
              onClick={handleBack}
            >
              Quay lại Part 1
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
                Tiếp tục (Part 3)
              </Button>
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
