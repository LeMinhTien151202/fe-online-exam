import {
  BulbOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  LeftOutlined,
  RightOutlined,
  RollbackOutlined
} from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import { Button, Progress, Select, Space, Tag } from 'antd';
import { ExamLoading, ExamEmpty } from '@/shared/components/ExamState';
import React from 'react';
import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import { usePart1Action } from '../hook/usePart1Action';
import * as S from '../styles/styled';

export const Part1Page: React.FC = () => {
  const navigate = useNavigate();
  const {
    isLoading,
    data,
    gapCount,
    correctAnswers,
    total,
    currentNumber,
    hasNext,
    hasPrev,
    handleNext,
    handlePrev,
    timeLeft,
    answers,
    isSubmitted,
    handleSelectChange,
    handleSubmit,
    handleRetry,
    answeredCount,
    progressPercent,
    correctCount,
    formatTime
  } = usePart1Action();

  // Ô chọn đáp án cho 1 chỗ trống
  const renderGapSelect = (gapId: number, options: string[]) => {
    const status = isSubmitted
      ? answers[gapId] === correctAnswers[gapId]
        ? 'success'
        : 'error'
      : 'default';
    return (
      <>
        <S.InlineSentenceSelect
          placeholder="Chọn đáp án"
          onChange={(val) => handleSelectChange(gapId, val as string)}
          value={answers[gapId]}
          dropdownMatchSelectWidth={false}
          $hasValue={!!answers[gapId]}
          $status={status}
          disabled={isSubmitted}
        >
          {options.map((opt) => (
            <Select.Option key={opt} value={opt}>{opt}</Select.Option>
          ))}
        </S.InlineSentenceSelect>
        {isSubmitted && answers[gapId] !== correctAnswers[gapId] && (
          <S.CorrectAnswerText>
            (Đáp án đúng: <strong>{correctAnswers[gapId]}</strong>)
          </S.CorrectAnswerText>
        )}
      </>
    );
  };

  const renderPassage = () => {
    if (!data) return null;
    const optionsByGap = new Map(data.questions.map((q) => [q.id, q.options]));

    // 1) Dạng chuẩn ___(n): chèn Select đúng vị trí theo số
    if (/___\(\d+\)/.test(data.content)) {
      const segments = data.content.split(/___\((\d+)\)/g);
      return (
        <S.QuestionText style={{ whiteSpace: 'pre-line', lineHeight: 2.6 }}>
          {segments.map((seg, i) =>
            i % 2 === 1 ? (
              <React.Fragment key={`gap-${seg}`}>
                {renderGapSelect(Number(seg), optionsByGap.get(Number(seg)) ?? [])}
              </React.Fragment>
            ) : (
              <React.Fragment key={`text-${i}`}>{seg}</React.Fragment>
            )
          )}
        </S.QuestionText>
      );
    }

    // 2) Dạng gạch chân "___" (không đánh số): thay lần lượt theo thứ tự câu hỏi
    if (/_{2,}/.test(data.content)) {
      const segments = data.content.split(/_{2,}/g); // n chỗ trống -> n+1 đoạn
      let blankIdx = -1;
      return (
        <S.QuestionText style={{ whiteSpace: 'pre-line', lineHeight: 2.6 }}>
          {segments.map((seg, i) => {
            const nodes = [<React.Fragment key={`text-${i}`}>{seg}</React.Fragment>];
            if (i < segments.length - 1) {
              blankIdx += 1;
              const q = data.questions[blankIdx];
              if (q) {
                nodes.push(
                  <React.Fragment key={`gap-${q.id}`}>
                    {renderGapSelect(q.id, q.options)}
                  </React.Fragment>
                );
              }
            }
            return nodes;
          })}
        </S.QuestionText>
      );
    }

    // 3) Không có chỗ trống trong đoạn: hiện đoạn văn rồi liệt kê từng câu + ô chọn
    return (
      <>
        {data.content && (
          <S.QuestionText style={{ marginBottom: 16, whiteSpace: 'pre-line' }}>
            {data.content}
          </S.QuestionText>
        )}
        {data.questions.map((q) => (
          <S.QuestionRow key={q.id}>
            <S.BadgeNumber>{q.id}</S.BadgeNumber>
            <S.QuestionText>{renderGapSelect(q.id, q.options)}</S.QuestionText>
          </S.QuestionRow>
        ))}
      </>
    );
  };

  return (
    <HomeS.MainLayout>
      <Sidebar />
      <HomeS.RightColumn>
        <S.PageContainer>
          <S.Header>
            <Space size="large">
              <S.BackLink to="/reading">
                <LeftOutlined /> Quay lại danh sách
              </S.BackLink>
              <S.HeaderTitle>
                Part 1: Sentence Comprehension
              </S.HeaderTitle>
              {total > 0 && (
                <Tag color="blue" style={{ fontWeight: 600 }}>Câu {currentNumber}/{total}</Tag>
              )}
              {isSubmitted && gapCount > 0 && (
                <Tag color={correctCount >= Math.ceil(gapCount * 0.8) ? 'success' : 'warning'} style={{ fontWeight: 600 }}>
                  Kết quả: {correctCount}/{gapCount}
                </Tag>
              )}
            </Space>

            <Space size="large" className="flex items-center">
              <Progress
                type="circle"
                percent={progressPercent}
                size={40}
                strokeColor="#10b981"
                trailColor="rgba(255,255,255,0.2)"
                format={() => <S.ProgressText>{answeredCount}/{gapCount || 0}</S.ProgressText>}
              />
              <S.TimerWrapper>
                <ClockCircleOutlined className="text-[#fbbf24] mr-1" />
                {formatTime(timeLeft)}
              </S.TimerWrapper>
            </Space>
          </S.Header>

          <S.MainContent>
            <S.ContentCard>
              <S.TitleArea>
                <h2>Hoàn thành các câu hỏi dưới đây</h2>
                <div className="subtitle">
                  Select the correct word from the dropdown to complete each sentence.
                </div>
                <S.TipBox>
                  💡 Tip: Double-click vào từ tiếng Anh bất kỳ để tra nghĩa
                </S.TipBox>
              </S.TitleArea>

              {isLoading ? (
                <ExamLoading />
              ) : data ? (
                <div className="flex flex-col">{renderPassage()}</div>
              ) : (
                <ExamEmpty />
              )}
            </S.ContentCard>

            <S.AdminExperienceCard>
              <div className="info-left">
                <div className="icon-bulb">
                  <BulbOutlined />
                </div>
                <div className="text-content">
                  <div className="title">Kinh nghiệm của Admin cho Part 1</div>
                  <div className="subtitle">Sentence Comprehension</div>
                </div>
              </div>
              <button className="btn-show">Show</button>
            </S.AdminExperienceCard>
          </S.MainContent>

          <S.Footer>
            <Space size="middle">
              <S.FooterButton
                type="default"
                icon={<LeftOutlined />}
                size="large"
                onClick={() => navigate({ to: '/reading' })}
              >
                Quay lại danh sách
              </S.FooterButton>
              {hasPrev && (
                <Button size="large" onClick={handlePrev}>Câu trước</Button>
              )}
            </Space>

            <Space size="middle">
              {isSubmitted ? (
                <S.RetryButton
                  type="primary"
                  icon={<RollbackOutlined />}
                  size="large"
                  onClick={handleRetry}
                >
                  Làm lại
                </S.RetryButton>
              ) : (
                <S.SubmitButton
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  size="large"
                  onClick={handleSubmit}
                  disabled={!data}
                >
                  Nộp bài
                </S.SubmitButton>
              )}
              {hasNext && (
                <Button
                  type="primary"
                  size="large"
                  onClick={handleNext}
                  icon={<RightOutlined />}
                >
                  Câu tiếp theo
                </Button>
              )}
            </Space>
          </S.Footer>
        </S.PageContainer>
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default Part1Page;
