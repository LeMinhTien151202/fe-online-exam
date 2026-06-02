import React from 'react';
import { Space, Button, Input } from 'antd';
import { LeftOutlined, RightOutlined, BulbOutlined, ClockCircleOutlined, CheckSquareOutlined } from '@ant-design/icons';
import * as S from './styled';
import * as HomeS from '../../../../home/pages/styled';
import { Sidebar } from '../../../../home/components/Sidebar';
import { usePart1Data } from '../../../hooks/usePart1Data';
import { usePart1Action } from '../../../hooks/usePart1Action';
import { SampleAnswerModal } from '../../../components/SampleAnswerModal';

export const Part1Page: React.FC = () => {
  const {
    answers,
    setAnswers,
    timer,
    questions,
    getWordCount,
    isWordCountValid
  } = usePart1Data();

  const {
    showSampleModal,
    setShowSampleModal,
    handleAnswerChange,
    handleSubmit,
    handleBack
  } = usePart1Action(answers, setAnswers);

  // Chuẩn bị dữ liệu hiển thị trong modal đáp án mẫu
  const sampleAnswersForModal = [
    {
      label: "Gợi ý đáp án mẫu 1",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {questions.map((q) => (
            <div key={q.id}>
              <div style={{ fontWeight: 700, color: '#1e293b' }}>
                {q.id}. {q.questionText}
              </div>
              <div style={{ color: '#0284c7', fontStyle: 'italic', marginTop: '2px' }}>
                &rarr; {q.sampleAnswers[0]}
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      label: "Gợi ý đáp án mẫu 2",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {questions.map((q) => (
            <div key={q.id}>
              <div style={{ fontWeight: 700, color: '#1e293b' }}>
                {q.id}. {q.questionText}
              </div>
              <div style={{ color: '#4f46e5', fontStyle: 'italic', marginTop: '2px' }}>
                &rarr; {q.sampleAnswers[1]}
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      label: "Gợi ý đáp án mẫu 3",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {questions.map((q) => (
            <div key={q.id}>
              <div style={{ fontWeight: 700, color: '#1e293b' }}>
                {q.id}. {q.questionText}
              </div>
              <div style={{ color: '#ea580c', fontStyle: 'italic', marginTop: '2px' }}>
                &rarr; {q.sampleAnswers[2]}
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
              <S.BackLink to="/writing">
                <LeftOutlined /> Quay lại
              </S.BackLink>
              <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white' }}>
                Part 1: Word-level Writing
              </span>
            </Space>

            <S.TimerWrapper>
              <ClockCircleOutlined style={{ color: '#fbbf24', marginRight: '4px' }} />
              {timer.formatTime()}
            </S.TimerWrapper>
          </S.Header>

          <S.MainContent>
            <S.CenteredContainer style={{ maxWidth: '1100px' }}>
              <S.ContentCard style={{ padding: '0.5rem 0' }}>
                <S.TitleArea style={{ marginBottom: '1rem' }}>
                  <div>
                    <h2>Nhập thông tin cơ bản vào biểu mẫu đăng ký</h2>
                    <div className="subtitle">Writing Part 1 • Fill out the form (1 - 5 words)</div>
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

                <S.InstructionBox $borderColor="#0284c7" style={{ marginBottom: '1rem', fontSize: '0.9rem', padding: '0.75rem 1rem' }}>
                  You are joining an Art club. Fill out the form. Write short answers (1-5 words) for each message (Bài này nên trả lời từ 1 đến 5 từ, viết hoa chữ cái đầu và có dấu chấm kết thúc câu).
                </S.InstructionBox>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {questions.map((q) => {
                    const textVal = answers[q.id] || '';
                    const wordCount = getWordCount(textVal);
                    const isValid = isWordCountValid(textVal);

                    return (
                      <S.QuestionItem key={q.id} style={{ marginBottom: 0, gap: '0.15rem' }}>
                        <div className="q-text" style={{ fontSize: '0.92rem', fontWeight: 700 }}>
                          {q.id}. {q.questionText}
                        </div>
                        <S.ModernInput
                          placeholder="Nhập câu trả lời của bạn tại đây..."
                          value={textVal}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                          $isValid={isValid}
                          $hasText={!!textVal}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '1.25rem', marginTop: '1px' }}>
                          <div style={{ flex: 1 }}>
                            {textVal && !isValid && (
                              <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 600 }}>
                                Phải từ 1 đến 5 từ
                              </span>
                            )}
                          </div>
                          {textVal && (
                            <S.ModernWordBadge $isValid={isValid} $hasText={!!textVal} style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
                              {wordCount}/5 từ
                            </S.ModernWordBadge>
                          )}
                        </div>
                      </S.QuestionItem>
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
              Bảng điều khiển
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
                Nộp câu trả lời
              </Button>
            </Space>
          </S.Footer>
        </S.PageContainer>

        <SampleAnswerModal
          open={showSampleModal}
          onClose={() => setShowSampleModal(false)}
          title="Đăng ký câu lạc bộ Art Club"
          partTitle="Part 1"
          sampleAnswers={sampleAnswersForModal}
        />
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default Part1Page;
