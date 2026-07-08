import React from 'react';
import { Tooltip } from 'antd';
import * as S from '../styles/styled';

interface QuestionNavProps {
  answers: Record<number, string>;
  currentQuestionIndex: number;
  totalAnswered: number;
  onNavigateQuestion: (qNum: number) => void;
  partId?: string;
  // Danh sách số câu động (nối API); nếu có sẽ ưu tiên dùng thay cho dải cứng 1-25/26-50
  questionNumbers?: number[];
  sectionLabel?: string;
}

export const QuestionNav: React.FC<QuestionNavProps> = ({
  answers,
  currentQuestionIndex,
  onNavigateQuestion,
  questionNumbers,
  sectionLabel,
}) => {
  const numbers = questionNumbers && questionNumbers.length > 0 ? questionNumbers : [];

  const getQuestionStatus = (qNum: number): 'unanswered' | 'answered' =>
    answers[qNum] ? 'answered' : 'unanswered';

  const renderGridButtons = (qNumbers: number[]) => (
    <S.ButtonGrid>
      {qNumbers.map((qNum, idx) => {
        const status = getQuestionStatus(qNum);
        const isActive = currentQuestionIndex === qNum;
        const col = idx % 5;
        let placement: 'top' | 'topRight' | 'topLeft' = 'top';
        if (col === 0) placement = 'topRight';
        else if (col === 4) placement = 'topLeft';

        return (
          <Tooltip
            key={qNum}
            title={`Câu ${qNum}: ${status === 'answered' ? 'Đã trả lời' : 'Chưa trả lời'}`}
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

  const answeredInSet = numbers.filter((n) => !!answers[n]).length;

  return (
    <S.NavPanel>
      <S.PanelTitle>Bảng câu hỏi</S.PanelTitle>

      <S.GridScrollContainer>
        <S.SectionLabel>{sectionLabel || 'Danh sách câu'}</S.SectionLabel>
        {renderGridButtons(numbers)}
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
        <span>{answeredInSet}/{numbers.length} câu</span>
      </S.NavProgressRow>
    </S.NavPanel>
  );
};
