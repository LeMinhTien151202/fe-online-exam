import React from 'react';
import { Button, Space, Progress, message, Select, Modal, Typography, Tooltip } from 'antd';
import { useNavigate, useParams } from '@tanstack/react-router';
import { 
  LeftOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  RollbackOutlined,
  AlertOutlined,
  FileTextOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import { AudioPlayer } from '../../../components/AudioPlayer';
import * as S from '../styles/styled';
import { useMockTest } from '../hook/useMockTest';
import {
  correctP1,
  correctP2,
  correctP3,
  correctAnswersBank,
  p1Questions,
  p2Options,
  p3SpeakerOptions,
  p3Statements,
  p4Groups
} from '../services/data';

const { Title, Text } = Typography;

export const ListeningMockTestPage: React.FC = () => {
  const { testId } = useParams({ strict: false }) as { testId: string };
  const navigate = useNavigate();

  const {
    answers,
    timeLeft,
    isSubmitted,
    showReport,
    setShowReport,
    showTranscript,
    setShowTranscript,
    activeQuestionNum,
    setActiveQuestionNum,
    activePart,
    answeredCount,
    formatTime,
    calculateScores,
    getAptisLevel,
    handleManualSubmit,
    handleRetry,
    handleBackToLanding,
    handleNavigateQuestion,
    handlePrevQuestion,
    handleNextQuestion,
    handleSelectAnswer
  } = useMockTest(testId);

  const testTitle = testId === 'm2' ? 'Đề Nghe hiểu số 2' : testId === 'm3' ? 'Đề Nghe hiểu số 3' : 'Đề Nghe hiểu số 1';
  const totalQuestions = 25;

  const handleSubmitClick = () => {
    const unansweredCount = totalQuestions - answeredCount;
    const hasUnanswered = unansweredCount > 0;

    Modal.confirm({
      title: 'Xác nhận nộp bài thi?',
      icon: <CheckCircleOutlined style={{ color: '#10b981' }} />,
      content: hasUnanswered
        ? `Bạn còn ${unansweredCount} câu hỏi chưa trả lời. Bạn có thực sự muốn nộp bài thi ngay bây giờ không?`
        : 'Bạn đã hoàn thành toàn bộ 25 câu hỏi. Bạn có chắc chắn muốn nộp bài thi để chấm điểm không?',
      okText: 'Nộp bài',
      cancelText: 'Làm tiếp',
      onOk: handleManualSubmit
    });
  };

  const renderActiveQuestionContent = () => {
    // PART 1 (Questions 1 - 13)
    if (activeQuestionNum <= 13) {
      const q = p1Questions[activeQuestionNum - 1];
      const answer = answers[activeQuestionNum];
      const correctAns = correctP1[activeQuestionNum];
      let optionStatus: 'success' | 'error' | 'default' = 'default';

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, color: '#00205B', fontSize: '1.1rem' }}>
              Nghe audio và trả lời câu hỏi dưới đây:
            </span>
          </div>

          <AudioPlayer />

          <S.InstructionText>
            {activeQuestionNum}. {q.questionText}
          </S.InstructionText>

          <div style={{ marginTop: '1rem' }}>
            {q.options.map((option, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = answer === option;
              let currentStatus: 'success' | 'error' | 'default' = 'default';
              if (isSubmitted) {
                if (option === correctAns) currentStatus = 'success';
                else if (isSelected) currentStatus = 'error';
              }

              return (
                <S.OptionCard 
                  key={idx}
                  $selected={isSelected}
                  $status={currentStatus}
                  onClick={() => handleSelectAnswer(activeQuestionNum, option)}
                >
                  <div className="option-letter">{letter}</div>
                  <div className="option-text">{option}</div>
                </S.OptionCard>
              );
            })}
          </div>

          {isSubmitted && (
            <div style={{ marginTop: '2rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#10b981', fontWeight: 700 }}>
                <CheckCircleOutlined /> <span>Giải thích đáp án:</span>
              </div>
              <p style={{ margin: '0 0 1rem 0', color: '#475569', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {q.explanation}
              </p>
              
              <Button 
                size="small"
                icon={<FileTextOutlined />} 
                onClick={() => setShowTranscript(!showTranscript)}
                style={{ marginBottom: '1rem' }}
              >
                {showTranscript ? 'Ẩn Transcript' : 'Hiện Transcript'}
              </Button>
              {showTranscript && (
                <S.TranscriptBox style={{ marginTop: 0 }}>
                  {q.transcript}
                </S.TranscriptBox>
              )}
            </div>
          )}
        </div>
      );
    }

    // PART 2 (Questions 14 - 17)
    if (activeQuestionNum >= 14 && activeQuestionNum <= 17) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <span style={{ fontWeight: 700, color: '#00205B', fontSize: '1.1rem' }}>
            Four people are talking about music habits. Complete the sentences below.
          </span>

          <AudioPlayer />

          <div style={{ marginTop: '1rem' }}>
            {['Person 1', 'Person 2', 'Person 3', 'Person 4'].map((person, index) => {
              const qNum = 14 + index;
              const answer = answers[qNum];
              const correctAns = correctP2[qNum];
              const isCorrect = answer === correctAns;
              let selectStatus: 'success' | 'error' | 'default' = 'default';
              if (isSubmitted) {
                selectStatus = isCorrect ? 'success' : 'error';
              }

              return (
                <S.PersonRow key={index}>
                  <div className="person-label">{person}</div>
                  <div className="person-select">
                    <S.StyledSelect
                      placeholder="Select option"
                      onChange={(val) => handleSelectAnswer(qNum, val as string)}
                      value={answer}
                      $hasValue={!!answer}
                      $status={selectStatus}
                      options={p2Options}
                      disabled={isSubmitted}
                    />
                    {isSubmitted && !isCorrect && (
                      <div style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 600, marginTop: '4px' }}>
                        Đáp án đúng: {p2Options.find(o => o.value === correctAns)?.label}
                      </div>
                    )}
                  </div>
                </S.PersonRow>
              );
            })}
          </div>

          {isSubmitted && (
            <div style={{ marginTop: '2rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#10b981', fontWeight: 700 }}>
                <CheckCircleOutlined /> <span>Giải thích & Transcript:</span>
              </div>
              <ul style={{ margin: '0 0 1rem 0', paddingLeft: '1.25rem', color: '#475569', fontSize: '0.95rem', lineHeight: 1.8 }}>
                <li><strong>Person 1 (Câu 14):</strong> 'listens to music while working' (nghe nhạc khi làm việc).</li>
                <li><strong>Person 2 (Câu 15):</strong> 'dislikes modern pop music' (không thích nhạc pop hiện đại).</li>
                <li><strong>Person 3 (Câu 16):</strong> 'attends live concerts frequently' (thường xuyên đi xem hòa nhạc trực tiếp).</li>
                <li><strong>Person 4 (Câu 17):</strong> 'plays an instrument' (chơi một nhạc cụ - piano).</li>
              </ul>
              
              <Button 
                size="small"
                icon={<FileTextOutlined />} 
                onClick={() => setShowTranscript(!showTranscript)}
                style={{ marginBottom: '1rem' }}
              >
                {showTranscript ? 'Ẩn Transcript' : 'Hiện Transcript'}
              </Button>
              {showTranscript && (
                <S.TranscriptBox style={{ marginTop: 0 }}>
                  <strong>Person 1:</strong> I usually put on some jazz or classical music when I'm at my desk. It helps me focus on the tasks.<br /><br />
                  <strong>Person 2:</strong> To be honest, I can't stand the popular songs they play on the radio these days. I much prefer older genres.<br /><br />
                  <strong>Person 3:</strong> I save up all year to travel to music festivals. Seeing bands live is the best experience in the world.<br /><br />
                  <strong>Person 4:</strong> I've been learning to play the piano for five years. Practicing daily is hard work but very rewarding.
                </S.TranscriptBox>
              )}
            </div>
          )}
        </div>
      );
    }

    // PART 3 (Questions 18 - 21)
    if (activeQuestionNum >= 18 && activeQuestionNum <= 21) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <span style={{ fontWeight: 700, color: '#00205B', fontSize: '1.1rem' }}>
            Listen and decide whose opinion matches the statements: the man, the woman, or both.
          </span>

          <AudioPlayer />

          <div style={{ marginTop: '1rem' }}>
            {p3Statements.map((st) => {
              const answer = answers[st.id];
              const correctAns = correctP3[st.id];
              const isCorrect = answer === correctAns;
              let selectStatus: 'success' | 'error' | 'default' = 'default';
              if (isSubmitted) {
                selectStatus = isCorrect ? 'success' : 'error';
              }

              return (
                <S.StatementRow key={st.id}>
                  <div className="statement-number">{st.index}.</div>
                  <div className="statement-text">{st.text}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <S.StyledSelect
                      placeholder="Select"
                      onChange={(val) => handleSelectAnswer(st.id, val as string)}
                      value={answer}
                      $hasValue={!!answer}
                      $status={selectStatus}
                      options={p3SpeakerOptions}
                      disabled={isSubmitted}
                    />
                    {isSubmitted && !isCorrect && (
                      <div style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 600, marginTop: '2px' }}>
                        Đáp án đúng: {p3SpeakerOptions.find(o => o.value === correctAns)?.label}
                      </div>
                    )}
                  </div>
                </S.StatementRow>
              );
            })}
          </div>

          {isSubmitted && (
            <div style={{ marginTop: '2rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#10b981', fontWeight: 700 }}>
                <CheckCircleOutlined /> <span>Giải thích & Transcript:</span>
              </div>
              <ul style={{ margin: '0 0 1rem 0', paddingLeft: '1.25rem', color: '#475569', fontSize: '0.95rem', lineHeight: 1.8 }}>
                <li><strong>Câu 18 (Exhibitions):</strong> 'Both' đồng tình (Woman nói triển lãm đa dạng, Man đồng ý).</li>
                <li><strong>Câu 19 (Customs):</strong> 'Woman' nêu ý kiến (customs fading away).</li>
                <li><strong>Câu 20 (Festivals):</strong> 'Man' bày tỏ sự lo ngại (festivals disappear soon).</li>
                <li><strong>Câu 21 (Schools):</strong> 'Woman' khẳng định tầm quan trọng của nhà trường.</li>
              </ul>
              
              <Button 
                size="small"
                icon={<FileTextOutlined />} 
                onClick={() => setShowTranscript(!showTranscript)}
                style={{ marginBottom: '1rem' }}
              >
                {showTranscript ? 'Ẩn Transcript' : 'Hiện Transcript'}
              </Button>
              {showTranscript && (
                <S.TranscriptBox style={{ marginTop: 0 }}>
                  <strong>Man:</strong> Have you been to the new local center yet? They have some interesting exhibitions.<br /><br />
                  <strong>Woman:</strong> Yes, I went yesterday. I agree the exhibitions are diverse, but I feel traditional customs are slowly fading away.<br /><br />
                  <strong>Man:</strong> That's true. Sometimes I worry local festivals might disappear soon if we don't act.<br /><br />
                  <strong>Woman:</strong> Absolutely. And that's why schools are so critical in educating the younger generations.
                </S.TranscriptBox>
              )}
            </div>
          )}
        </div>
      );
    }

    // PART 4 (Questions 22 - 25)
    if (activeQuestionNum >= 22 && activeQuestionNum <= 25) {
      const activeGroupId = activeQuestionNum <= 23 ? 16 : 17;
      const group = p4Groups.find(g => g.id === activeGroupId) || p4Groups[0];

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <span style={{ fontWeight: 700, color: '#00205B', fontSize: '1.1rem' }}>
            {group.title}
          </span>
          <div className="subtitle" style={{ fontSize: '0.95rem', color: '#64748b' }}>
            {group.instruction}
          </div>

          <AudioPlayer />

          {group.subQuestions.map((subQ) => {
            const answer = answers[subQ.num];
            const correctAns = correctAnswersBank[subQ.num];
            let optionStatus: 'success' | 'error' | 'default' = 'default';

            return (
              <S.QuestionBlock key={subQ.id}>
                <S.QuestionTitle>{subQ.title}</S.QuestionTitle>
                {subQ.options.map((option, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isSelected = answer === option;
                  let currentStatus: 'success' | 'error' | 'default' = 'default';
                  if (isSubmitted) {
                    if (option === correctAns) currentStatus = 'success';
                    else if (isSelected) currentStatus = 'error';
                  }

                  return (
                    <S.OptionCard
                      key={idx}
                      $selected={isSelected}
                      $status={currentStatus}
                      onClick={() => handleSelectAnswer(subQ.num, option)}
                    >
                      <div className="option-letter">{letter}</div>
                      <div className="option-text">{option}</div>
                    </S.OptionCard>
                  );
                })}
              </S.QuestionBlock>
            );
          })}

          {isSubmitted && (
            <div style={{ marginTop: '2rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#10b981', fontWeight: 700 }}>
                <CheckCircleOutlined /> <span>Giải thích & Transcript:</span>
              </div>
              <ul style={{ margin: '0 0 1rem 0', paddingLeft: '1.25rem', color: '#475569', fontSize: '0.95rem', lineHeight: 1.8 }}>
                {group.subQuestions.map((subQ) => (
                  <li key={subQ.id}><strong>{subQ.id}:</strong> {subQ.explanation}</li>
                ))}
              </ul>
              
              <Button 
                size="small"
                icon={<FileTextOutlined />} 
                onClick={() => setShowTranscript(!showTranscript)}
                style={{ marginBottom: '1rem' }}
              >
                {showTranscript ? 'Ẩn Transcript' : 'Hiện Transcript'}
              </Button>
              {showTranscript && (
                <S.TranscriptBox style={{ marginTop: 0 }}>
                  {group.transcript}
                </S.TranscriptBox>
              )}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  const renderQuestionNav = () => {
    const getStatus = (qNum: number): 'unanswered' | 'answered' => {
      return answers[qNum] ? 'answered' : 'unanswered';
    };

    const getCorrectness = (qNum: number): 'success' | 'error' | 'default' => {
      if (!isSubmitted) return 'default';
      return answers[qNum] === correctAnswersBank[qNum] ? 'success' : 'error';
    };

    const renderGridButtons = (qNums: number[]) => {
      return (
        <S.ButtonGrid>
          {qNums.map((n) => {
            const status = getStatus(n);
            const isCorrect = getCorrectness(n);
            const isActive = activeQuestionNum === n;

            let placement: 'top' | 'topRight' | 'topLeft' = 'top';
            if (n % 5 === 1) {
              placement = 'topRight';
            } else if (n % 5 === 0) {
              placement = 'topLeft';
            }

            return (
              <Tooltip
                key={n}
                title={`Câu ${n}: ${
                  isSubmitted
                    ? isCorrect === 'success'
                      ? 'Trả lời đúng'
                      : 'Trả lời sai'
                    : status === 'answered'
                    ? 'Đã trả lời'
                    : 'Chưa trả lời'
                }`}
                placement={placement}
                mouseEnterDelay={0.15}
              >
                <S.NavGridButton
                  $active={isActive}
                  $status={status}
                  $isCorrect={isCorrect}
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
        
        <S.SectionLabel>Part 1: Câu hỏi ngắn (1 - 13)</S.SectionLabel>
        {renderGridButtons([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13])}

        <S.SectionLabel>Part 2: Điền từ (14 - 17)</S.SectionLabel>
        {renderGridButtons([14, 15, 16, 17])}

        <S.SectionLabel>Part 3: Ghép ý kiến (18 - 21)</S.SectionLabel>
        {renderGridButtons([18, 19, 20, 21])}

        <S.SectionLabel>Part 4: Đàm thoại dài (22 - 25)</S.SectionLabel>
        {renderGridButtons([22, 23, 24, 25])}

        <S.Legend>
          {!isSubmitted ? (
            <>
              <S.LegendItem>
                <div className="color-dot" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1' }} />
                <span>Chưa trả lời</span>
              </S.LegendItem>
              <S.LegendItem>
                <div className="color-dot" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }} />
                <span>Đã trả lời</span>
              </S.LegendItem>
              <S.LegendItem>
                <div className="color-dot" style={{ background: 'white', border: '1.5px solid #00205B' }} />
                <span>Đang chọn</span>
              </S.LegendItem>
            </>
          ) : (
            <>
              <S.LegendItem>
                <div className="color-dot" style={{ background: '#ecfdf5', border: '1px solid #bbf7d0' }} />
                <span>Trả lời đúng</span>
              </S.LegendItem>
              <S.LegendItem>
                <div className="color-dot" style={{ background: '#fef2f2', border: '1px solid #fecaca' }} />
                <span>Trả lời sai</span>
              </S.LegendItem>
            </>
          )}
        </S.Legend>
      </S.NavPanel>
    );
  };

  const getPartTitleAndInstruction = () => {
    switch (activePart) {
      case 1:
        return {
          title: 'Listening',
          subtitle: `Part 1 • Question ${activeQuestionNum} of 13`
        };
      case 2:
        return {
          title: 'Listening To Music',
          subtitle: 'Part 2 • Questions 14 - 17 of 25'
        };
      case 3:
        return {
          title: 'The Local Central',
          subtitle: 'Part 3 • Questions 18 - 21 of 25'
        };
      case 4:
      default: {
        const activeGroupId = activeQuestionNum <= 23 ? 16 : 17;
        const group = p4Groups.find(g => g.id === activeGroupId) || p4Groups[0];
        return {
          title: group.title,
          subtitle: 'Part 4 • Questions 22 - 25 of 25'
        };
      }
    }
  };

  const { title: partTitle, subtitle: partSubtitle } = getPartTitleAndInstruction();
  const { scoreP1, scoreP2, scoreP3, scoreP4, totalScore } = calculateScores();

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
                    style={{ background: '#00205B', borderColor: '#00205B', borderRadius: '2rem', fontWeight: 700 }}
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
                          {answeredCount}/25
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
                  <Title level={2} style={{ color: '#00205B', margin: 0 }}>Kết quả thi thử</Title>
                  <Text type="secondary" style={{ fontSize: '1rem', fontWeight: 500 }}>
                    Bạn đã hoàn thành {testTitle} trong kỹ năng Nghe hiểu
                  </Text>
                </Space>

                <S.ScoreRingWrapper>
                  <Progress 
                    type="circle" 
                    percent={Math.round(totalScore / totalQuestions * 100)} 
                    size={140}
                    strokeWidth={10}
                    strokeColor="#10b981"
                    format={() => (
                      <S.ScoreLabel>
                        <span className="score-val">{totalScore}</span>
                        <span className="score-max">/ 25 câu</span>
                      </S.ScoreLabel>
                    )}
                  />
                </S.ScoreRingWrapper>

                <S.ReportGrid>
                  <S.ReportStatItem>
                    <span className="stat-label">Cấp độ Nghe</span>
                    <span className="stat-value">{getAptisLevel(totalScore)}</span>
                  </S.ReportStatItem>
                  <S.ReportStatItem>
                    <span className="stat-label">Tỷ lệ đúng</span>
                    <span className="stat-value">{Math.round(totalScore / totalQuestions * 100)}%</span>
                  </S.ReportStatItem>
                  <S.ReportStatItem>
                    <span className="stat-label">Part 1 & 2</span>
                    <span className="stat-value">{scoreP1 + scoreP2} / 17 câu</span>
                  </S.ReportStatItem>
                  <S.ReportStatItem>
                    <span className="stat-label">Part 3 & 4</span>
                    <span className="stat-value">{scoreP3 + scoreP4} / 8 câu</span>
                  </S.ReportStatItem>
                </S.ReportGrid>

                <div style={{ width: '100%', textAlign: 'left', background: '#f8fafc', padding: '1.25rem 1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '6px', color: '#00205B', fontWeight: 700 }}>
                    <AlertOutlined /> <span>Nhận xét chi tiết từ hệ thống:</span>
                  </div>
                  <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>
                    {totalScore >= 22 
                      ? "Tuyệt vời! Kỹ năng nghe hiểu của bạn ở mức C (Cao cấp). Bạn có khả năng nghe hiểu chính xác mọi ý kiến, quan điểm và các chi tiết phức tạp trong cuộc đàm thoại dài. Hãy tiếp tục phát huy!" 
                      : totalScore >= 16 
                      ? "Rất tốt! Kỹ năng nghe của bạn đạt trình độ B2. Bạn có thể nghe hiểu hầu hết các ý chính và thông tin quan trọng. Luyện tập thêm kỹ năng bắt thông tin nhiễu ở Part 4 để nâng cao lên mức C."
                      : totalScore >= 9 
                      ? "Kỹ năng nghe của bạn ở mức B1. Bạn có thể nghe hiểu các hội thoại ngắn hàng ngày, tuy nhiên còn gặp khó khăn với cấu trúc câu phức tạp và tốc độ nói nhanh ở các đoạn hội thoại dài. Hãy luyện tập thêm."
                      : "Kỹ năng nghe của bạn đang ở mức A1/A2. Bạn cần nghe nhiều hơn, làm quen với nối âm và ngữ điệu nói của người bản xứ để nâng cao khả năng nắm bắt thông tin cơ bản."}
                  </p>
                </div>

                <Button 
                  type="primary" 
                  size="large"
                  style={{ borderRadius: '2rem', height: '48px', padding: '0 2.5rem', fontWeight: 700, background: '#00205B', borderColor: '#00205B' }}
                  onClick={() => setShowReport(false)} // Switch to Review Mode
                >
                  Xem lại đáp án chi tiết & Giải thích
                </Button>
              </S.ReportCard>
            </S.ReportContainer>
          ) : (
            <>
              <S.ContentBody>
                <S.WorkspaceGrid>
                  {/* Cột trái: Vùng làm bài theo Part */}
                  <S.QuestionsColumn>
                    <S.ContentCard>
                      <S.TitleArea>
                        <h2>{partTitle}</h2>
                        <div className="subtitle">{partSubtitle}</div>
                      </S.TitleArea>
                      {renderActiveQuestionContent()}
                    </S.ContentCard>
                  </S.QuestionsColumn>

                  {/* Cột phải: Bảng câu hỏi */}
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
                  Phần {activePart} trên 4 (Câu {activeQuestionNum} / 25)
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

export default ListeningMockTestPage;
