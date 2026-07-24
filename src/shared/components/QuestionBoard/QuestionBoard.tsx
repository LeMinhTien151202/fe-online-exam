import React from 'react';
import { Tooltip } from 'antd';
import * as S from './styled';

export type BoardStatus = 'unanswered' | 'partial' | 'answered';

export interface QuestionBoardItem {
  /** Giá trị truyền lại cho onJump khi bấm (thường là index hoặc số câu). */
  key: number;
  /** Nhãn hiển thị trên nút. */
  label: React.ReactNode;
  status: BoardStatus;
  /** Tooltip tuỳ chọn; nếu bỏ trống sẽ tự sinh theo trạng thái. */
  tooltip?: string;
}

interface QuestionBoardProps {
  items: QuestionBoardItem[];
  /** key của mục đang chọn để tô nút active. */
  activeKey: number;
  onJump: (key: number) => void;
  title?: string;
  sectionLabel?: string;
  /** Hiện chú thích trạng thái "làm dở" (dùng cho bộ nhiều câu con). */
  showPartial?: boolean;
  /** Nhãn trạng thái tuỳ biến theo dạng bài (mặc định: đã/chưa trả lời). */
  answeredLabel?: string;
  unansweredLabel?: string;
  partialLabel?: string;
}

const defaultTooltip = (
  label: React.ReactNode,
  status: BoardStatus,
  answered: string,
  unanswered: string,
  partial: string,
) => {
  const state = status === 'answered' ? answered : status === 'partial' ? partial : unanswered;
  return `Câu ${label}: ${state}`;
};

export const QuestionBoard: React.FC<QuestionBoardProps> = ({
  items,
  activeKey,
  onJump,
  title = 'Bảng câu hỏi',
  sectionLabel = 'Danh sách câu',
  showPartial = false,
  answeredLabel = 'Đã trả lời',
  unansweredLabel = 'Chưa trả lời',
  partialLabel = 'Đang làm dở',
}) => {
  if (items.length === 0) return null;
  const answeredCount = items.filter((it) => it.status === 'answered').length;

  return (
    <S.NavPanel>
      <S.PanelTitle>{title}</S.PanelTitle>
      <S.GridScrollContainer>
        <S.SectionLabel>{sectionLabel}</S.SectionLabel>
        <S.ButtonGrid>
          {items.map((item) => (
            <Tooltip
              key={item.key}
              title={item.tooltip ?? defaultTooltip(item.label, item.status, answeredLabel, unansweredLabel, partialLabel)}
              mouseEnterDelay={0.15}
            >
              <S.NavGridButton
                $status={item.status}
                $active={activeKey === item.key}
                onClick={() => onJump(item.key)}
              >
                {item.label}
              </S.NavGridButton>
            </Tooltip>
          ))}
        </S.ButtonGrid>
      </S.GridScrollContainer>

      <S.Legend>
        <S.LegendItem>
          <S.LegendDot $variant="unanswered" />
          <span>{unansweredLabel}</span>
        </S.LegendItem>
        {showPartial && (
          <S.LegendItem>
            <S.LegendDot $variant="partial" />
            <span>{partialLabel}</span>
          </S.LegendItem>
        )}
        <S.LegendItem>
          <S.LegendDot $variant="answered" />
          <span>{answeredLabel} ({answeredCount}/{items.length})</span>
        </S.LegendItem>
        <S.LegendItem>
          <S.LegendDot $variant="active" />
          <span>Đang chọn</span>
        </S.LegendItem>
      </S.Legend>
    </S.NavPanel>
  );
};

export default QuestionBoard;
