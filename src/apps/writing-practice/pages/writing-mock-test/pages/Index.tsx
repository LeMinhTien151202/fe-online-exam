import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DownOutlined,
  LeftOutlined,
  RobotOutlined,
  RollbackOutlined,
  UnlockOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Button, Card, Empty, Progress, Space, Spin, Tag, Typography } from 'antd';
import { Sidebar } from '../../../../home/components/Sidebar';
import { confirmExitExam, confirmSubmitExam } from '../../../../../shared/utils/examDialogs';
import * as HomeS from '../../../../home/pages/styled';
import { WritingPromptItem } from '../../../services/writingExamMapper';
import * as W from '../../writing-part1/styles/styled';
import { useWritingMockTest } from '../hook/useWritingMockTest';
import * as S from '../styles/styled';

const { Title, Text } = Typography;

const AVATAR_COLORS = ['#3b82f6', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6'];

const PART_META: Record<number, { label: string; title: string; subtitle: string; color: string }> = {
  1: {
    label: 'Part 1',
    title: 'Nhập thông tin cơ bản vào biểu mẫu đăng ký',
    subtitle: 'Writing Part 1 • Fill out the form',
    color: '#0284c7',
  },
  2: {
    label: 'Part 2',
    title: 'Giới thiệu bản thân ngắn gọn cho câu lạc bộ',
    subtitle: 'Writing Part 2 • Write in sentences',
    color: '#4f46e5',
  },
  3: {
    label: 'Part 3',
    title: 'Tương tác trong nhóm chat/diễn đàn câu lạc bộ',
    subtitle: 'Writing Part 3 • Chat with other members',
    color: '#d97706',
  },
  4: {
    label: 'Part 4',
    title: 'Question 4 of 4 - Email Writing',
    subtitle: 'Write a short email to your friend, and a longer formal email.',
    color: '#7c3aed',
  },
};

export const WritingMockTestPage = () => {
  const { testId } = useParams({ strict: false }) as { testId: string };
  const navigate = useNavigate();

  const {
    isLoading,
    isError,
    examTitle,
    prompts,
    totalQuestions,
    activePart,
    activePartPrompts,
    availableParts,
    answers,
    answeredCount,
    timeLeft,
    isSubmitted,
    showReport,
    showSampleMap,
    submitResult,
    isSubmitting,
    setShowReport,
    setActivePart,
    handleAnswerChange,
    handlePrevPart,
    handleNextPart,
    handleManualSubmit,
    handleRetry,
    toggleSample,
    getWordCount,
    isWordCountValid,
    formatTime,
  } = useWritingMockTest(testId);

  // Điểm tổng dạng band A1..C. Dùng thẳng `score` BE trả về (tính trên TOÀN đề,
  // câu bỏ trống = 0% — đúng số đã lưu vào exam_attempts). Nếu AI chưa chấm được
  // câu nào (score = 0 do toàn bộ chờ chấm tay) thì tạm tính "nhẹ tay" theo số từ.
  const scoreToBand = (score: number): string => {
    if (score >= 85) return 'C';
    if (score >= 70) return 'B2';
    if (score >= 55) return 'B1';
    if (score >= 40) return 'A2';
    return 'A1';
  };

  const overall = (() => {
    if (!submitResult) return null;
    const hasScored = submitResult.ai.some((a) => a.aiScore != null);
    if (hasScored) {
      const percent = Math.round(submitResult.score);
      return { band: scoreToBand(percent), percent, fromAi: true };
    }
    // AI chưa chấm được phần nào (needsManualReview) -> tạm tính theo số phần đạt đủ số từ.
    const validCount = prompts.filter((p) => isWordCountValid(p.id)).length;
    const percent = prompts.length ? Math.round((validCount / prompts.length) * 100) : 0;
    return { band: scoreToBand(percent), percent, fromAi: false };
  })();

  const bandColor = (band: string) => (band === 'C' ? '#10b981' : band.startsWith('B') ? '#3b5b8c' : '#f59e0b');

  // Chưa có kết quả AI (đang chấm) -> chờ, không hiện điểm/đáp án mẫu vội.
  const isGrading = isSubmitted && (isSubmitting || !submitResult);

  const handleBackToLanding = () => {
    if (isSubmitted) {
      navigate({ to: '/writing' });
      return;
    }
    confirmExitExam({
      content: 'Tiến độ làm bài viết của bạn sẽ không được lưu nếu bạn thoát ra lúc này.',
      onOk: () => navigate({ to: '/writing' }),
    });
  };

  const handleSubmitClick = () => {
    const unansweredCount = totalQuestions - answeredCount;
    confirmSubmitExam({ unansweredCount, totalQuestions, onOk: handleManualSubmit });
  };

  if (isLoading) {
    return (
      <HomeS.MainLayout>
        <Sidebar />
        <HomeS.RightColumn>
          <S.PageContainer>
            <S.Header>
              <Space size="large">
                <Button type="text" icon={<LeftOutlined />} onClick={() => navigate({ to: '/writing' })} style={{ color: '#cbd5e1', fontWeight: 'bold' }}>
                  Quay lại
                </Button>
                <S.HeaderTitle>Đang tải đề viết...</S.HeaderTitle>
              </Space>
            </S.Header>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Spin size="large" tip="Đang tải đề viết từ hệ thống..." />
            </div>
          </S.PageContainer>
        </HomeS.RightColumn>
      </HomeS.MainLayout>
    );
  }

  if (isError || totalQuestions === 0 || activePartPrompts.length === 0) {
    return (
      <HomeS.MainLayout>
        <Sidebar />
        <HomeS.RightColumn>
          <S.PageContainer>
            <S.Header>
              <Space size="large">
                <Button type="text" icon={<LeftOutlined />} onClick={() => navigate({ to: '/writing' })} style={{ color: '#cbd5e1', fontWeight: 'bold' }}>
                  Quay lại
                </Button>
                <S.HeaderTitle>Không có dữ liệu đề viết</S.HeaderTitle>
              </Space>
            </S.Header>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Empty description="Đề viết chưa có câu hỏi hoặc chưa được công khai." />
            </div>
          </S.PageContainer>
        </HomeS.RightColumn>
      </HomeS.MainLayout>
    );
  }

  const activeMeta = PART_META[activePart] ?? PART_META[1];
  const partPosition = availableParts.indexOf(activePart) + 1;
  const hasSample = activePartPrompts.some((prompt) => prompt.sampleAnswer);

  const renderWordMeta = (prompt: WritingPromptItem) => {
    const answer = answers[prompt.id] ?? '';
    const wordCount = getWordCount(prompt.id);
    const isValid = isWordCountValid(prompt.id);
    return (
      <div className="flex justify-between items-center min-h-[1.5rem]">
        <div className="flex-1">
          {answer && !isValid && (
            <W.ErrorText>
              {wordCount < prompt.minWords ? `Cần thêm ${prompt.minWords - wordCount} từ` : `Cần bớt ${wordCount - prompt.maxWords} từ`}
            </W.ErrorText>
          )}
        </div>
        {answer && (
          <W.ModernWordBadge $isValid={isValid} $hasText={!!answer}>
            {wordCount} / {prompt.minWords}-{prompt.maxWords} từ
          </W.ModernWordBadge>
        )}
      </div>
    );
  };

  const renderSampleReview = () => {
    if (!isSubmitted || !hasSample || isGrading) return null;
    return (
      <S.CollapsibleWrapper>
        <S.CollapsibleHeader onClick={() => toggleSample(activePart)}>
          <span>
            <UnlockOutlined style={{ marginRight: '8px', color: activeMeta.color }} />
            Gợi ý đáp án mẫu
          </span>
          {showSampleMap[activePart] ? <UpOutlined /> : <DownOutlined />}
        </S.CollapsibleHeader>
        {showSampleMap[activePart] && (
          <S.CollapsibleBody>
            <W.SampleModalList>
              {activePartPrompts.map((prompt) => (
                <W.SampleModalItem key={prompt.id}>
                  <W.SampleModalHeader>{prompt.title}</W.SampleModalHeader>
                  <W.SampleModalQuestionText>&ldquo;{prompt.prompt}&rdquo;</W.SampleModalQuestionText>
                  <W.SampleModalAnswerText>&rarr; {prompt.sampleAnswer || '(chưa có)'}</W.SampleModalAnswerText>
                  {prompt.sampleAnswer && (
                    <W.SampleModalWordCount>Số từ: {prompt.sampleAnswer.trim().split(/\s+/).length} từ</W.SampleModalWordCount>
                  )}
                </W.SampleModalItem>
              ))}
            </W.SampleModalList>
          </S.CollapsibleBody>
        )}
      </S.CollapsibleWrapper>
    );
  };

  const renderPart1 = () => {
    const firstPrompt = activePartPrompts[0];
    return (
      <S.SectionColumn>
        {firstPrompt?.instruction && (
          <W.InstructionBox $borderColor="#0284c7" className="mb-4 text-[0.9rem] py-3 px-4">
            {firstPrompt.instruction}
          </W.InstructionBox>
        )}
        <W.QuestionsWrapper>
          {activePartPrompts.map((prompt) => {
            const answer = answers[prompt.id] ?? '';
            return (
              <W.QuestionItem key={prompt.id} className="mb-0 gap-1">
                <div className="q-text text-[0.92rem] font-bold">
                  {prompt.id}. {prompt.prompt}
                </div>
                <W.ModernInput
                  placeholder="Nhập câu trả lời của bạn tại đây..."
                  value={answer}
                  onChange={(event) => handleAnswerChange(prompt.id, event.target.value)}
                  $isValid={isWordCountValid(prompt.id)}
                  $hasText={!!answer}
                  disabled={isSubmitted}
                />
                {renderWordMeta(prompt)}
              </W.QuestionItem>
            );
          })}
        </W.QuestionsWrapper>
        {renderSampleReview()}
      </S.SectionColumn>
    );
  };

  const renderPart2 = () => {
    const prompt = activePartPrompts[0];
    const answer = answers[prompt.id] ?? '';
    return (
      <S.SectionColumn>
        <W.InstructionBox $borderColor="#4f46e5">
          Write in sentences. Use {prompt.minWords}-{prompt.maxWords} words. (Khuyên dùng: Dành ra khoảng 3 phút cho phần này).
        </W.InstructionBox>
        <div className="text-[1.05rem] font-bold text-[#0f172a]">
          Prompt: {prompt.prompt}
        </div>
        <W.ModernTextArea
          placeholder={`Nhập đoạn văn của bạn tại đây (${prompt.minWords} - ${prompt.maxWords} từ)...`}
          value={answer}
          onChange={(event) => handleAnswerChange(prompt.id, event.target.value)}
          rows={6}
          $isValid={isWordCountValid(prompt.id)}
          $hasText={!!answer}
          disabled={isSubmitted}
        />
        {renderWordMeta(prompt)}
        {renderSampleReview()}
      </S.SectionColumn>
    );
  };

  const renderPart3 = () => (
    <S.SectionColumn>
      <W.InstructionText>
        Respond to fellow members in full sentences ({activePartPrompts[0]?.minWords}-{activePartPrompts[0]?.maxWords} words per answer).
      </W.InstructionText>
      <div className="flex flex-col gap-6">
        {activePartPrompts.map((prompt, idx) => {
          const answer = answers[prompt.id] ?? '';
          const avatar = prompt.title.charAt(0).toUpperCase();
          const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
          return (
            <div key={prompt.id} className="flex flex-col gap-2">
              <W.ChatHeader>
                <W.AvatarBadge $bgColor={avatarColor}>{avatar}</W.AvatarBadge>
                <W.SenderName>{prompt.title.replace(': Chat response', '')}</W.SenderName>
              </W.ChatHeader>
              <W.ChatMessageText className="self-start max-w-[85%]">
                {prompt.prompt}
              </W.ChatMessageText>
              <W.ModernTextArea
                placeholder={`Trả lời tại đây (${prompt.minWords} - ${prompt.maxWords} từ)...`}
                value={answer}
                onChange={(event) => handleAnswerChange(prompt.id, event.target.value)}
                rows={4}
                $isValid={isWordCountValid(prompt.id)}
                $hasText={!!answer}
                disabled={isSubmitted}
              />
              {renderWordMeta(prompt)}
            </div>
          );
        })}
      </div>
      {renderSampleReview()}
    </S.SectionColumn>
  );

  const renderPart4 = () => {
    const informal = activePartPrompts[0];
    const formal = activePartPrompts[1];
    return (
      <S.SectionColumn>
        <W.InstructionBox $borderColor="#3b82f6" className="mb-6 p-4 text-[0.9rem] bg-[#eff6ff] text-[#244b80]">
          <W.SituationTitle>Tình huống giả định (Club Notification)</W.SituationTitle>
          <W.SituationBody>{informal?.instruction}</W.SituationBody>
        </W.InstructionBox>
        <W.EmailSectionWrapper>
          {informal && (
            <W.EmailGroup>
              <div>
                <W.EmailHeaderLabel>1. Thư thân mật (Informal Email)</W.EmailHeaderLabel>
                <W.EmailPromptText>{informal.prompt}</W.EmailPromptText>
              </div>
              <W.ModernTextArea
                placeholder={`Viết thư gửi cho bạn của bạn tại đây (${informal.minWords} - ${informal.maxWords} từ)...`}
                value={answers[informal.id] ?? ''}
                onChange={(event) => handleAnswerChange(informal.id, event.target.value)}
                rows={10}
                $isValid={isWordCountValid(informal.id)}
                $hasText={!!answers[informal.id]}
                disabled={isSubmitted}
              />
              {renderWordMeta(informal)}
            </W.EmailGroup>
          )}
          {formal && (
            <W.EmailGroup>
              <div>
                <W.EmailHeaderLabel2>2. Thư trang trọng (Formal Email)</W.EmailHeaderLabel2>
                <W.EmailPromptText>{formal.prompt}</W.EmailPromptText>
              </div>
              <W.ModernTextArea
                placeholder={`Viết thư trang trọng tại đây (${formal.minWords} - ${formal.maxWords} từ)...`}
                value={answers[formal.id] ?? ''}
                onChange={(event) => handleAnswerChange(formal.id, event.target.value)}
                rows={10}
                $isValid={isWordCountValid(formal.id)}
                $hasText={!!answers[formal.id]}
                disabled={isSubmitted}
              />
              {renderWordMeta(formal)}
            </W.EmailGroup>
          )}
        </W.EmailSectionWrapper>
        {renderSampleReview()}
      </S.SectionColumn>
    );
  };

  const renderActivePart = () => {
    if (activePart === 1) return renderPart1();
    if (activePart === 2) return renderPart2();
    if (activePart === 3) return renderPart3();
    return renderPart4();
  };

  const renderQuestionNav = () => (
    <S.NavPanel>
      <S.PanelTitle>Bảng câu hỏi</S.PanelTitle>
      {availableParts.map((partNumber) => {
        const partPrompts = prompts.filter((prompt) => prompt.partNumber === partNumber);
        const answeredInPart = partPrompts.filter((prompt) => answers[prompt.id]?.trim()).length;
        const status = answeredInPart === partPrompts.length ? 'answered' : 'unanswered';
        const meta = PART_META[partNumber] ?? PART_META[1];
        return (
          <div key={partNumber} style={{ marginBottom: '0.75rem' }}>
            <S.SectionLabel>{meta.label}</S.SectionLabel>
            <S.NavGridButton
              $active={activePart === partNumber}
              $status={status}
              onClick={() => setActivePart(partNumber)}
              style={{ width: '100%', aspectRatio: 'auto', minHeight: '2.75rem' }}
            >
              {answeredInPart}/{partPrompts.length}
            </S.NavGridButton>
          </div>
        );
      })}
      <S.Legend>
        <S.LegendItem>
          <div className="color-dot" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1' }} />
          <span>Chưa hoàn thành phần</span>
        </S.LegendItem>
        <S.LegendItem>
          <div className="color-dot" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }} />
          <span>Đã viết đủ phần</span>
        </S.LegendItem>
        <S.LegendItem>
          <div className="color-dot" style={{ background: 'white', border: '1.5px solid #1a365d' }} />
          <span>Đang chọn</span>
        </S.LegendItem>
      </S.Legend>
    </S.NavPanel>
  );

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
              <S.HeaderTitle>{examTitle}</S.HeaderTitle>
            </Space>

            <Space size="large" style={{ display: 'flex', alignItems: 'center' }}>
              {isSubmitted ? (
                <Space>
                  <Button type="primary" onClick={() => setShowReport(true)} style={{ background: '#1a365d', borderColor: '#1a365d', borderRadius: '2rem', fontWeight: 700 }}>
                    Xem báo cáo
                  </Button>
                  <Button type="primary" icon={<RollbackOutlined />} onClick={handleRetry} style={{ background: '#6366f1', borderColor: '#6366f1', borderRadius: '2rem', fontWeight: 700 }}>
                    Làm lại đề này
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

          {isSubmitted && showReport && isGrading ? (
            <S.ReportContainer>
              <S.ReportCard>
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <Spin size="large" />
                  <Title level={3} style={{ color: '#1a365d', marginTop: '1.5rem' }}>
                    <RobotOutlined style={{ color: '#6366f1', marginRight: 8 }} />
                    AI đang chấm toàn bộ bài viết của bạn...
                  </Title>
                  <Text type="secondary" style={{ fontSize: '1rem' }}>
                    Vui lòng chờ trong giây lát. Điểm tổng (band A–C) sẽ hiển thị ngay khi AI chấm xong.
                  </Text>
                </div>
              </S.ReportCard>
            </S.ReportContainer>
          ) : isSubmitted && showReport ? (
            <S.ReportContainer>
              <S.ReportCard>
                <Space direction="vertical" size="small" style={{ marginBottom: '1.5rem' }}>
                  <Title level={2} style={{ color: '#1a365d', margin: 0 }}>Kết quả làm bài thi Viết</Title>
                  <Text type="secondary" style={{ fontSize: '1rem', fontWeight: 500 }}>
                    Bạn đã hoàn thành {examTitle}
                  </Text>
                </Space>
                <S.ScoreRingWrapper>
                  <Progress
                    type="circle"
                    percent={overall?.percent ?? 0}
                    size={140}
                    strokeWidth={10}
                    strokeColor={bandColor(overall?.band ?? 'A1')}
                    format={() => (
                      <S.ScoreLabel>
                        <span className="score-val">{overall?.band ?? '—'}</span>
                        <span className="score-max">Band tổng</span>
                      </S.ScoreLabel>
                    )}
                  />
                </S.ScoreRingWrapper>
                {overall && !overall.fromAi && (
                  <Text type="secondary" style={{ display: 'block', marginBottom: '1rem', fontSize: '0.85rem' }}>
                    (AI chưa chấm được — điểm tạm tính theo số phần đạt đủ số từ)
                  </Text>
                )}
                <S.ReportGrid>
                  <S.ReportStatItem>
                    <span className="stat-label">Số câu đã hoàn thành</span>
                    <span className="stat-value">{answeredCount} / {totalQuestions}</span>
                  </S.ReportStatItem>
                  <S.ReportStatItem>
                    <span className="stat-label">Thời gian đã dùng</span>
                    <span className="stat-value">{formatTime(50 * 60 - timeLeft)}</span>
                  </S.ReportStatItem>
                </S.ReportGrid>
                {submitResult && submitResult.ai.length > 0 && (
                  <Card
                    title={<Space><RobotOutlined style={{ color: '#6366f1' }} /> AI chấm bài Viết</Space>}
                    style={{ borderRadius: 16, marginBottom: '2rem', textAlign: 'left', width: '100%' }}
                  >
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                      {submitResult.ai.map((item) => (
                        <div key={item.questionId} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <Space>
                              <Tag color="purple">{item.questionType}</Tag>
                              {item.band && <Tag color="green">Band {item.band}</Tag>}
                            </Space>
                            {item.aiScore != null ? (
                              <b style={{ color: '#10b981' }}>{item.aiScore}/100</b>
                            ) : (
                              <Tag color="warning">Chờ chấm tay</Tag>
                            )}
                          </div>
                          <Text style={{ color: '#475569', fontSize: '0.9rem' }}>
                            {item.feedback || 'Chưa có nhận xét.'}
                          </Text>
                        </div>
                      ))}
                    </Space>
                  </Card>
                )}
                <Button type="primary" size="large" style={{ borderRadius: '2rem', height: '48px', padding: '0 2.5rem', fontWeight: 700, background: '#1a365d', borderColor: '#1a365d' }} onClick={() => setShowReport(false)}>
                  Xem lại bài viết và đáp án mẫu
                </Button>
              </S.ReportCard>
            </S.ReportContainer>
          ) : (
            <>
              <S.ContentBody>
                <S.WorkspaceGrid>
                  <S.QuestionsColumn>
                    <S.ContentCard>
                      <S.TitleArea>
                        <h2>{activeMeta.title}</h2>
                        <div className="subtitle">{activeMeta.subtitle}</div>
                        <Tag color="blue">{activeMeta.label}</Tag>
                      </S.TitleArea>
                      {renderActivePart()}
                    </S.ContentCard>
                  </S.QuestionsColumn>
                  {renderQuestionNav()}
                </S.WorkspaceGrid>
              </S.ContentBody>

              <S.Footer>
                <Button type="default" icon={<ArrowLeftOutlined />} size="large" style={{ borderRadius: '2rem', fontWeight: 600, padding: '0 1.5rem', border: '1px solid #e2e8f0', color: '#64748b' }} onClick={handlePrevPart} disabled={partPosition <= 1}>
                  Phần trước
                </Button>

                <span style={{ fontWeight: 700, color: '#475569', fontSize: '0.95rem' }}>
                  Phần {partPosition} trên {availableParts.length} (Đã viết {answeredCount} / {totalQuestions})
                </span>

                <Space size="middle">
                  {!isSubmitted && (
                    <Button type="primary" icon={<CheckCircleOutlined />} size="large" style={{ borderRadius: '2rem', fontWeight: 600, background: '#1a365d', borderColor: '#1a365d', padding: '0 2rem', boxShadow: '0 4px 6px -1px rgba(26, 54, 93, 0.25)' }} onClick={handleSubmitClick}>
                      Nộp bài
                    </Button>
                  )}
                  {isSubmitted && (
                    <Button type="default" icon={<RollbackOutlined />} size="large" style={{ borderRadius: '2rem', fontWeight: 600, padding: '0 1.5rem', border: '1px solid #cbd5e1' }} onClick={() => navigate({ to: '/writing' })}>
                      Thoát xem lại
                    </Button>
                  )}
                  <Button type="primary" size="large" style={{ borderRadius: '2rem', fontWeight: 600, background: '#3b5b8c', borderColor: '#3b5b8c', padding: '0 1.5rem', boxShadow: '0 4px 6px -1px rgba(59, 91, 140, 0.2)' }} onClick={handleNextPart} disabled={partPosition === availableParts.length}>
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

export default WritingMockTestPage;
