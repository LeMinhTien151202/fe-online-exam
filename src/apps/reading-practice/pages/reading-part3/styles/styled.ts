import styled from 'styled-components';
import { Card, Avatar, Radio, Button } from 'antd';
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
  grid-template-columns: 4fr 6fr;
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

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  padding-right: 0.5rem;
`;

export const PersonCard = styled(Card)`
  border-radius: 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.01);
  background: white;

  .ant-card-body {
    padding: 1.25rem;
  }
`;

export const PersonHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

export const PersonAvatar = styled(Avatar)<{ $color: string }>`
  background-color: ${props => props.$color};
  font-weight: bold;
  font-size: 1.125rem;
`;

export const StatementCard = styled(Card)<{ $isAnswered: boolean; $status?: 'success' | 'error' | 'default' }>`
  border-radius: 0.75rem;
  border: 1px solid ${props => {
    if (props.$status === 'success') return '#10b981';
    if (props.$status === 'error') return '#ef4444';
    return props.$isAnswered ? '#1a365d' : 'rgba(0, 0, 0, 0.06)';
  }};
  background: ${props => {
    if (props.$status === 'success') return '#f6fdfa';
    if (props.$status === 'error') return '#fff5f5';
    return 'white';
  }};
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.05);
    border-color: ${props => {
      if (props.$status === 'success') return '#10b981';
      if (props.$status === 'error') return '#ef4444';
      return '#1a365d';
    }};
  }

  .ant-card-body {
    padding: 1rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
`;

export const StyledRadioGroup = styled(Radio.Group)`
  display: flex;
  gap: 1.25rem;
  margin-top: 0.25rem;

  .ant-radio-button-wrapper {
    border-radius: 0.375rem !important;
    border: 1px solid #d1d5db !important;
    font-weight: bold;
    width: 3.5rem;
    text-align: center;
    transition: all 0.2s;

    &:first-child {
      border-left: 1px solid #d1d5db !important;
    }

    &:hover {
      color: #1a365d;
      border-color: #1a365d !important;
    }
  }

  .ant-radio-button-wrapper-checked {
    background-color: #eef2f7 !important;
    color: #1a365d !important;
    border-color: #1a365d !important;
    box-shadow: 0 0 0 1px #1a365d;
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

export const PersonName = styled.span`
  font-weight: 700;
  font-size: 1.05rem;
  color: #1e293b;
`;

export const PersonText = styled.p`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #475569;
`;

export const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
`;

export const QuestionRowLayout = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
`;

export const QuestionBody = styled.div`
  flex: 1;
`;

export const QuestionText = styled.span`
  font-weight: 700;
  font-size: 1rem;
  color: #1e293b;
  display: block;
  margin-bottom: 0.5rem;
`;

export const CorrectAnswerText = styled.div`
  margin-top: 0.5rem;
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
