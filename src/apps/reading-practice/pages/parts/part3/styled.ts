import styled from 'styled-components';
import { Card, Avatar, Radio } from 'antd';
import { Link } from '@tanstack/react-router';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
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

export const StatementCard = styled(Card)<{ $isAnswered: boolean }>`
  border-radius: 0.75rem;
  border: 1px solid ${props => props.$isAnswered ? '#2563eb' : 'rgba(0, 0, 0, 0.06)'};
  background: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.05);
    border-color: #2563eb;
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
      color: #2563eb;
      border-color: #2563eb !important;
    }
  }

  .ant-radio-button-wrapper-checked {
    background-color: #eff6ff !important;
    color: #2563eb !important;
    border-color: #2563eb !important;
    box-shadow: 0 0 0 1px #2563eb;
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
