import {
CheckCircleOutlined,
ClockCircleOutlined,
DownOutlined,
LeftOutlined,
UnlockOutlined,
UpOutlined
} from '@ant-design/icons';
import { Button,Progress,Space } from 'antd';
import React from 'react';
import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import { SpeakingController } from '../../speaking-part1/components/SpeakingController';
import { usePart4 } from '../hook/usePart4';
import * as S from '../styles/styled';

export const Part4Page: React.FC = () => {
  const {
    timeLeft,
    answers,
    showSampleAnswer,
    setShowSampleAnswer,
    activeSampleIdx,
    setActiveSampleIdx,
    formatTime,
    handleBack,
    handleSubmit,
    handleRecordComplete,
    currentSet,
    answeredCount,
    progressPercent,
  } = usePart4();

  return (
    <HomeS.MainLayout>
      <Sidebar />
      <HomeS.RightColumn>
        <S.PageContainer>
          <S.Header>
            <Space size="middle">
              <S.BackLink to="/speaking">
                <LeftOutlined /> Quay lại
              </S.BackLink>
              <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white' }}>
                Part 4: Abstract Topic (Band B2 Decisive)
              </span>
            </Space>

            <Space size="large" style={{ display: 'flex', alignItems: 'center' }}>
              <Progress
                type="circle"
                percent={progressPercent}
                size={40}
                strokeColor="#10b981"
                trailColor="rgba(255,255,255,0.2)"
                format={() => <span style={{ color: 'white', fontSize: '11px', fontWeight: 'bold' }}>{answeredCount}/1</span>}
              />
              <S.TimerWrapper>
                <ClockCircleOutlined style={{ color: '#fbbf24', marginRight: '4px' }} />
                {formatTime(timeLeft)}
              </S.TimerWrapper>
            </Space>
          </S.Header>

          <S.MainContent>
            <S.ContentGrid>
              <S.LeftColumn>
                <S.ContentCard>
                  <S.TitleArea>
                    <div>
                      <h2>Trả lời liên tục 3 câu hỏi về chủ đề</h2>
                      <div className="subtitle">
                        Speaking Part 4 • Abstract Topic
                      </div>
                    </div>
                  </S.TitleArea>

                  {/* Image Display */}
                  <S.ImageWrapper $height="380px">
                    <img src={currentSet.imageUrl} alt={currentSet.title} />
                  </S.ImageWrapper>

                  {/* Vertically stacked question list */}
                  <S.QListWrapper>
                    {currentSet.questions.map((q, idx) => (
                      <S.QListItem key={idx} $borderColor="#7c3aed">
                        <div className="q-num">{idx + 1}</div>
                        <div className="q-content">{q}</div>
                      </S.QListItem>
                    ))}
                  </S.QListWrapper>
                </S.ContentCard>
              </S.LeftColumn>

              <S.RightColumn>
                <SpeakingController 
                  prepTime={60} // 60 giây chuẩn bị (1 phút)
                  recordingTime={120} // Ghi âm 120 giây (2 phút) liên tục
                  statusColor="#7c3aed"
                  title={`p4-s1`}
                  onCompleted={handleRecordComplete}
                />
                {/* Collapsible Sample Answer */}
                <S.CollapsibleWrapper>
                  <S.CollapsibleHeader onClick={() => setShowSampleAnswer(!showSampleAnswer)}>
                    <span>
                      <UnlockOutlined style={{ marginRight: '8px', color: '#7c3aed' }} /> 
                      Xem đáp án mẫu (Tất cả 3 câu)
                    </span>
                    {showSampleAnswer ? <UpOutlined /> : <DownOutlined />}
                  </S.CollapsibleHeader>
                  {showSampleAnswer && (
                    <S.CollapsibleBody>
                      {currentSet.sampleAnswers && currentSet.sampleAnswers.length > 1 && (
                        <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {currentSet.sampleAnswers.map((_, sIdx) => (
                            <Button 
                              key={sIdx}
                              size="small"
                              type={activeSampleIdx === sIdx ? "primary" : "default"}
                              onClick={() => setActiveSampleIdx(sIdx)}
                              style={{ 
                                borderRadius: '12px', 
                                fontSize: '12px',
                                background: activeSampleIdx === sIdx ? '#7c3aed' : undefined,
                                borderColor: activeSampleIdx === sIdx ? '#7c3aed' : undefined,
                              }}
                            >
                              Đáp án {sIdx + 1}
                            </Button>
                          ))}
                        </div>
                      )}
                      {currentSet.sampleAnswers[activeSampleIdx]}
                    </S.CollapsibleBody>
                  )}
                </S.CollapsibleWrapper>
              </S.RightColumn>
            </S.ContentGrid>
          </S.MainContent>

          <S.Footer>
            <Button
              type="default"
              icon={<LeftOutlined />}
              size="large"
              style={{ borderRadius: '2rem', fontWeight: 600, padding: '0 1.5rem', border: '1px solid #e2e8f0', color: '#64748b' }}
              onClick={handleBack}
            >
              Quay lại
            </Button>

            <Space size="middle">
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                size="large"
                style={{
                  borderRadius: '2rem',
                  fontWeight: 600,
                  background: '#10b981',
                  borderColor: '#10b981',
                  padding: '0 2rem',
                  boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)'
                }}
                onClick={handleSubmit}
              >
                Nộp toàn bộ bài thi
              </Button>
            </Space>
          </S.Footer>
        </S.PageContainer>
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default Part4Page;
