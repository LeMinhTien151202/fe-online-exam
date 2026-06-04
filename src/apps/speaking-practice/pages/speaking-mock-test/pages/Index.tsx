import React from 'react';
import { Button, Space, Progress, Typography, Tooltip } from 'antd';
import { 
  LeftOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  RollbackOutlined,
  AlertOutlined,
  UnlockOutlined,
  DownOutlined,
  UpOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import { SpeakingController } from '../../../components/SpeakingController';
import * as S from '../styles/styled';
import { useMockTest } from '../hook/useMockTest';
import { 
  part1Questions, 
  part2Questions, 
  part3Questions, 
  part4Questions 
} from '../services/mockData';

const { Title, Text, Paragraph } = Typography;

export const SpeakingMockTestPage: React.FC = () => {
  const {
    testTitle,
    totalQuestions,
    answers,
    setAnswers,
    timeLeft,
    isSubmitted,
    showReport,
    setShowReport,
    showSampleMap,
    activeSampleIdxMap,
    activeQuestionNum,
    activePart,
    formatTime,
    answeredCount,
    handleRetry,
    handleBackToLanding,
    handleNavigateQuestion,
    handlePrevQuestion,
    handleNextQuestion,
    handleSubmitClick,
    toggleSample,
    setSampleIndex,
    navigate,
  } = useMockTest();

  const renderActiveQuestionContent = () => {
    // PART 1 (Questions 1 - 3)
    if (activeQuestionNum <= 3) {
      const q = part1Questions[activeQuestionNum - 1];
      return (
        <S.QuestionBox $borderColor="#0284c7">
          <div className="q-badge">Câu hỏi {q.id}</div>
          <div className="q-text">{q.questionText}</div>
        </S.QuestionBox>
      );
    }

    // PART 2 (Questions 4 - 6)
    if (activeQuestionNum >= 4 && activeQuestionNum <= 6) {
      const q = part2Questions[activeQuestionNum - 4];
      return (
        <S.SectionColumn>
          <S.ImageWrapper $height="280px">
            <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=60" alt="Family Cooking" />
          </S.ImageWrapper>

          <S.QuestionBox $borderColor="#059669">
            <div className="q-badge">{activeQuestionNum === 4 ? 'Mô tả tranh (Describe)' : 'Câu hỏi mở rộng (Explain)'}</div>
            <div className="q-text">{q.questionText}</div>
          </S.QuestionBox>
        </S.SectionColumn>
      );
    }

    // PART 3 (Questions 7 - 9)
    if (activeQuestionNum >= 7 && activeQuestionNum <= 9) {
      const q = part3Questions[activeQuestionNum - 7];
      return (
        <S.SectionColumn>
          <S.PhotosGrid>
            <S.ImageWrapper $height="200px">
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800" alt="Restaurant dining" />
            </S.ImageWrapper>
            <S.ImageWrapper $height="200px">
              <img src="https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=800" alt="Home dining" />
            </S.ImageWrapper>
          </S.PhotosGrid>

          <S.QuestionBox $borderColor="#d97706">
            <div className="q-badge">{activeQuestionNum === 7 ? 'So sánh tranh (Compare)' : 'Câu hỏi mở rộng (Explain)'}</div>
            <div className="q-text">{q.questionText}</div>
          </S.QuestionBox>
        </S.SectionColumn>
      );
    }

    // PART 4 (Questions 10 - 12)
    if (activeQuestionNum >= 10 && activeQuestionNum <= 12) {
      return (
        <S.QuestionBox $borderColor="#7c3aed">
          <div className="q-badge">Part 4: Thuyết trình dài về chủ đề trừu tượng (Câu 10, 11 & 12)</div>
          <div className="q-text">
            Trả lời 3 câu hỏi sau đây trong một bài thuyết trình hoàn chỉnh:<br /><br />
            10. Tell me about a time you had to make an important decision.<br />
            11. What was the decision and why was it important?<br />
            12. What was the outcome of your decision?
          </div>
        </S.QuestionBox>
      );
    }

    return null;
  };

  const renderActiveQuestionRight = () => {
    // PART 1 (Questions 1 - 3)
    if (activeQuestionNum <= 3) {
      const q = part1Questions[activeQuestionNum - 1];
      const showSample = showSampleMap[q.id] ?? false;
      const sampleIdx = activeSampleIdxMap[q.id] ?? 0;

      return (
        <>
          <SpeakingController 
            prepTime={0}
            recordingTime={30}
            statusColor="#0284c7"
            title={`speak-test-p1-q${q.id}`}
            onCompleted={(url: string | null) => setAnswers(prev => ({ ...prev, [q.id]: url || 'recorded_mock' }))}
          />

          {isSubmitted && (
            <S.CollapsibleWrapper>
              <S.CollapsibleHeader onClick={() => toggleSample(q.id)}>
                <span>
                  <UnlockOutlined style={{ marginRight: '8px', color: '#0284c7' }} /> 
                  Xem đáp án mẫu & Gợi ý
                </span>
                {showSample ? <UpOutlined /> : <DownOutlined />}
              </S.CollapsibleHeader>
              {showSample && (
                <S.CollapsibleBody>
                  <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {q.sampleAnswers.map((_, sIdx) => (
                      <Button 
                        key={sIdx}
                        size="small"
                        type={sampleIdx === sIdx ? "primary" : "default"}
                        onClick={() => setSampleIndex(q.id, sIdx)}
                        style={{ 
                          borderRadius: '12px', 
                          fontSize: '12px',
                          background: sampleIdx === sIdx ? '#0284c7' : undefined,
                          borderColor: sampleIdx === sIdx ? '#0284c7' : undefined,
                        }}
                      >
                        Gợi ý {sIdx + 1}
                      </Button>
                    ))}
                  </div>
                  <Paragraph style={{ fontStyle: 'italic', color: '#334155', lineHeight: 1.6 }}>
                    {q.sampleAnswers[sampleIdx]}
                  </Paragraph>
                  <div style={{ marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                    <strong style={{ color: '#0284c7', fontSize: '0.85rem' }}>Mẹo trả lời:</strong>
                    <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.25rem', fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>
                      {q.tips.map((t, idx) => <li key={idx}>{t}</li>)}
                    </ul>
                  </div>
                </S.CollapsibleBody>
              )}
            </S.CollapsibleWrapper>
          )}
        </>
      );
    }

    // PART 2 (Questions 4 - 6)
    if (activeQuestionNum >= 4 && activeQuestionNum <= 6) {
      const q = part2Questions[activeQuestionNum - 4];
      const showSample = showSampleMap[q.id] ?? false;
      const sampleIdx = activeSampleIdxMap[q.id] ?? 0;

      return (
        <>
          <SpeakingController 
            prepTime={45}
            recordingTime={45}
            statusColor="#059669"
            title={`speak-test-p2-q${q.id}`}
            onCompleted={(url: string | null) => setAnswers(prev => ({ ...prev, [q.id]: url || 'recorded_mock' }))}
          />

          {isSubmitted && (
            <S.CollapsibleWrapper>
              <S.CollapsibleHeader onClick={() => toggleSample(q.id)}>
                <span>
                  <UnlockOutlined style={{ marginRight: '8px', color: '#059669' }} /> 
                  Xem đáp án mẫu & Gợi ý
                </span>
                {showSample ? <UpOutlined /> : <DownOutlined />}
              </S.CollapsibleHeader>
              {showSample && (
                <S.CollapsibleBody>
                  <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {q.sampleAnswers.map((_, sIdx) => (
                      <Button 
                        key={sIdx}
                        size="small"
                        type={sampleIdx === sIdx ? "primary" : "default"}
                        onClick={() => setSampleIndex(q.id, sIdx)}
                        style={{ 
                          borderRadius: '12px', 
                          fontSize: '12px',
                          background: sampleIdx === sIdx ? '#059669' : undefined,
                          borderColor: sampleIdx === sIdx ? '#059669' : undefined,
                        }}
                      >
                        Gợi ý {sIdx + 1}
                      </Button>
                    ))}
                  </div>
                  <Paragraph style={{ fontStyle: 'italic', color: '#334155', lineHeight: 1.6 }}>
                    {q.sampleAnswers[sampleIdx]}
                  </Paragraph>
                  <div style={{ marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                    <strong style={{ color: '#059669', fontSize: '0.85rem' }}>Mẹo trả lời:</strong>
                    <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.25rem', fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>
                      {q.tips.map((t, idx) => <li key={idx}>{t}</li>)}
                    </ul>
                  </div>
                </S.CollapsibleBody>
              )}
            </S.CollapsibleWrapper>
          )}
        </>
      );
    }

    // PART 3 (Questions 7 - 9)
    if (activeQuestionNum >= 7 && activeQuestionNum <= 9) {
      const q = part3Questions[activeQuestionNum - 7];
      const showSample = showSampleMap[q.id] ?? false;
      const sampleIdx = activeSampleIdxMap[q.id] ?? 0;

      return (
        <>
          <SpeakingController 
            prepTime={45}
            recordingTime={45}
            statusColor="#d97706"
            title={`speak-test-p3-q${q.id}`}
            onCompleted={(url: string | null) => setAnswers(prev => ({ ...prev, [q.id]: url || 'recorded_mock' }))}
          />

          {isSubmitted && (
            <S.CollapsibleWrapper>
              <S.CollapsibleHeader onClick={() => toggleSample(q.id)}>
                <span>
                  <UnlockOutlined style={{ marginRight: '8px', color: '#d97706' }} /> 
                  Xem đáp án mẫu & Gợi ý
                </span>
                {showSample ? <UpOutlined /> : <DownOutlined />}
              </S.CollapsibleHeader>
              {showSample && (
                <S.CollapsibleBody>
                  <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {q.sampleAnswers.map((_, sIdx) => (
                      <Button 
                        key={sIdx}
                        size="small"
                        type={sampleIdx === sIdx ? "primary" : "default"}
                        onClick={() => setSampleIndex(q.id, sIdx)}
                        style={{ 
                          borderRadius: '12px', 
                          fontSize: '12px',
                          background: sampleIdx === sIdx ? '#d97706' : undefined,
                          borderColor: sampleIdx === sIdx ? '#d97706' : undefined,
                        }}
                      >
                        Gợi ý {sIdx + 1}
                      </Button>
                    ))}
                  </div>
                  <Paragraph style={{ fontStyle: 'italic', color: '#334155', lineHeight: 1.6 }}>
                    {q.sampleAnswers[sampleIdx]}
                  </Paragraph>
                  <div style={{ marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                    <strong style={{ color: '#d97706', fontSize: '0.85rem' }}>Mẹo trả lời:</strong>
                    <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.25rem', fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>
                      {q.tips.map((t, idx) => <li key={idx}>{t}</li>)}
                    </ul>
                  </div>
                </S.CollapsibleBody>
              )}
            </S.CollapsibleWrapper>
          )}
        </>
      );
    }

    // PART 4 (Questions 10 - 12)
    if (activeQuestionNum >= 10 && activeQuestionNum <= 12) {
      const q = part4Questions[0];
      const showSample = showSampleMap[q.id] ?? false;

      return (
        <>
          <SpeakingController 
            prepTime={60}
            recordingTime={120}
            statusColor="#7c3aed"
            title={`speak-test-p4-q10`}
            onCompleted={(url: string | null) => {
              setAnswers(prev => ({ 
                ...prev, 
                [10]: url || 'recorded_mock',
                [11]: url || 'recorded_mock',
                [12]: url || 'recorded_mock'
              }));
            }}
          />

          {isSubmitted && (
            <S.CollapsibleWrapper>
              <S.CollapsibleHeader onClick={() => toggleSample(q.id)}>
                <span>
                  <UnlockOutlined style={{ marginRight: '8px', color: '#7c3aed' }} /> 
                  Xem đáp án mẫu & Gợi ý
                </span>
                {showSample ? <UpOutlined /> : <DownOutlined />}
              </S.CollapsibleHeader>
              {showSample && (
                <S.CollapsibleBody>
                  <Paragraph style={{ fontStyle: 'italic', color: '#334155', lineHeight: 1.6 }}>
                    {q.sampleAnswers[0]}
                  </Paragraph>
                  <div style={{ marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                    <strong style={{ color: '#7c3aed', fontSize: '0.85rem' }}>Mẹo trả lời:</strong>
                    <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.25rem', fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>
                      {q.tips.map((t, idx) => <li key={idx}>{t}</li>)}
                    </ul>
                  </div>
                </S.CollapsibleBody>
              )}
            </S.CollapsibleWrapper>
          )}
        </>
      );
    }

    return null;
  };

  const renderQuestionNav = () => {
    const getStatus = (qNum: number): 'unanswered' | 'answered' => {
      return answers[qNum] ? 'answered' : 'unanswered';
    };

    const renderGridButtons = (qNums: number[]) => {
      return (
        <S.ButtonGrid>
          {qNums.map((n) => {
            const status = getStatus(n);
            const isActive = activeQuestionNum === n;

            let placement: 'top' | 'topRight' | 'topLeft' = 'top';
            if (n % 4 === 1) {
              placement = 'topRight';
            } else if (n % 4 === 0) {
              placement = 'topLeft';
            }

            return (
              <Tooltip
                key={n}
                title={`Câu ${n}: ${status === 'answered' ? 'Đã thu âm' : 'Chưa thu âm'}`}
                placement={placement}
                mouseEnterDelay={0.15}
              >
                <S.NavGridButton
                  $active={isActive}
                  $status={status}
                  onClick={() => handleNavigateQuestion(n)}
                >
                  {n}
                </S.NavGridButton>
              </Tooltip>
            );
          })}
        </S.ButtonGrid>
      );
    };

    return (
      <S.NavPanel>
        <S.PanelTitle>Bảng câu hỏi</S.PanelTitle>
        
        <S.SectionLabel>Part 1: Cá nhân (1 - 3)</S.SectionLabel>
        {renderGridButtons([1, 2, 3])}

        <S.SectionLabel>Part 2: Miêu tả (4 - 6)</S.SectionLabel>
        {renderGridButtons([4, 5, 6])}

        <S.SectionLabel>Part 3: So sánh (7 - 9)</S.SectionLabel>
        {renderGridButtons([7, 8, 9])}

        <S.SectionLabel>Part 4: Thuyết trình (10 - 12)</S.SectionLabel>
        {renderGridButtons([10, 11, 12])}

        <S.Legend>
          <S.LegendItem>
            <div className="color-dot" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1' }} />
            <span>Chưa thu âm</span>
          </S.LegendItem>
          <S.LegendItem>
            <div className="color-dot" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }} />
            <span>Đã ghi âm</span>
          </S.LegendItem>
          <S.LegendItem>
            <div className="color-dot" style={{ background: 'white', border: '1.5px solid #1a365d' }} />
            <span>Đang chọn</span>
          </S.LegendItem>
        </S.Legend>
      </S.NavPanel>
    );
  };

  const getPartTitleAndInstruction = () => {
    switch (activePart) {
      case 1:
        return {
          title: 'Trả lời 3 câu hỏi ngắn về bản thân',
          subtitle: `Speaking Part 1 • Question ${activeQuestionNum} of 3`
        };
      case 2:
        return {
          title: 'Miêu tả tranh và trả lời 2 câu hỏi',
          subtitle: 'Speaking Part 2 • 3 Questions'
        };
      case 3:
        return {
          title: 'So sánh hai bức tranh và trả lời câu hỏi',
          subtitle: 'Speaking Part 3 • 3 Questions'
        };
      case 4:
      default:
        return {
          title: 'Trả lời liên tục 3 câu hỏi về chủ đề',
          subtitle: 'Speaking Part 4 • Abstract Topic'
        };
    }
  };

  const { title: partTitle, subtitle: partSubtitle } = getPartTitleAndInstruction();

  return (
    <HomeS.MainLayout>
      <Sidebar />
      <HomeS.RightColumn>
        <S.PageContainer>
          <S.Header>
            <Space size="large">
              <Button
                type="text"
                icon={<LeftOutlined />}
                onClick={handleBackToLanding}
                style={{ color: '#cbd5e1', fontWeight: 'bold' }}
              >
                Quay lại
              </Button>
              <S.HeaderTitle>
                {testTitle} • {activePart === 1 ? 'Part 1: Personal Information' : activePart === 2 ? 'Part 2: Describe, Express Opinion & Explain' : activePart === 3 ? 'Part 3: Compare & Provide Reasons' : 'Part 4: Abstract Topic (Band B2 Decisive)'}
              </S.HeaderTitle>
            </Space>

            <Space size="large" style={{ display: 'flex', alignItems: 'center' }}>
              {isSubmitted ? (
                <Space>
                  <Button
                    type="primary"
                    onClick={() => setShowReport(true)}
                    style={{ background: '#1a365d', borderColor: '#1a365d', borderRadius: '2rem', fontWeight: 700 }}
                  >
                    Xem báo cáo điểm
                  </Button>
                  <Button 
                    type="primary" 
                    icon={<RollbackOutlined />}
                    onClick={handleRetry}
                    style={{ background: '#6366f1', borderColor: '#6366f1', borderRadius: '2rem', fontWeight: 700 }}
                  >
                    Thi lại đề này
                  </Button>
                </Space>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 700 }}>TIẾN ĐỘ:</span>
                    <Progress
                      type="circle"
                      percent={Math.round(answeredCount / totalQuestions * 100)}
                      size={40}
                      strokeColor="#10b981"
                      trailColor="rgba(255,255,255,0.2)"
                      format={() => (
                        <span style={{ color: 'white', fontSize: '11px', fontWeight: 'bold' }}>
                          {answeredCount}/12
                        </span>
                      )}
                    />
                  </div>

                  <S.TimerWrapper>
                    <ClockCircleOutlined style={{ color: '#fbbf24', marginRight: '4px' }} />
                    {formatTime(timeLeft)}
                  </S.TimerWrapper>
                </>
              )}
            </Space>
          </S.Header>

          {isSubmitted && showReport ? (
            <S.ReportContainer>
              <S.ReportCard>
                <Space direction="vertical" size="small" style={{ marginBottom: '1.5rem' }}>
                  <Title level={2} style={{ color: '#1a365d', margin: 0 }}>Kết quả làm bài thi Nói</Title>
                  <Text type="secondary" style={{ fontSize: '1rem', fontWeight: 500 }}>
                    Bạn đã hoàn thành {testTitle} kỹ năng Nói
                  </Text>
                </Space>

                <S.ScoreRingWrapper>
                  <Progress 
                    type="circle" 
                    percent={100} 
                    size={140}
                    strokeWidth={10}
                    strokeColor="#10b981"
                    format={() => (
                      <S.ScoreLabel>
                        <span className="score-val" style={{ fontSize: '1.6rem', color: '#10b981' }}>HOÀN THÀNH</span>
                        <span className="score-max">{answeredCount}/12 câu ghi âm</span>
                      </S.ScoreLabel>
                    )}
                  />
                </S.ScoreRingWrapper>

                <S.ReportGrid>
                  <S.ReportStatItem>
                    <span className="stat-label">Số câu trả lời ghi âm</span>
                    <span className="stat-value">{answeredCount} / 12 câu</span>
                  </S.ReportStatItem>
                  <S.ReportStatItem>
                    <span className="stat-label">Tổng thời gian làm bài</span>
                    <span className="stat-value">{formatTime(20 * 60 - timeLeft)}</span>
                  </S.ReportStatItem>
                </S.ReportGrid>

                <div style={{ width: '100%', textAlign: 'left', background: '#f8fafc', padding: '1.25rem 1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '6px', color: '#1a365d', fontWeight: 700 }}>
                    <AlertOutlined /> <span>Lưu ý về tự đánh giá bài Nói:</span>
                  </div>
                  <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>
                    Bài thi Nói là phần thi tự luận được ghi âm trực tiếp. Hãy bấm nút dưới đây để chuyển sang **Chế độ xem lại**, nghe lại bài nói của chính mình và đối chiếu trực tiếp với **Gợi ý đáp án mẫu** của giáo viên và **Mẹo chấm điểm (Tips)** tương ứng từng câu để tự đánh giá mức độ lưu loát, từ vựng và ngữ pháp của bản thân.
                  </p>
                </div>

                <Button 
                  type="primary" 
                  size="large"
                  style={{ borderRadius: '2rem', height: '48px', padding: '0 2.5rem', fontWeight: 700, background: '#1a365d', borderColor: '#1a365d' }}
                  onClick={() => setShowReport(false)}
                >
                  Xem lại chi tiết bài nói & Đáp án mẫu
                </Button>
              </S.ReportCard>
            </S.ReportContainer>
          ) : (
            <>
              <S.ContentBody style={{ overflowY: 'auto' }}>
                <S.WorkspaceGrid>
                  <S.ContentGrid>
                    <S.LeftColumn>
                      <S.ContentCard>
                        <S.TitleArea>
                          <h2>{partTitle}</h2>
                          <div className="subtitle">{partSubtitle}</div>
                        </S.TitleArea>

                        {activePart === 1 && (
                          <S.SubTabContainer>
                            {[1, 2, 3].map((num) => (
                              <S.SubTab
                                key={num}
                                $active={activeQuestionNum === num}
                                $color="#0284c7"
                                onClick={() => handleNavigateQuestion(num)}
                              >
                                Câu {num} {answers[num] ? '✓' : ''}
                              </S.SubTab>
                            ))}
                          </S.SubTabContainer>
                        )}

                        {activePart === 2 && (
                          <S.SubTabContainer>
                            {[4, 5, 6].map((num) => (
                              <S.SubTab
                                key={num}
                                $active={activeQuestionNum === num}
                                $color="#059669"
                                onClick={() => handleNavigateQuestion(num)}
                              >
                                Câu {num - 3} {answers[num] ? '✓' : ''}
                              </S.SubTab>
                            ))}
                          </S.SubTabContainer>
                        )}

                        {activePart === 3 && (
                          <S.SubTabContainer>
                            {[7, 8, 9].map((num) => (
                              <S.SubTab
                                key={num}
                                $active={activeQuestionNum === num}
                                $color="#d97706"
                                onClick={() => handleNavigateQuestion(num)}
                              >
                                Câu {num - 6} {answers[num] ? '✓' : ''}
                              </S.SubTab>
                            ))}
                          </S.SubTabContainer>
                        )}

                        {renderActiveQuestionContent()}
                      </S.ContentCard>
                    </S.LeftColumn>

                    <S.RightColumn>
                      {renderActiveQuestionRight()}
                    </S.RightColumn>
                  </S.ContentGrid>

                  {renderQuestionNav()}
                </S.WorkspaceGrid>
              </S.ContentBody>

              <S.Footer>
                <Button
                  type="default"
                  icon={<ArrowLeftOutlined />}
                  size="large"
                  style={{ borderRadius: '2rem', fontWeight: 600, padding: '0 1.5rem', border: '1px solid #e2e8f0', color: '#64748b' }}
                  onClick={handlePrevQuestion}
                  disabled={activePart === 1}
                >
                  Phần trước
                </Button>

                <span style={{ fontWeight: 700, color: '#475569', fontSize: '0.95rem' }}>
                  Phần {activePart} trên 4 (Câu {activeQuestionNum} / 12)
                </span>

                <Space size="middle">
                  {!isSubmitted && (
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
                      onClick={handleSubmitClick}
                    >
                      Nộp bài
                    </Button>
                  )}
                  {isSubmitted && (
                    <Button
                      type="default"
                      icon={<RollbackOutlined />}
                      size="large"
                      style={{ borderRadius: '2rem', fontWeight: 600, padding: '0 1.5rem', border: '1px solid #cbd5e1' }}
                      onClick={() => navigate({ to: '/speaking' })}
                    >
                      Thoát xem lại
                    </Button>
                  )}
                  <Button
                    type="primary"
                    size="large"
                    style={{
                      borderRadius: '2rem',
                      fontWeight: 600,
                      background: '#2563eb',
                      borderColor: '#2563eb',
                      padding: '0 1.5rem',
                      boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
                    }}
                    onClick={handleNextQuestion}
                    disabled={activePart === 4}
                  >
                    Phần tiếp theo <ArrowRightOutlined style={{ fontSize: '12px' }} />
                  </Button>
                </Space>
              </S.Footer>
            </>
          )}
        </S.PageContainer>
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default SpeakingMockTestPage;
