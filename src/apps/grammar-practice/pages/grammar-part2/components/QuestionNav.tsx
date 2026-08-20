import React from 'react';
import { Tooltip } from 'antd';
import * as S from '../styles/styled';

// Mỗi ô trên bảng = 1 "đơn vị": với Part 2 là cả 1 task từ vựng (bộ 5 câu trong 1 bản ghi)
export interface NavItem {
  display: number;
  answered: boolean;
  // Task đã được BE chấm (chấm ngay từng task).
  graded?: boolean;
  active: boolean;
  tooltip?: string;
}

interface QuestionNavProps {
  items: NavItem[];
  sectionLabel?: string;
  totalAnswered: number;
  totalQuestions: number;
  onNavigate: (display: number) => void;
}

export const QuestionNav: React.FC<QuestionNavProps> = ({
  items,
  sectionLabel,
  totalAnswered,
  totalQuestions,
  onNavigate,
}) => {
  const renderGridButtons = () => (
    <S.ButtonGrid>
      {items.map((item, idx) => {
        const col = idx % 5;
        let placement: 'top' | 'topRight' | 'topLeft' = 'top';
        if (col === 0) placement = 'topRight';
        else if (col === 4) placement = 'topLeft';

        return (
          <Tooltip
            key={item.display}
            title={item.tooltip ?? `Câu ${item.display}: ${item.graded ? 'Đã chấm' : item.answered ? 'Đang làm' : 'Chưa làm'}`}
            placement={placement}
            mouseEnterDelay={0.15}
          >
            <S.NavGridButton
              $status={item.graded ? 'graded' : item.answered ? 'answered' : 'unanswered'}
              $active={item.active}
              onClick={() => onNavigate(item.display)}
            >
              {item.display}
            </S.NavGridButton>
          </Tooltip>
        );
      })}
    </S.ButtonGrid>
  );

  return (
    <S.NavPanel>
      <S.PanelTitle>Bảng câu hỏi</S.PanelTitle>

      <S.GridScrollContainer>
        <S.SectionLabel>{sectionLabel || 'Danh sách câu'}</S.SectionLabel>
        {renderGridButtons()}
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
        <span>{totalAnswered}/{totalQuestions} câu</span>
      </S.NavProgressRow>
    </S.NavPanel>
  );
};
