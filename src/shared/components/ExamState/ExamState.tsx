import { InboxOutlined, LeftOutlined } from '@ant-design/icons';
import { Button, Skeleton } from 'antd';
import type { ReactNode } from 'react';
import { APP_COLORS } from '@/configs/antDesign';
import * as S from './styled';

/**
 * Skeleton loading khớp dáng bố cục bài thi (thay cho Spin tròn chung chung).
 */
export const ExamLoading: React.FC = () => (
  <S.LoadingWrapper>
    <S.SkeletonCard>
      <Skeleton active title={{ width: '45%' }} paragraph={{ rows: 2, width: ['80%', '60%'] }} />
      <S.SkeletonBlock />
      <Skeleton active title={false} paragraph={{ rows: 3 }} />
    </S.SkeletonCard>
    <S.SkeletonCard>
      <Skeleton.Button active block style={{ height: 120 }} />
      <Skeleton active title={{ width: '35%' }} paragraph={{ rows: 2 }} />
    </S.SkeletonCard>
  </S.LoadingWrapper>
);

interface ExamEmptyProps {
  title?: string;
  description?: ReactNode;
  /** Nhãn nút hành động (mặc định "Quay lại"). */
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Empty state được dàn dựng: icon + tiêu đề + mô tả + nút quay lại.
 */
export const ExamEmpty: React.FC<ExamEmptyProps> = ({
  title = 'Chưa có nội dung',
  description = 'Phần này hiện chưa có câu hỏi. Vui lòng quay lại sau.',
  actionLabel = 'Quay lại',
  onAction,
}) => (
  <S.EmptyWrapper>
    <S.EmptyIcon>
      <InboxOutlined />
    </S.EmptyIcon>
    <S.EmptyTitle>{title}</S.EmptyTitle>
    <S.EmptyText>{description}</S.EmptyText>
    {onAction && (
      <Button
        type="primary"
        icon={<LeftOutlined />}
        onClick={onAction}
        style={{ backgroundColor: APP_COLORS.primary, borderColor: APP_COLORS.primary }}
      >
        {actionLabel}
      </Button>
    )}
  </S.EmptyWrapper>
);
