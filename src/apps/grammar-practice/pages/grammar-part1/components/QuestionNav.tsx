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
  // Câu đã được BE chấm (chấm ngay từng câu) — hiển thị khác với câu mới chọn đáp án.
  gradedNumbers?: number[];
}

const STATUS_LABEL: Record<'unanswered' | 'answered' | 'graded', string> = {
  unanswered: 'Chưa làm',
  answered: 'Đang làm',
  graded: 'Đã chấm',
};

export const QuestionNav: React.FC<QuestionNavProps> = ({
  answers,
  currentQuestionIndex,
  onNavigateQuestion,
  questionNumbers,
  sectionLabel,
  gradedNumbers,
}) => {
  const numbers = questionNumbers && questionNumbers.length > 0 ? questionNumbers : [];
  const graded = new Set(gradedNumbers ?? []);

  const getQuestionStatus = (qNum: number): 'unanswered' | 'answered' | 'graded' => {
    if (graded.has(qNum)) return 'graded';
    return answers[qNum] ? 'answered' : 'unanswered';
  };

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
            title={`Câu ${qNum}: ${STATUS_LABEL[status]}`}
            placement={placement}
            mouseEnterDelay={0.15}
          >
            <S.NavGridButton
              $status={status}
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

  const gradedInSet = numbers.filter((n) => graded.has(n)).length;

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
          <span>Chưa làm</span>
        </S.LegendItem>
        <S.LegendItem>
          <S.LegendColorDot $type="answered" />
          <span>Đang làm</span>
        </S.LegendItem>
        <S.LegendItem>
          <S.LegendColorDot $type="graded" />
          <span>Đã chấm</span>
        </S.LegendItem>
        <S.LegendItem>
          <S.LegendColorDot $type="active" />
          <span>Đang chọn</span>
        </S.LegendItem>
      </S.Legend>

      <S.NavProgressRow>
        <span>Đã chấm:</span>
        <span>{gradedInSet}/{numbers.length} câu</span>
      </S.NavProgressRow>
    </S.NavPanel>
  );
};
