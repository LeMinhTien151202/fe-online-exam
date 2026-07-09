import {
  AlertOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DownOutlined,
  LeftOutlined,
  RollbackOutlined,
  UnlockOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { Button, Empty, Progress, Space, Spin, Tooltip, Typography } from 'antd';
import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import { SpeakingController } from '../../../components/SpeakingController';
import { SpeakingSet } from '../../../services/mappers';
import { SpeakingNavItem } from '../hook/useMockTest';
import { useMockTest } from '../hook/useMockTest';
import * as S from '../styles/styled';

const { Title, Text, Paragraph } = Typography;

const PART_META: Record<number, { title: string; subtitle: string; color: string; header: string }> = {
  1: {
    title: 'Trả lời 3 câu hỏi ngắn về bản thân',
    subtitle: 'Speaking Part 1 • Personal Information',
    color: '#0284c7',
    header: 'Part 1: Personal Information',
  },
  2: {
    title: 'Miêu tả tranh và trả lời câu hỏi',
    subtitle: 'Speaking Part 2 • Describe, Express Opinion & Explain',
    color: '#059669',
    header: 'Part 2: Describe, Express Opinion & Explain',
  },
  3: {
    title: 'So sánh hai bức tranh và trả lời câu hỏi',
    subtitle: 'Speaking Part 3 • Compare & Provide Reasons',
    color: '#ea580c',
    header: 'Part 3: Compare & Provide Reasons',
  },
  4: {
    title: 'Trả lời liên tục 3 câu hỏi về chủ đề',
    subtitle: 'Speaking Part 4 • Abstract Topic',
    color: '#7c3aed',
    header: 'Part 4: Abstract Topic',
  },
};

export const SpeakingMockTestPage = () => {
  const {
    isLoading,
    isError,
    testTitle,
    examData,
    navItems,
    totalQuestions,
    answers,
    timeLeft,
    isSubmitted,
    showReport,
    setShowReport,
    showSampleMap,
    activeQuestionNum,
    activePart,
    activeSetIndex,
    activeSubIndex,
    availableParts,
    formatTime,
    answeredCount,
    handleRetry,
    handleBackToLanding,
    handleNavigateQuestion,
    handlePrevStep,
    handleNextStep,
    handleSubmitClick,
    toggleSample,
    markRecorded,
    isSubDone,
    handleSubTabChange,
    hasPrevStep,
    hasNextStep,
    prevStepIsSamePart,
    nextStepIsSamePart,
    navigate,
  } = useMockTest();

  if (isLoading) {
    return (
      <HomeS.MainLayout>
        <Sidebar />
        <HomeS.RightColumn>
          <S.PageContainer>
            <S.Header>
              <Space size="large">
                <Button type="text" icon={<LeftOutlined />} onClick={() => navigate({ to: '/speaking' })} style={{ color: '#cbd5e1', fontWeight: 'bold' }}>
                  Quay lại
                </Button>
                <S.HeaderTitle>Đang tải đề nói...</S.HeaderTitle>
              </Space>
            </S.Header>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Spin size="large" tip="Đang tải đề nói từ hệ thống..." />
            </div>
          </S.PageContainer>
        </HomeS.RightColumn>
      </HomeS.MainLayout>
    );
  }

  if (isError || !examData || totalQuestions === 0) {
    return (
      <HomeS.MainLayout>
        <Sidebar />
        <HomeS.RightColumn>
          <S.PageContainer>
            <S.Header>
              <Space size="large">
                <Button type="text" icon={<LeftOutlined />} onClick={() => navigate({ to: '/speaking' })} style={{ color: '#cbd5e1', fontWeight: 'bold' }}>
                  Quay lại
                </Button>
                <S.HeaderTitle>Không có dữ liệu đề nói</S.HeaderTitle>
              </Space>
            </S.Header>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Empty description="Đề nói chưa có câu hỏi hoặc chưa được công khai." />
            </div>
          </S.PageContainer>
        </HomeS.RightColumn>
      </HomeS.MainLayout>
    );
  }

  const meta = PART_META[activePart] ?? PART_META[1];
  const partPosition = availableParts.indexOf(activePart) + 1;

  const sampleKey = `p${activePart}-${activeSetIndex}-${activeSubIndex}`;

  const renderSample = (sampleAnswers: string[], color: string, title = 'Xem đáp án mẫu') => {
    if (!isSubmitted || sampleAnswers.length === 0) return null;
    const isOpen = showSampleMap[sampleKey] ?? false;
    return (
      <S.CollapsibleWrapper>
        <S.CollapsibleHeader onClick={() => toggleSample(sampleKey)}>
          <span>
            <UnlockOutlined style={{ marginRight: '8px', color }} />
            {title}
          </span>
          {isOpen ? <UpOutlined /> : <DownOutlined />}
        </S.CollapsibleHeader>
        {isOpen && (
          <S.CollapsibleBody>
            <Paragraph style={{ fontStyle: 'italic', color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {sampleAnswers[0]}
            </Paragraph>
          </S.CollapsibleBody>
        )}
      </S.CollapsibleWrapper>
    );
  };

  const renderPart1Content = () => {
    const question = examData.part1[activeSubIndex - 1] ?? examData.part1[0];
    if (!question) return <Empty description="Part 1 chưa có câu hỏi." />;
    return (
      <S.QuestionBox $borderColor="#0284c7">
        <div className="q-badge">Câu hỏi {activeSubIndex}</div>
        <div className="q-text">{question.questionText}</div>
      </S.QuestionBox>
    );
  };

  const getActiveSet = (sets: SpeakingSet[]) => sets[activeSetIndex] ?? sets[0] ?? null;

  const renderPart2Content = () => {
    const set = getActiveSet(examData.part2);
    const question = set?.questions[activeSubIndex - 1];
    if (!set || !question) return <Empty description="Part 2 chưa có câu hỏi." />;
    return (
      <S.SectionColumn>
        {set.imageUrls[0] && (
          <S.ImageWrapper $height="280px">
            <img src={set.imageUrls[0]} alt="Speaking Part 2" />
          </S.ImageWrapper>
        )}
        <S.SubTabContainer>
          {set.questions.map((_, index) => {
            const subIndex = index + 1;
            return (
              <S.SubTab key={subIndex} $active={activeSubIndex === subIndex} $color="#059669" onClick={() => handleSubTabChange(subIndex)}>
                Câu {subIndex} {isSubDone(2, activeSetIndex, subIndex) && '✓'}
              </S.SubTab>
            );
          })}
        </S.SubTabContainer>
        <S.QuestionBox $borderColor="#059669">
          <div className="q-badge">{activeSubIndex === 1 ? 'Mô tả tranh (Describe)' : 'Câu hỏi mở rộng (Explain)'}</div>
          <div className="q-text">{question.questionText}</div>
        </S.QuestionBox>
      </S.SectionColumn>
    );
  };

  const renderPart3Content = () => {
    const set = getActiveSet(examData.part3);
    const question = set?.questions[activeSubIndex - 1];
    if (!set || !question) return <Empty description="Part 3 chưa có câu hỏi." />;
    return (
      <S.SectionColumn>
        <S.PhotosGrid>
          {set.imageUrls.slice(0, 2).map((url, index) => (
            <S.ImageWrapper key={url || index} $height="220px">
              <img src={url} alt={`Speaking Part 3 hình ${index + 1}`} />
            </S.ImageWrapper>
          ))}
        </S.PhotosGrid>
        <S.SubTabContainer>
          {set.questions.map((_, index) => {
            const subIndex = index + 1;
            return (
              <S.SubTab key={subIndex} $active={activeSubIndex === subIndex} $color="#ea580c" onClick={() => handleSubTabChange(subIndex)}>
                Câu {subIndex} {isSubDone(3, activeSetIndex, subIndex) && '✓'}
              </S.SubTab>
            );
          })}
        </S.SubTabContainer>
        <S.QuestionBox $borderColor="#ea580c">
          <div className="q-badge">{activeSubIndex === 1 ? 'So sánh hai tranh (Compare)' : 'Giải thích nguyên nhân (Reasons)'}</div>
          <div className="q-text">{question.questionText}</div>
        </S.QuestionBox>
      </S.SectionColumn>
    );
  };

  const renderPart4Content = () => {
    const set = getActiveSet(examData.part4);
    if (!set) return <Empty description="Part 4 chưa có câu hỏi." />;
    return (
      <S.SectionColumn>
        {set.imageUrls[0] && (
          <S.ImageWrapper $height="320px">
            <img src={set.imageUrls[0]} alt="Speaking Part 4" />
          </S.ImageWrapper>
        )}
        <S.QListWrapper>
          {set.questions.map((question, index) => (
            <S.QListItem key={question.id} $borderColor="#7c3aed">
              <div className="q-num">{index + 1}</div>
              <div className="q-content">{question.questionText}</div>
            </S.QListItem>
          ))}
        </S.QListWrapper>
      </S.SectionColumn>
    );
  };

  const renderActiveQuestionContent = () => {
    if (activePart === 1) return renderPart1Content();
    if (activePart === 2) return renderPart2Content();
    if (activePart === 3) return renderPart3Content();
    return renderPart4Content();
  };

  const getActiveSampleAnswers = () => {
    if (activePart === 1) return examData.part1[activeSubIndex - 1]?.sampleAnswers ?? [];
    if (activePart === 2) return getActiveSet(examData.part2)?.questions[activeSubIndex - 1]?.sampleAnswers ?? [];
    if (activePart === 3) return getActiveSet(examData.part3)?.questions[activeSubIndex - 1]?.sampleAnswers ?? [];
    const set = getActiveSet(examData.part4);
    return set?.questions
      .filter((question) => question.sampleAnswers[0])
      .map((question, index) => `${index + 1}. ${question.questionText}\n→ ${question.sampleAnswers[0]}`) ?? [];
  };

  const renderActiveQuestionRight = () => {
    const sampleAnswers = getActiveSampleAnswers();
    const recordTime = activePart === 1 ? 30 : activePart === 4 ? 120 : 45;
    const prepTime = activePart === 4 ? 60 : activePart === 1 ? 0 : 45;
    return (
      <>
        <SpeakingController
          prepTime={prepTime}
          recordingTime={recordTime}
          statusColor={meta.color}
          title={`speaking-exam-p${activePart}-s${activeSetIndex + 1}-q${activeSubIndex}`}
          onCompleted={markRecorded}
        />
        {renderSample(sampleAnswers, meta.color, activePart === 4 ? 'Xem đáp án mẫu (Tất cả câu)' : 'Xem đáp án mẫu')}
      </>
    );
  };

  const groupedNav = availableParts.map((partNumber) => ({
    partNumber,
    items: navItems.filter((item) => item.partNumber === partNumber),
  }));

  const renderQuestionNav = () => {
    const getStatus = (item: SpeakingNavItem): 'unanswered' | 'answered' => {
      return answers[`p${item.partNumber}-${item.setIndex}-${item.subIndex}`] ? 'answered' : 'unanswered';
    };

    return (
      <S.NavPanel>
        <S.PanelTitle>Bảng câu hỏi</S.PanelTitle>
        {groupedNav.map((group) => (
          <div key={group.partNumber}>
            <S.SectionLabel>Part {group.partNumber}</S.SectionLabel>
            <S.ButtonGrid>
              {group.items.map((item) => {
                const status = getStatus(item);
                const isActive = activeQuestionNum === item.qNum;
                return (
                  <Tooltip key={item.qNum} title={`Câu ${item.qNum}: ${status === 'answered' ? 'Đã thu âm' : 'Chưa thu âm'}`}>
                    <S.NavGridButton
                      $active={isActive}
                      $status={status}
                      onClick={() => handleNavigateQuestion(item.qNum)}
                    >
                      {item.qNum}
                    </S.NavGridButton>
                  </Tooltip>
                );
              })}
            </S.ButtonGrid>
          </div>
        ))}
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

  return (
    <HomeS.MainLayout>
      <Sidebar />
      <HomeS.RightColumn>
        <S.PageContainer>
          <S.Header>
            <Space size="large">
              <Button type="text" icon={<LeftOutlined />} onClick={handleBackToLanding} style={{ color: '#cbd5e1', fontWeight: 'bold' }}>
                Quay lại
              </Button>
              <S.HeaderTitle>{testTitle} • {meta.header}</S.HeaderTitle>
            </Space>

            <Space size="large" style={{ display: 'flex', alignItems: 'center' }}>
              {isSubmitted ? (
                <Space>
                  <Button type="primary" onClick={() => setShowReport(true)} style={{ background: '#1a365d', borderColor: '#1a365d', borderRadius: '2rem', fontWeight: 700 }}>
                    Xem báo cáo
                  </Button>
                  <Button type="primary" icon={<RollbackOutlined />} onClick={handleRetry} style={{ background: '#6366f1', borderColor: '#6366f1', borderRadius: '2rem', fontWeight: 700 }}>
                    Thi lại đề này
                  </Button>
                </Space>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 700 }}>TIẾN ĐỘ:</span>
                    <Progress
                      type="circle"
                      percent={Math.round((answeredCount / totalQuestions) * 100)}
                      size={40}
                      strokeColor="#10b981"
                      trailColor="rgba(255,255,255,0.2)"
                      format={() => (
                        <span style={{ color: 'white', fontSize: '11px', fontWeight: 'bold' }}>
                          {answeredCount}/{totalQuestions}
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
                    Bạn đã hoàn thành {testTitle}
                  </Text>
                </Space>
                <S.ScoreRingWrapper>
                  <Progress
                    type="circle"
                    percent={Math.round((answeredCount / totalQuestions) * 100)}
                    size={140}
                    strokeWidth={10}
                    strokeColor="#10b981"
                    format={() => (
                      <S.ScoreLabel>
                        <span className="score-val">{answeredCount}</span>
                        <span className="score-max">/ {totalQuestions} câu ghi âm</span>
                      </S.ScoreLabel>
                    )}
                  />
                </S.ScoreRingWrapper>
                <S.ReportGrid>
                  <S.ReportStatItem>
                    <span className="stat-label">Số câu đã ghi âm</span>
                    <span className="stat-value">{answeredCount} / {totalQuestions}</span>
                  </S.ReportStatItem>
                  <S.ReportStatItem>
                    <span className="stat-label">Thời gian đã dùng</span>
                    <span className="stat-value">{formatTime(20 * 60 - timeLeft)}</span>
                  </S.ReportStatItem>
                </S.ReportGrid>
                <div style={{ width: '100%', textAlign: 'left', background: '#f8fafc', padding: '1.25rem 1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '6px', color: '#1a365d', fontWeight: 700 }}>
                    <AlertOutlined /> <span>Lưu ý về tự đánh giá bài Nói:</span>
                  </div>
                  <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>
                    Hãy chuyển sang chế độ xem lại, nghe lại bài nói của bạn và đối chiếu với đáp án mẫu nếu giáo viên đã nhập.
                  </p>
                </div>
                <Button type="primary" size="large" style={{ borderRadius: '2rem', height: '48px', padding: '0 2.5rem', fontWeight: 700, background: '#1a365d', borderColor: '#1a365d' }} onClick={() => setShowReport(false)}>
                  Xem lại chi tiết bài nói & đáp án mẫu
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
                          <h2>{meta.title}</h2>
                          <div className="subtitle">{meta.subtitle}</div>
                        </S.TitleArea>
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
                <Button type="default" icon={<ArrowLeftOutlined />} size="large" style={{ borderRadius: '2rem', fontWeight: 600, padding: '0 1.5rem', border: '1px solid #e2e8f0', color: '#64748b' }} onClick={handlePrevStep} disabled={!hasPrevStep}>
                  {prevStepIsSamePart ? 'Câu trước' : 'Phần trước'}
                </Button>

                <span style={{ fontWeight: 700, color: '#475569', fontSize: '0.95rem' }}>
                  Phần {partPosition} trên {availableParts.length} (Câu {activeQuestionNum} / {totalQuestions})
                </span>

                <Space size="middle">
                  {!isSubmitted && (
                    <Button type="primary" icon={<CheckCircleOutlined />} size="large" style={{ borderRadius: '2rem', fontWeight: 600, background: '#10b981', borderColor: '#10b981', padding: '0 2rem', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)' }} onClick={handleSubmitClick}>
                      Nộp bài
                    </Button>
                  )}
                  {isSubmitted && (
                    <Button type="default" icon={<RollbackOutlined />} size="large" style={{ borderRadius: '2rem', fontWeight: 600, padding: '0 1.5rem', border: '1px solid #cbd5e1' }} onClick={() => navigate({ to: '/speaking' })}>
                      Thoát xem lại
                    </Button>
                  )}
                  <Button type="primary" size="large" style={{ borderRadius: '2rem', fontWeight: 600, background: '#2563eb', borderColor: '#2563eb', padding: '0 1.5rem', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' }} onClick={handleNextStep} disabled={!hasNextStep}>
                    {nextStepIsSamePart ? 'Câu tiếp theo' : 'Phần tiếp theo'} <ArrowRightOutlined style={{ fontSize: '12px' }} />
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
