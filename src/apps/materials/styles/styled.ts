import styled from 'styled-components';
import { Input, Select } from 'antd';

// Shared Layout Styled Components
import * as S from '../../home/pages/styled';

export const CustomContentArea = styled(S.ContentArea)`
  background: #f4f7fe; /* Xám nhạt bao bọc toàn bộ trang */
`;

export const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

export const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SearchWrapper = styled.div`
  flex: 1;
  min-width: 250px;
`;

export const StyledInput = styled(Input)`
  height: 2.75rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover, &:focus {
    border-color: #1a365d; /* Màu chủ đạo Navy thay vì xanh dương */
    box-shadow: 0 0 0 2px rgba(26, 54, 93, 0.1);
  }
`;

export const StyledSelect = styled(Select)`
  width: 150px;
  height: 2.75rem;

  @media (max-width: 640px) {
    width: 100%;
  }

  .ant-select-selector {
    border-radius: 0.75rem !important;
    border: 1px solid rgba(0, 0, 0, 0.08) !important;
    height: 2.75rem !important;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
    transition: all 0.2s ease !important;
  }

  &:hover .ant-select-selector,
  &.ant-select-focused .ant-select-selector {
    border-color: #1a365d !important; /* Màu chủ đạo Navy */
  }
`;

export const TabBar = styled.div`
  display: flex;
  gap: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const TabItem = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  padding: 0.75rem 0.25rem;
  font-size: 0.9375rem;
  font-weight: ${(props) => (props.$active ? '600' : '500')};
  color: ${(props) => (props.$active ? '#1a365d' : '#64748b')}; /* Màu chủ đạo Navy */
  border-bottom: 2px solid ${(props) => (props.$active ? '#1a365d' : 'transparent')};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: #1a365d;
  }
`;

export const MaterialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const MaterialCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.05),
    0 1px 2px rgba(0, 0, 0, 0.02);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-0.25rem);
    box-shadow:
      0 20px 25px -5px rgba(0, 0, 0, 0.05),
      0 10px 10px -5px rgba(0, 0, 0, 0.03);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

export const FileIconWrapper = styled.div<{ $bg: string; $color: string }>`
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${(props) => props.$bg};
  color: ${(props) => props.$color};
  font-size: 1.5rem;
`;

export const CardContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const DocTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #0d2245; /* Navy đậm sang trọng */
  margin: 0 0 0.25rem 0;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const DocDescription = styled.p`
  font-size: 0.8125rem;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TagRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

export const SkillTag = styled.span<{ $skill: string }>`
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.25rem 0.625rem;
  border-radius: 6.25rem;
  white-space: nowrap;
  
  background: ${(props) => {
    switch (props.$skill.toLowerCase()) {
      case 'writing':
      case 'viết':
        return '#dcfce7';
      case 'speaking':
      case 'nói':
        return '#ffedd5';
      case 'reading':
      case 'đọc':
        return '#e0f2fe';
      case 'listening':
      case 'nghe':
        return '#f3e8ff';
      default:
        return '#ffe4e6';
    }
  }};
  
  color: ${(props) => {
    switch (props.$skill.toLowerCase()) {
      case 'writing':
      case 'viết':
        return '#15803d';
      case 'speaking':
      case 'nói':
        return '#c2410c';
      case 'reading':
      case 'đọc':
        return '#0369a1';
      case 'listening':
      case 'nghe':
        return '#7e22ce';
      default:
        return '#b91c1c';
    }
  }};
`;

export const FormatTag = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  color: #64748b;
  background: #f1f5f9;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  text-transform: uppercase;
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
`;

export const FileSize = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
`;

export const DownloadBtn = styled.button`
  background: #f1f5f9;
  border: none;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #1a365d; /* Màu Navy chủ đạo thay vì xanh dương */
    color: white;
    transform: scale(1.05);
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  color: #64748b;
`;
