import {
  AlertOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  LeftOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Button, Empty, Progress, Space, Spin, Typography } from 'antd';
import React from 'react';
import { ExamQuestionNavigator } from '../../../../../shared/components/ExamQuestionNavigator';
import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import { AudioPlayer } from '../../../components/AudioPlayer';
import {
  keyForP1,
  keyForP2,
  keyForP3,
  keyForP4,
  useMockTest,
} from '../hook/useMockTest';
import { percentToBand, singleSkillScore } from '../../../../../shared/utils/skillScore';
import * as S from '../styles/styled';

const LISTENING_SKILL_ID = 2;

const { Title, Text } = Typography;

const SPEAKER_OPTIONS = [
  { value: 'MAN', label: 'Man' },
  { value: 'WOMAN', label: 'Woman' },
  { value: 'BOTH', label: 'Both' },
];

const getOptionStatus = (
  isSubmitted: boolean,
  selected: string | undefined,
  option: string,
  correct: string | undefined
): 'success' | 'error' | 'default' => {
  if (!isSubmitted) return 'default';
  if (option === correct) return 'success';
  if (selected === option) return 'error';
  return 'default';
};

const getSelectStatus = (
  isSubmitted: boolean,
  selected: string | undefined,
  correct: string | undefined
): 'success' | 'error' | 'default' => {
  if (!isSubmitted || !selected) return 'default';
  return selected === correct ? 'success' : 'error';
};

export const ListeningMockTestPage: React.FC = () => {
  const { testId } = useParams({ strict: false }) as { testId: string };
  const navigate = useNavigate();

  const {
    isLoading,
    isError,
    testTitle,
    examData,
    navItems,
    navSections,
    navAnswers,
    navCorrectAnswers,
    totalQuestions,
    answers,
    timeLeft,
    isSubmitted,
    showReport,
    setShowReport,
    activeQuestionNum,
    activePart,
    activeNavItem,
    answeredCount,
    prevStepIsSamePart,
    nextStepIsSamePart,
    hasPrevStep,
    hasNextStep,
    formatTime,
    calculateScores,
    submitResult,
    handleRetry,
    handleBackToLanding,
    handleNavigateQuestion,
    handlePrevQuestion,
    handleNextQuestion,
    handleSelectAnswer,
    handleSubmitClick,
  } = useMockTest(testId);

  const {
    scoreP1,
    scoreP2,
    scoreP3,
    scoreP4,
    maxP1,
    maxP2,
    maxP3,
    maxP4,
    totalScore,
    totalMax,
  } = calculateScores();

  const scorePercent = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;

  // Band CEFR kỹ năng Nghe (skillId 2) theo ĐÚNG bảng quy đổi 0–50: ưu tiên kết quả BE,
  // fallback suy từ % đúng cục bộ (bằng nhau vì Nghe là trắc nghiệm).
  const beSkill = submitResult ? singleSkillScore(submitResult, LISTENING_SKILL_ID) : null;
  const listeningBand = beSkill?.cefr ?? percentToBand(LISTENING_SKILL_ID, scorePercent).cefr;
  const listeningScaled = beSkill?.scaled ?? percentToBand(LISTENING_SKILL_ID, scorePercent).scaled;

  const renderPart1 = () => {
    if (!examData || !activeNavItem) return null;
    const question = examData.part1[activeNavItem.itemIndex];
    if (!question) return null;
    const answerKey = keyForP1(activeNavItem.qNum);
    const answer = answers[answerKey];
    const correctAnswer = question.options[question.correctIndex];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <span style={{ fontWeight: 700, color: '#1a365d', fontSize: '1.1rem' }}>
          Nghe audio và trả lời câu hỏi dưới đây:
        </span>

        <AudioPlayer src={question.mediaUrl} />

        <S.InstructionText>
          {activeNavItem.qNum}. {question.questionText}
        </S.InstructionText>

        <div style={{ marginTop: '1rem' }}>
          {question.options.map((option, idx) => {
            const letter = String.fromCharCode(65 + idx);
            const isSelected = answer === option;
            const status = getOptionStatus(isSubmitted, answer, option, correctAnswer);

            return (
              <S.OptionCard
                key={option}
                $selected={isSelected}
                $status={status}
                onClick={() => handleSelectAnswer(answerKey, option)}
              >
                <div className="option-letter">{letter}</div>
                <div className="option-text">{option}</div>
              </S.OptionCard>
            );
          })}
        </div>
      </div>
    );
  };

  const renderPart2 = () => {
    if (!examData || !activeNavItem) return null;
    const set = examData.part2[activeNavItem.itemIndex];
    if (!set) return null;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <span style={{ fontWeight: 700, color: '#1a365d', fontSize: '1.1rem' }}>
          {set.instruction}
        </span>

        <AudioPlayer src={set.mediaUrl} />

        <div style={{ marginTop: '1rem' }}>
          {Array.from({ length: set.speakerCount }, (_, index) => {
            const speaker = index + 1;
            const answerKey = keyForP2(activeNavItem.qNum, speaker);
            const answer = answers[answerKey];
            const correctAnswer = set.correctBySpeaker[speaker];
            const status = getSelectStatus(isSubmitted, answer, correctAnswer);

            return (
              <S.PersonRow key={speaker}>
                <div className="person-label">Người {speaker}</div>
                <div className="person-select">
                  <S.StyledSelect
                    placeholder="Chọn đáp án"
                    onChange={(value) => handleSelectAnswer(answerKey, value as string)}
                    value={answer}
                    $hasValue={!!answer}
                    $status={status}
                    options={set.options}
                    disabled={isSubmitted}
                  />
                  {isSubmitted && answer && answer !== correctAnswer && (
                    <div style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 600, marginTop: '4px' }}>
                      Đáp án đúng: {correctAnswer}
                    </div>
                  )}
                </div>
              </S.PersonRow>
            );
          })}
        </div>
      </div>
    );
  };

  const renderPart3 = () => {
    if (!examData || !activeNavItem) return null;
    const set = examData.part3[activeNavItem.itemIndex];
    if (!set) return null;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <span style={{ fontWeight: 700, color: '#1a365d', fontSize: '1.1rem' }}>
          {set.instruction}
        </span>

        <AudioPlayer src={set.mediaUrl} />

        <div style={{ marginTop: '1rem' }}>
          {set.statements.map((statement) => {
            const answerKey = keyForP3(activeNavItem.qNum, statement.id);
            const answer = answers[answerKey];
            const status = getSelectStatus(isSubmitted, answer, statement.correct);

            return (
              <S.StatementRow key={statement.id}>
                <div className="statement-number">{statement.id}.</div>
                <div className="statement-text">{statement.text}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <S.StyledSelect
                    placeholder="Chọn"
                    onChange={(value) => handleSelectAnswer(answerKey, value as string)}
                    value={answer}
                    $hasValue={!!answer}
                    $status={status}
                    options={SPEAKER_OPTIONS}
                    disabled={isSubmitted}
                  />
                  {isSubmitted && answer && answer !== statement.correct && (
                    <div style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 600, marginTop: '2px' }}>
                      Đáp án đúng: {SPEAKER_OPTIONS.find((option) => option.value === statement.correct)?.label}
                    </div>
                  )}
                </div>
              </S.StatementRow>
            );
          })}
        </div>
      </div>
    );
  };

  const renderPart4 = () => {
    if (!examData || !activeNavItem) return null;
    const group = examData.part4[activeNavItem.itemIndex];
    if (!group) return null;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <span style={{ fontWeight: 700, color: '#1a365d', fontSize: '1.1rem' }}>
          {group.title}
        </span>
        <div className="subtitle" style={{ fontSize: '0.95rem', color: '#64748b' }}>
          {group.instruction}
        </div>

        <AudioPlayer src={group.mediaUrl} />

        {group.subQuestions.map((subQuestion) => {
          const answerKey = keyForP4(activeNavItem.qNum, subQuestion.id);
          const answer = answers[answerKey];
          const correctAnswer = subQuestion.options[subQuestion.correctIndex];

          return (
            <S.QuestionBlock key={subQuestion.id}>
              <S.QuestionTitle>{subQuestion.title}</S.QuestionTitle>
              {subQuestion.options.map((option, idx) => {
                const letter = String.fromCharCode(65 + idx);
                const isSelected = answer === option;
                const status = getOptionStatus(isSubmitted, answer, option, correctAnswer);

                return (
                  <S.OptionCard
                    key={option}
                    $selected={isSelected}
                    $status={status}
                    onClick={() => handleSelectAnswer(answerKey, option)}
                  >
                    <div className="option-letter">{letter}</div>
                    <div className="option-text">{option}</div>
                  </S.OptionCard>
                );
              })}
            </S.QuestionBlock>
          );
        })}
      </div>
    );
  };

  const renderActiveQuestionContent = () => {
    if (activePart === 1) return renderPart1();
    if (activePart === 2) return renderPart2();
    if (activePart === 3) return renderPart3();
    return renderPart4();
  };

  const getPartTitleAndInstruction = () => {
    if (!examData || !activeNavItem) {
      return { title: 'Listening', subtitle: 'Đang tải đề nghe' };
    }

    if (activePart === 1) {
      const part1Total = examData.part1.length;
      return {
        title: 'Listening',
        subtitle: `Part 1 • Question ${activeNavItem.qNum} of ${part1Total}`,
      };
    }

    if (activePart === 2) {
      return {
        title: 'Information Matching',
        subtitle: `Part 2 • Question ${activeNavItem.qNum}`,
      };
    }

    if (activePart === 3) {
      return {
        title: 'Opinion Matching',
        subtitle: `Part 3 • Question ${activeNavItem.qNum}`,
      };
    }

    const group = examData.part4[activeNavItem.itemIndex];
    return {
      title: group?.title ?? 'Monologue',
      subtitle: `Part 4 • Question ${activeNavItem.qNum}`,
    };
  };

  const { title: partTitle, subtitle: partSubtitle } = getPartTitleAndInstruction();

  const renderQuestionNav = () => (
    <ExamQuestionNavigator
      sections={navSections}
      answers={navAnswers}
      currentQuestion={activeQuestionNum}
      onNavigate={handleNavigateQuestion}
      isSubmitted={isSubmitted}
      correctAnswers={navCorrectAnswers}
    />
  );

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
                onClick={() => handleBackToLanding(() => navigate({ to: '/listening' }))}
                style={{ color: '#cbd5e1', fontWeight: 'bold' }}
              >
                Quay lại
              </Button>
              <S.HeaderTitle>{testTitle}</S.HeaderTitle>
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
                      percent={totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0}
                      size={40}
                      strokeColor="#10b981"
                      trailColor="rgba(255,255,255,0.2)"
                      format={() => (
                        <span style={{ color: 'white', fontSize: '11px', fontWeight: 'bold' }}>
                          {answeredCount}/{totalQuestions || 0}
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

          {isLoading ? (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <Spin size="large" />
            </div>
          ) : isError || !examData || navItems.length === 0 ? (
            <div style={{ padding: '4rem' }}>
              <Empty description="Không tải được đề nghe hoặc đề chưa có câu hỏi" />
            </div>
          ) : isSubmitted && showReport ? (
            <S.ReportContainer>
              <S.ReportCard>
                <Space direction="vertical" size="small" style={{ marginBottom: '1.5rem' }}>
                  <Title level={2} style={{ color: '#1a365d', margin: 0 }}>Kết quả thi thử</Title>
                  <Text type="secondary" style={{ fontSize: '1rem', fontWeight: 500 }}>
                    Bạn đã hoàn thành {testTitle} trong kỹ năng Nghe hiểu
                  </Text>
                </Space>

                <S.ScoreRingWrapper>
                  <Progress
                    type="circle"
                    percent={scorePercent}
                    size={140}
                    strokeWidth={10}
                    strokeColor="#10b981"
                    format={() => (
                      <S.ScoreLabel>
                        <span className="score-val">{totalScore}</span>
                        <span className="score-max">/ {totalMax} câu</span>
                      </S.ScoreLabel>
                    )}
                  />
                </S.ScoreRingWrapper>

                <S.ReportGrid>
                  <S.ReportStatItem>
                    <span className="stat-label">CEFR Nghe (ước lượng)</span>
                    <span className="stat-value">{listeningBand ? `${listeningBand} · ${listeningScaled}/50` : 'Chưa xếp loại'}</span>
                  </S.ReportStatItem>
                  <S.ReportStatItem>
                    <span className="stat-label">Tỷ lệ đúng</span>
                    <span className="stat-value">{scorePercent}%</span>
                  </S.ReportStatItem>
                  <S.ReportStatItem>
                    <span className="stat-label">Part 1 & 2</span>
                    <span className="stat-value">{scoreP1 + scoreP2} / {maxP1 + maxP2} câu</span>
                  </S.ReportStatItem>
                  <S.ReportStatItem>
                    <span className="stat-label">Part 3 & 4</span>
                    <span className="stat-value">{scoreP3 + scoreP4} / {maxP3 + maxP4} câu</span>
                  </S.ReportStatItem>
                </S.ReportGrid>

                <div style={{ width: '100%', textAlign: 'left', background: '#f8fafc', padding: '1.25rem 1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '6px', color: '#1a365d', fontWeight: 700 }}>
                    <AlertOutlined /> <span>Nhận xét chi tiết từ hệ thống:</span>
                  </div>
                  <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>
                    {scorePercent >= 88
                      ? 'Tuyệt vời! Kỹ năng nghe hiểu của bạn đang ở mức cao. Bạn nắm tốt thông tin chi tiết và ý chính trong các bài nghe.'
                      : scorePercent >= 64
                        ? 'Rất tốt! Bạn nghe hiểu được phần lớn thông tin quan trọng. Hãy luyện thêm các bài dài để tăng độ chắc chắn.'
                        : scorePercent >= 36
                          ? 'Bạn đang ở mức nền tảng khá. Nên luyện thêm khả năng bắt từ khóa và phân biệt ý kiến của từng người nói.'
                          : 'Bạn cần nghe nhiều hơn với các đoạn ngắn trước, sau đó tăng dần sang bài hội thoại và độc thoại dài.'}
                  </p>
                </div>

                <Button
                  type="primary"
                  size="large"
                  style={{ borderRadius: '2rem', height: '48px', padding: '0 2.5rem', fontWeight: 700, background: '#1a365d', borderColor: '#1a365d' }}
                  onClick={() => setShowReport(false)}
                >
                  Xem lại đáp án chi tiết
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
                        <h2>{partTitle}</h2>
                        <div className="subtitle">{partSubtitle}</div>
                      </S.TitleArea>
                      {renderActiveQuestionContent()}
                    </S.ContentCard>
                  </S.QuestionsColumn>

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
                  disabled={!hasPrevStep}
                >
                  {prevStepIsSamePart ? 'Câu trước' : 'Phần trước'}
                </Button>

                <span style={{ fontWeight: 700, color: '#475569', fontSize: '0.95rem' }}>
                  Phần {activePart} trên 4 (Câu {activeQuestionNum} / {totalQuestions})
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
                        background: '#1a365d',
                        borderColor: '#1a365d',
                        padding: '0 2rem',
                        boxShadow: '0 4px 6px -1px rgba(26, 54, 93, 0.25)',
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
                      onClick={() => navigate({ to: '/listening' })}
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
                      background: '#3b5b8c',
                      borderColor: '#3b5b8c',
                      padding: '0 1.5rem',
                      boxShadow: '0 4px 6px -1px rgba(59, 91, 140, 0.2)',
                    }}
                    onClick={handleNextQuestion}
                    disabled={!hasNextStep}
                  >
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

export default ListeningMockTestPage;
