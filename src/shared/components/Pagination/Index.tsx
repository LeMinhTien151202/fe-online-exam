import React from 'react';
import { Pagination, Select } from 'antd';
import styled from 'styled-components';
import { APP_COLORS } from '@/configs/antDesign';

interface AppPaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number, pageSize: number) => void;
  pageSizeOptions?: string[];
}

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  width: 100%;
  font-family: 'Outfit', sans-serif;
`;

const TotalText = styled.div`
  color: #64748b;
  font-size: 0.875rem;
`;

const StyledPagination = styled(Pagination)`
  .ant-pagination-item {
    border-radius: 4px;
    border: 1px solid transparent;
    transition: all 0.3s;

    a {
      color: #1a365d;
    }

    &-active {
      border-color: ${APP_COLORS.primary} !important;
      background: white;
      
      a {
        color: ${APP_COLORS.primary} !important;
        font-weight: 600;
      }
    }

    &:hover {
      border-color: ${APP_COLORS.primary};
      a { color: ${APP_COLORS.primary}; }
    }
  }

  .ant-pagination-prev, .ant-pagination-next {
    button {
      border: none !important;
      background: transparent !important;
      color: #94a3b8 !important;
    }
  }
`;

const PageSizeSelector = styled.div`
  display: flex;
  align-items: center;
  
  .ant-select-selector {
    border-radius: 8px !important;
    border: 1px solid #e5e7eb !important;
    height: 40px !important;
    padding: 0 16px !important;
    display: flex;
    align-items: center;
    box-shadow: none !important;
    background-color: white !important;
  }

  .ant-select-selection-item {
    font-size: 14px;
    font-weight: 500;
    color: #111827 !important;
  }

  .ant-select-arrow {
    color: #9ca3af;
    font-size: 10px;
  }
`;

export const AppPagination: React.FC<AppPaginationProps> = ({
  current,
  total,
  pageSize,
  onChange,
  pageSizeOptions = ['10', '20', '50', '100']
}) => {
  const start = (current - 1) * pageSize + 1;
  const end = Math.min(current * pageSize, total);

  return (
    <PaginationContainer>
      <TotalText>
        {start}-{end} trong số {total}
      </TotalText>

      <StyledPagination
        current={current}
        total={total}
        pageSize={pageSize}
        onChange={onChange}
        showSizeChanger={false} // We handle it manually to match layout
        itemRender={(page, type, originalElement) => {
          if (type === 'prev') return <span>&lt;</span>;
          if (type === 'next') return <span>&gt;</span>;
          return originalElement;
        }}
      />

      <PageSizeSelector>
        <Select
          value={pageSize.toString()}
          onChange={(val) => onChange(1, parseInt(val))}
          style={{ width: 120 }}
          options={Array.from(new Set([...pageSizeOptions, pageSize.toString()]))
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map(opt => ({ label: `${opt} / trang`, value: opt }))}
        />
      </PageSizeSelector>
    </PaginationContainer>
  );
};
