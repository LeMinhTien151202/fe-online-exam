import styled from 'styled-components';
import { Card } from 'antd';
import { Link } from '@tanstack/react-router';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background: #f4f4f5;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem;
  height: 4.5rem;
  background: #001a41;
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
  padding: 1.5rem;
  flex: 1;
  overflow: hidden;

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

export const QuestionSlot = styled(Card)<{ $isAnswered: boolean }>`
  border-radius: 0.75rem;
  border: 1px solid ${props => props.$isAnswered ? '#10b981' : 'rgba(0, 0, 0, 0.06)'};
  background: white;
  transition: all 0.2s ease;

  &:hover {
    border-color: #10b981;
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
