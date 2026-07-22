import { Link } from '@tanstack/react-router';
import { Button,Select } from 'antd';
import styled from 'styled-components';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100dvh;
  width: 100%;
  background: #ffffff;
  overflow: hidden;
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 4.5rem;
  background: #0D2245;
  color: white;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
  z-index: 10;
`;

export const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #94a3b8;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    color: white;
  }
`;

export const TimerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-family: monospace;
  font-size: 1.125rem;
  font-weight: bold;
`;

export const MainContent = styled.main<{ $hasBoard?: boolean }>`
  display: grid;
  grid-template-columns: ${(props) => (props.$hasBoard ? '1.15fr 0.85fr 300px' : '1.15fr 0.85fr')};
  gap: 1.5rem;
  padding: 2rem 2rem;
  flex: 1;
  overflow-y: auto;
  align-content: start;
  background: #ffffff;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  padding-right: 0.5rem;
`;

export const ColumnHeader = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.25rem;
`;

export const ColumnSubHeader = styled.div`
  font-size: 0.95rem;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

export const StoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const FixedSentenceCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem 1.25rem;
  font-size: 0.975rem;
  line-height: 1.5;
  color: #0f172a;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.01);
  min-height: 56px;
  display: flex;
  align-items: center;
`;

export const EmptySlotDropzone = styled.div<{ $isOver?: boolean }>`
  background: ${props => props.$isOver ? '#f0fdf4' : '#fafafa'};
  border: 1px dashed ${props => props.$isOver ? '#10b981' : '#cbd5e1'};
  border-radius: 0.5rem;
  padding: 1rem 1.25rem;
  font-size: 0.975rem;
  color: #94a3b8;
  font-weight: 600;
  text-align: center;
  min-height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background: #f8fafc;
    border-color: #94a3b8;
  }
`;

export const PlacedItemCard = styled.div<{ $status?: 'success' | 'error' | 'default' }>`
  background: #ffffff;
  border: 1px solid ${props => {
    if (props.$status === 'success') return '#10b981';
    if (props.$status === 'error') return '#ef4444';
    return '#1a365d';
  }};
  border-radius: 0.5rem;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-shadow: 0 4px 10px rgba(${props => {
    if (props.$status === 'success') return '16, 185, 129';
    if (props.$status === 'error') return '239, 68, 68';
    return '26, 54, 93';
  }}, 0.02);
  min-height: 56px;
  cursor: grab;

  .text {
    font-size: 0.975rem;
    color: #1e293b;
    font-weight: 600;
    line-height: 1.5;
    flex: 1;
    padding-right: 1rem;
  }

  .btn-remove {
    background: none;
    border: none;
    color: #ef4444;
    font-weight: 700;
    cursor: pointer;
    font-size: 1.1rem;
    padding: 0 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
    
    &:hover {
      color: #dc2626;
    }
  }
`;

export const OptionsPool = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const DraggableCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.01);
  cursor: grab;
  transition: all 0.2s;
  min-height: 56px;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.03);
  }

  &:active {
    cursor: grabbing;
  }
`;

export const DragGripHandle = styled.div`
  color: #94a3b8;
  font-size: 1.15rem;
  line-height: 1;
  user-select: none;
  font-weight: bold;
`;

export const DraggableText = styled.span`
  font-size: 0.975rem;
  color: #334155;
  font-weight: 600;
  line-height: 1.5;
`;

export const AdminExperienceCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  background: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02);
  margin-top: 1rem;

  .info-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .icon-bulb {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.5rem;
    background: #fffbeb;
    border: 1px solid #fef3c7;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #d97706;
    font-size: 1.25rem;
  }

  .text-content {
    display: flex;
    flex-direction: column;
    
    .title {
      font-weight: 700;
      color: #0f172a;
      font-size: 1rem;
    }

    .subtitle {
      font-size: 0.85rem;
      color: #64748b;
      font-weight: 500;
    }
  }

  .btn-show {
    padding: 0.375rem 1rem;
    border-radius: 0.375rem;
    border: 1px solid #cbd5e1;
    background: #ffffff;
    color: #64748b;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      background: #f8fafc;
      color: #334155;
      border-color: #94a3b8;
    }
  }
`;

export const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem;
  height: 4.5rem;
  background: white;
  border-top: 1px solid #e4e4e7;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.03);
  z-index: 10;
`;

export const HeaderSelect = styled(Select)`
  min-width: 80px;
  
  .ant-select-selector {
    border-radius: 2rem !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    background: rgba(255, 255, 255, 0.1) !important;
    color: white !important;
    font-weight: bold !important;
    
    .ant-select-selection-item {
      color: white !important;
    }
  }

  .ant-select-arrow {
    color: white !important;
  }
`;

export const TitleArea = styled.div`
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 1.25rem;
  margin-bottom: 1.5rem;
  width: 100%;

  h2 {
    font-size: 1.65rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 6px 0;
  }

  .subtitle {
    font-size: 0.95rem;
    color: #64748b;
    font-weight: 600;
    margin-bottom: 8px;
  }
`;

export const TipBox = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  color: #b45309;
  font-weight: 500;
  font-style: italic;
`;

export const HeaderTitle = styled.span`
  font-size: clamp(1rem, 3vw, 1.25rem);
  font-weight: 700;
  color: white;
`;

export const ProgressText = styled.span`
  color: white;
  font-size: 0.6875rem;
  font-weight: bold;
`;

export const AlertWrapper = styled.div`
  width: 100%;
  max-width: 75rem;
  margin: 0 auto;
`;

export const AlertOuterWrapper = styled.div`
  padding: 1.5rem 2rem 0 2rem;
`;

export const OptionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const CorrectAnswerRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  padding: 1rem 1.25rem;
  border-radius: 0.5rem;
`;

export const CorrectBadgeNumber = styled.span`
  background: #10b981;
  color: white;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.85rem;
  flex-shrink: 0;
`;

export const CorrectAnswerText = styled.span`
  color: #14532d;
  font-weight: 600;
  font-size: 0.95rem;
`;

export const CompletedMessage = styled.div`
  text-align: center;
  padding: 2rem;
  border: 1.5px dashed #10b981;
  border-radius: 0.5rem;
  background: #f6fdfa;
  color: #059669;
  font-weight: 600;
`;

export const FooterButton = styled(Button)`
  border-radius: 2rem !important;
  font-weight: 600 !important;
  padding: 0 1.5rem !important;
  color: #64748b !important;
  border: 1px solid #e2e8f0 !important;
`;

export const SubmitButton = styled(Button)`
  border-radius: 2rem !important;
  font-weight: 600 !important;
  background: #1a365d !important;
  border-color: #1a365d !important;
  padding: 0 2rem !important;
  color: white !important;
  box-shadow: 0 4px 6px -1px rgba(26, 54, 93, 0.25) !important;
  
  &:hover {
    background: #12263f !important;
    border-color: #12263f !important;
  }
`;

export const RetryButton = styled(Button)`
  border-radius: 2rem !important;
  font-weight: 600 !important;
  background: #6366f1 !important;
  border-color: #6366f1 !important;
  padding: 0 2rem !important;
  color: white !important;
  box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.2) !important;
  
  &:hover {
    background: #4f46e5 !important;
    border-color: #4f46e5 !important;
  }
`;
