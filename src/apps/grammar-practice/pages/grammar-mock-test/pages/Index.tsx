import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  LeftOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Button, Empty, Modal, Progress, Space, Spin, Statistic, message } from 'antd';
import React, { useMemo, useState } from 'react';

import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import { useGrammarExamDetailQuery } from '../../../services/grammarExamQuery';
import { buildGrammarExam, collectGrammarAnswers } from '../../../services/grammarExamMapper';
import { useSubmitExamMutation } from '../../../../../shared/services/student-exam';
import { confirmExitExam, confirmSubmitExam } from '../../../../../shared/utils/examDialogs';
import { GrammarSection } from '../components/GrammarSection';
import { GrammarNavSection, QuestionNav } from '../components/QuestionNav';
import { VocabularySection } from '../components/VocabularySection';
import { useMockTest } from '../hook/useMockTest';
import * as S from '../styles/styled';

export const GrammarMockTestPage: React.FC = () => {
  const navigate = useNavigate();
  const { testId } = useParams({ strict: false }) as { testId?: string };
  const activeTestId = testId || '0';
  const examId = Number(activeTestId);

  const { data: examDetail, isLoading, isError } = useGrammarExamDetailQuery(examId || null);
  const examData = useMemo(() => (examDetail ? buildGrammarExam(examDetail) : null), [examDetail]);
  const submitMutation = useSubmitExamMutation();
  const grammarQuestions = useMemo(() => examData?.grammarQuestions ?? [], [examData]);
  const vocabularySets = useMemo(() => examData?.vocabularySets ?? [], [examData]);

  const grammarNumbers = useMemo(
    () => grammarQuestions.map((question) => question.questionNumber),
    [grammarQuestions]
  );
  const vocabularyNumbers = useMemo(
    () => vocabularySets.flatMap((set) => set.subQuestions.map((question) => question.questionNumber)),
    [vocabularySets]
  );
  const allNumbers = useMemo(
    () => [...grammarNumbers, ...vocabularyNumbers],
    [grammarNumbers, vocabularyNumbers]
  );
  const totalQuestions = allNumbers.length;

  // Số hiển thị trên bảng: grammar mỗi câu 1 số (1..25); vocab MỖI TASK 1 số (26..30)
  // vì 1 task = 1 bản ghi gộp 5 câu — không tách thành 5 số riêng.
  const grammarCount = grammarNumbers.length;
  const totalUnits = grammarCount + vocabularySets.length;

  const [showResultModal, setShowResultModal] = useState(false);
  const [scoreResult, setScoreResult] = useState<{
    grammarScore: number;
    vocabScore: number;
    total: number;
  } | null>(null);

  const handleExamSubmit = (finalAnswers: Record<number, string>) => {
    let grammarScore = 0;
    let vocabScore = 0;

    grammarQuestions.forEach((question) => {
      const answer = finalAnswers[question.questionNumber];
      if (answer && answer.toLowerCase() === question.correctAnswer.toLowerCase()) {
        grammarScore += 1;
      }
    });

    vocabularySets.forEach((set) => {
      set.subQuestions.forEach((subQuestion) => {
        const answer = finalAnswers[subQuestion.questionNumber];
        if (answer && answer.toLowerCase() === subQuestion.correctAnswer.toLowerCase()) {
          vocabScore += 1;
        }
      });
    });

    const totalScore = grammarScore + vocabScore;
    setScoreResult({ grammarScore, vocabScore, total: totalScore });

    // Nộp lên BE để đánh dấu "đã làm" bộ đề (SKILL_FULL_SET) — không chặn UI.
    if (examData && examId) {
      const submitAnswers = collectGrammarAnswers(examData, finalAnswers);
      submitMutation.mutate({ examId, payload: { answers: submitAnswers } });
    }

    const saved = localStorage.getItem('aptis_grammar_mock_progress');
    let progressObj: Record<string, number> = {};
    if (saved) {
      try {
        progressObj = JSON.parse(saved);
      } catch {
        progressObj = {};
      }
    }
    const percent = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
    const currentBest = progressObj[activeTestId] ?? 0;
    progressObj[activeTestId] = Math.max(currentBest, percent);
    localStorage.setItem('aptis_grammar_mock_progress', JSON.stringify(progressObj));

    setShowResultModal(true);
  };

  const {
    answers,
    currentSection,
    currentQuestionIndex,
    timeLeft,
    progressPercent,
    setCurrentSection,
    setCurrentQuestionIndex,
    selectAnswer,
    submitExamManual,
    resetExam,
    formatTime,
    totalAnswered,
  } = useMockTest(
    handleExamSubmit,
    25 * 60,
    `aptis_grammar_mock_${activeTestId}`,
    Math.max(totalQuestions, 1)
  );

  const getSectionForQuestion = (qNum: number): 'grammar' | 'vocabulary' =>
    grammarNumbers.includes(qNum) ? 'grammar' : 'vocabulary';

  // ---- Đơn vị hiển thị (unit): grammar = 1 câu/số; vocab = 1 task/số ----
  const unitForQuestion = (qNum: number): number => {
    const gIdx = grammarNumbers.indexOf(qNum);
    if (gIdx >= 0) return gIdx + 1;
    const setIdx = vocabularySets.findIndex((set) =>
      set.subQuestions.some((sub) => sub.questionNumber === qNum)
    );
    return setIdx >= 0 ? grammarCount + setIdx + 1 : 1;
  };

  const firstQuestionOfUnit = (unit: number): number => {
    if (unit <= grammarCount) return grammarNumbers[unit - 1] ?? 1;
    const set = vocabularySets[unit - grammarCount - 1];
    return set?.subQuestions[0]?.questionNumber ?? 1;
  };

  const activeUnit = unitForQuestion(currentQuestionIndex);

  const handleNavigateUnit = (unit: number) => {
    const qNum = firstQuestionOfUnit(unit);
    setCurrentQuestionIndex(qNum);
    setCurrentSection(getSectionForQuestion(qNum));
  };

  const navSections = useMemo<GrammarNavSection[]>(() => {
    const sections: GrammarNavSection[] = [];
    if (grammarCount > 0) {
      sections.push({
        label: `Ngữ pháp (1 - ${grammarCount})`,
        items: grammarNumbers.map((qNum, i) => ({
          display: i + 1,
          answered: !!answers[qNum],
          active: activeUnit === i + 1,
        })),
      });
    }
    if (vocabularySets.length > 0) {
      sections.push({
        label: `Từ vựng (${grammarCount + 1} - ${totalUnits}) — mỗi số là 1 task 5 câu`,
        items: vocabularySets.map((set, i) => {
          const answeredCount = set.subQuestions.filter((sub) => !!answers[sub.questionNumber]).length;
          return {
            display: grammarCount + i + 1,
            answered: answeredCount === set.subQuestions.length && set.subQuestions.length > 0,
            active: activeUnit === grammarCount + i + 1,
            tooltip: `Câu ${grammarCount + i + 1} — Task ${i + 1}: đã trả lời ${answeredCount}/${set.subQuestions.length} ý`,
          };
        }),
      });
    }
    return sections;
  }, [grammarNumbers, vocabularySets, answers, activeUnit, grammarCount, totalUnits]);

  const handlePrevQuestion = () => {
    if (activeUnit > 1) handleNavigateUnit(activeUnit - 1);
  };

  const handleNextQuestion = () => {
    if (activeUnit < totalUnits) handleNavigateUnit(activeUnit + 1);
  };

  const prevUnit = activeUnit > 1 ? activeUnit - 1 : null;
  const nextUnit = activeUnit < totalUnits ? activeUnit + 1 : null;
  const unitSection = (unit: number): 'grammar' | 'vocabulary' =>
    unit <= grammarCount ? 'grammar' : 'vocabulary';
  const prevStepIsSamePart = prevUnit != null && unitSection(prevUnit) === currentSection;
  const nextStepIsSamePart = nextUnit != null && unitSection(nextUnit) === currentSection;

  const handleBackToLanding = () => {
    confirmExitExam({
      content:
        'Hệ thống vẫn sẽ lưu kết quả tạm thời của bạn, tuy nhiên đồng hồ đếm ngược vẫn sẽ chạy tiếp nếu bạn quay lại sau.',
      onOk: () => navigate({ to: '/grammar' }),
    });
  };

  const handleSubmitClick = () => {
    const { unansweredCount, confirm } = submitExamManual();
    confirmSubmitExam({ unansweredCount, totalQuestions, onOk: confirm });
  };

  const handleRestartExam = () => {
    resetExam();
    setShowResultModal(false);
    setScoreResult(null);
    message.success('Đã tải lại đề thi. Chúc bạn làm bài tốt!');
  };

  return (
    <HomeS.MainLayout>
      <Sidebar />
      <HomeS.RightColumn>
        <S.PageContainer>
          <S.Header>
            <Space size="large">
              <S.HeaderBackButton
                type="text"
                icon={<LeftOutlined />}
                onClick={handleBackToLanding}
              >
                Quay lại
              </S.HeaderBackButton>
              <S.HeaderTitleText>
                {examDetail?.title ?? 'Grammar & Vocabulary Test'}
              </S.HeaderTitleText>
            </Space>

            <S.HeaderSpace size="large">
              <Progress
                type="circle"
                percent={totalQuestions > 0 ? progressPercent : 0}
                size={40}
                strokeColor="#10b981"
                trailColor="rgba(255,255,255,0.2)"
                format={() => (
                  <S.ProgressText>
                    {totalAnswered}/{totalQuestions || 0}
                  </S.ProgressText>
                )}
              />
              <S.TimerWrapper>
                <ClockCircleOutlined className="text-[#fbbf24] mr-1" />
                {formatTime(timeLeft)}
              </S.TimerWrapper>
            </S.HeaderSpace>
          </S.Header>

          {isLoading ? (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <Spin size="large" />
            </div>
          ) : isError || !examData || totalQuestions === 0 ? (
            <div style={{ padding: '4rem' }}>
              <Empty description="Không tải được đề Grammar & Vocabulary hoặc đề chưa có câu hỏi" />
            </div>
          ) : (
            <>
              <S.MainContent>
                <S.ContentCard>
                  <S.TitleArea>
                    <h2>
                      {currentSection === 'grammar'
                        ? 'Part 1: Grammar'
                        : 'Part 2: Vocabulary'}
                    </h2>
                    <div className="subtitle">
                      {currentSection === 'grammar'
                        ? `Trả lời ${grammarQuestions.length} câu trắc nghiệm. Đọc kỹ câu và chọn phương án đúng nhất.`
                        : `Hoàn thành ${vocabularyNumbers.length} câu qua ${vocabularySets.length} task từ vựng.`}
                    </div>
                  </S.TitleArea>

                  {currentSection === 'grammar' ? (
                    <GrammarSection
                      questions={grammarQuestions}
                      answers={answers}
                      currentQuestionIndex={currentQuestionIndex}
                      onSelectAnswer={selectAnswer}
                    />
                  ) : (
                    <VocabularySection
                      sets={vocabularySets}
                      answers={answers}
                      currentQuestionIndex={currentQuestionIndex}
                      onSelectAnswer={selectAnswer}
                      onQuestionFocus={setCurrentQuestionIndex}
                    />
                  )}
                </S.ContentCard>

                <QuestionNav
                  totalAnswered={totalAnswered}
                  totalQuestions={totalQuestions}
                  sections={navSections}
                  onNavigate={handleNavigateUnit}
                />
              </S.MainContent>

              <S.Footer>
                <S.FooterButton
                  type="default"
                  icon={<ArrowLeftOutlined />}
                  size="large"
                  onClick={handlePrevQuestion}
                  disabled={prevUnit == null}
                >
                  {prevStepIsSamePart ? 'Câu trước' : 'Phần trước'}
                </S.FooterButton>

                <S.FooterProgressText>
                  Câu {activeUnit} trên {totalUnits}
                </S.FooterProgressText>

                <Space size="middle">
                  <S.SubmitButton
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    size="large"
                    onClick={handleSubmitClick}
                  >
                    Nộp bài
                  </S.SubmitButton>
                  <S.NextButton
                    type="primary"
                    size="large"
                    onClick={handleNextQuestion}
                    disabled={nextUnit == null}
                  >
                    {nextStepIsSamePart ? 'Câu tiếp theo' : 'Phần tiếp theo'} <ArrowRightOutlined className="text-[12px]" />
                  </S.NextButton>
                </Space>
              </S.Footer>
            </>
          )}
        </S.PageContainer>
      </HomeS.RightColumn>

      <Modal
        title={null}
        open={showResultModal}
        footer={null}
        closable={false}
        width={500}
        centered
        styles={{ body: { padding: '2.5rem 2rem', textAlign: 'center' } }}
      >
        {scoreResult && (
          <div>
            <S.ResultIconWrapper>
              <CheckCircleOutlined />
            </S.ResultIconWrapper>
            <S.ResultTitle>
              Hoàn thành bài thi!
            </S.ResultTitle>
            <S.ResultDescription>
              Kết quả điểm luyện tập của bạn:
            </S.ResultDescription>

            <S.ResultStatsGrid $isPartMode={false}>
              <S.StatBlock>
                <Statistic title="Ngữ pháp" value={scoreResult.grammarScore} suffix={`/ ${grammarQuestions.length}`} valueStyle={{ color: '#1677ff', fontWeight: 800 }} />
              </S.StatBlock>
              <S.StatBlock>
                <Statistic title="Từ vựng" value={scoreResult.vocabScore} suffix={`/ ${vocabularyNumbers.length}`} valueStyle={{ color: '#52c41a', fontWeight: 800 }} />
              </S.StatBlock>
            </S.ResultStatsGrid>

            <S.SummaryBox>
              <S.SummaryBoxTitle>
                Tổng số điểm
              </S.SummaryBoxTitle>
              <S.SummaryBoxScore>
                {scoreResult.total} <span>/ {totalQuestions}</span>
              </S.SummaryBoxScore>
              <S.SummaryBoxDesc>
                Điểm số này giúp bạn đánh giá nhanh năng lực Grammar & Vocabulary trong bộ đề.
              </S.SummaryBoxDesc>
            </S.SummaryBox>

            <S.ModalActionButtons size="middle">
              <Button
                icon={<UndoOutlined />}
                size="large"
                onClick={handleRestartExam}
              >
                Làm lại đề
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={() => {
                  setShowResultModal(false);
                  navigate({ to: '/grammar' });
                }}
              >
                Quay về trang chính
              </Button>
            </S.ModalActionButtons>
          </div>
        )}
      </Modal>
    </HomeS.MainLayout>
  );
};

export default GrammarMockTestPage;
