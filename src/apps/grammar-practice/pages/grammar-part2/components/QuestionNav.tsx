import React from 'react';
import { Tooltip } from 'antd';
import * as S from '../styles/styled';

interface QuestionNavProps {
  answers: Record<number, string>;
  currentQuestionIndex: number;
  totalAnswered: number;
  onNavigateQuestion: (qNum: number) => void;
  partId?: string;
}

export const QuestionNav: React.FC<QuestionNavProps> = ({
  answers,
  currentQuestionIndex,
  totalAnswered,
  onNavigateQuestion,
  partId,
}) => {
  const isPartMode = !!partId;
  const grammarQuestions = Array.from({ length: 25 }, (_, i) => i + 1);
  const vocabularyQuestions = Array.from({ length: 25 }, (_, i) => i + 26);

  const getQuestionStatus = (qNum: number): 'unanswered' | 'answered' => {
    if (answers[qNum]) return 'answered';
    return 'unanswered';
  };

  const renderGridButtons = (qNumbers: number[]) => {
    return (
      <S.ButtonGrid>
        {qNumbers.map((qNum) => {
          const status = getQuestionStatus(qNum);
          const isActive = currentQuestionIndex === qNum;

          // Determine placement based on grid position (5 columns)
          // Column 1 (index % 5 === 1): topRight to avoid left edge cutoff
          // Column 5 (index % 5 === 0): topLeft to avoid right edge cutoff
          let placement: 'top' | 'topRight' | 'topLeft' = 'top';
          if (qNum % 5 === 1) {
            placement = 'topRight';
          } else if (qNum % 5 === 0) {
            placement = 'topLeft';
          }

          return (
            <Tooltip
              key={qNum}
              title={`Câu ${qNum}: ${
                status === 'answered'
                  ? 'Đã trả lời'
                  : 'Chưa trả lời'
              }`}
              placement={placement}
              mouseEnterDelay={0.15}
            >
              <S.NavGridButton
                $status={status === 'answered' ? 'answered' : 'unanswered'}
                $active={isActive}
                onClick={() => onNavigateQuestion(qNum)}
              >
                {qNum}
              </S.NavGridButton>
            </Tooltip>
          );
        })}
      </S.ButtonGrid>
    );
  };

  const showGrammar = !isPartMode || partId === '1';
  const showVocab = !isPartMode || partId === '2';

  const displayTotalAnswered = isPartMode
    ? (partId === '1'
        ? Object.keys(answers).map(Number).filter(k => k >= 1 && k <= 25).length
        : Object.keys(answers).map(Number).filter(k => k >= 26 && k <= 50).length)
    : totalAnswered;

  const totalQuestionsLimit = isPartMode ? 25 : 50;

  return (
    <S.NavPanel>
      <S.PanelTitle>Bảng câu hỏi</S.PanelTitle>

      <S.GridScrollContainer>
        {showGrammar && (
          <>
            <S.SectionLabel>Ngữ pháp (1 - 25)</S.SectionLabel>
            {renderGridButtons(grammarQuestions)}
          </>
        )}

        {showVocab && (
          <>
            <S.SectionLabel>Từ vựng (26 - 50)</S.SectionLabel>
            {renderGridButtons(vocabularyQuestions)}
          </>
        )}
      </S.GridScrollContainer>

      <S.Legend>
        <S.LegendItem>
          <S.LegendColorDot $type="unanswered" />
          <span>Chưa trả lời</span>
        </S.LegendItem>
        <S.LegendItem>
          <S.LegendColorDot $type="answered" />
          <span>Đã trả lời</span>
        </S.LegendItem>
        <S.LegendItem>
          <S.LegendColorDot $type="active" />
          <span>Đang chọn</span>
        </S.LegendItem>
      </S.Legend>

      <S.NavProgressRow>
        <span>Tiến độ:</span>
        <span>{displayTotalAnswered}/{totalQuestionsLimit} câu</span>
      </S.NavProgressRow>
    </S.NavPanel>
  );
};
