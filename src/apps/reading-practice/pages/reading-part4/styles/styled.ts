import styled from 'styled-components';
import { Card, Button } from 'antd';
import { Link } from '@tanstack/react-router';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100dvh;
  width: 100%;
  background: #ffffff;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 4.5rem;
  background: #0D2245;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
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

export const MainContent = styled.main`
  display: grid;
  grid-template-columns: 6.5fr 3.5fr;
  gap: 1.5rem;
  padding: 2rem 2rem;
  flex: 1;
  overflow: hidden;
  background: #ffffff;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }
`;

export const ScrollableColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  overflow-y: auto;
  padding-right: 0.5rem;
`;

export const ParagraphWrapper = styled.div`
  display: flex;
  gap: 1rem;
  background: white;
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.01);
`;

export const ParagraphNumber = styled.div`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: #eff6ff;
  color: #2563eb;
  font-weight: bold;
  font-size: 1.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.1);
`;

export const QuestionSlot = styled(Card)<{ $isAnswered: boolean; $status?: 'success' | 'error' | 'default' }>`
  border-radius: 0.75rem;
  border: 1px solid ${props => {
    if (props.$status === 'success') return '#10b981';
    if (props.$status === 'error') return '#ef4444';
    return props.$isAnswered ? '#2563eb' : 'rgba(0, 0, 0, 0.06)';
  }};
  background: ${props => {
    if (props.$status === 'success') return '#f6fdfa';
    if (props.$status === 'error') return '#fff5f5';
    return 'white';
  }};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => {
      if (props.$status === 'success') return '#10b981';
      if (props.$status === 'error') return '#ef4444';
      return '#2563eb';
    }};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  }

  .ant-card-body {
    padding: 1rem 1.25rem;
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

export const HeaderTitle = styled.h4`
  color: white;
  margin: 0 !important;
  font-size: clamp(1.1rem, 3vw, 1.25rem);
  font-weight: 700;
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

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

export const SectionTitle = styled.span`
  font-weight: 700;
  color: #0f172a;
  font-size: 0.95rem;
`;

export const SectionSubtitle = styled.span`
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 600;
`;

export const ParagraphText = styled.p`
  margin: 0;
  font-size: 0.975rem;
  line-height: 1.7;
  color: #334155;
`;

export const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.5rem 0 0.25rem 0;
`;

export const QuestionLabel = styled.span`
  color: #334155;
  font-weight: 700;
  font-size: 0.95rem;
`;

export const CorrectAnswerText = styled.div`
  margin-top: 0.25rem;
  color: #10b981;
  font-weight: 600;
  font-size: 0.9rem;
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
  background: #10b981 !important;
  border-color: #10b981 !important;
  padding: 0 2rem !important;
  color: white !important;
  box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2) !important;
  
  &:hover {
    background: #059669 !important;
    border-color: #059669 !important;
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
