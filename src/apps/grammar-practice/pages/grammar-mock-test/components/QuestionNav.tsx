import React from 'react';
import { Tooltip } from 'antd';
import * as S from '../styles/styled';

// Mỗi ô trên bảng = 1 "đơn vị" hiển thị: câu MC (grammar) hoặc cả 1 task từ vựng (bộ 5 câu)
export interface GrammarNavItem {
  display: number; // số hiển thị (1..25 grammar, 26..30 mỗi task vocab)
  answered: boolean;
  active: boolean;
  tooltip?: string;
}

export interface GrammarNavSection {
  label: string;
  items: GrammarNavItem[];
}

interface QuestionNavProps {
  totalAnswered: number;
  totalQuestions: number;
  sections: GrammarNavSection[];
  onNavigate: (display: number) => void;
}

export const QuestionNav: React.FC<QuestionNavProps> = ({
  totalAnswered,
  totalQuestions,
  sections,
  onNavigate,
}) => {
  const renderGridButtons = (items: GrammarNavItem[]) => (
    <S.ButtonGrid>
      {items.map((item, index) => {
        const col = index % 5;
        let placement: 'top' | 'topRight' | 'topLeft' = 'top';
        if (col === 0) placement = 'topRight';
        else if (col === 4) placement = 'topLeft';

        return (
          <Tooltip
            key={item.display}
            title={item.tooltip ?? `Câu ${item.display}: ${item.answered ? 'Đã trả lời' : 'Chưa trả lời'}`}
            placement={placement}
            mouseEnterDelay={0.15}
          >
            <S.NavGridButton
              $status={item.answered ? 'answered' : 'unanswered'}
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
        {sections.map((section) => (
          <React.Fragment key={section.label}>
            <S.SectionLabel>{section.label}</S.SectionLabel>
            {renderGridButtons(section.items)}
          </React.Fragment>
        ))}
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
        <span>{totalAnswered}/{totalQuestions} câu</span>
      </S.NavProgressRow>
    </S.NavPanel>
  );
};
