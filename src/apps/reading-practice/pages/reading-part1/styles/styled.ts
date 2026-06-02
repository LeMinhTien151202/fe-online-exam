import styled from "styled-components";
import { Card, Select } from "antd";
import { Link } from "@tanstack/react-router";

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background: #ffffff;
  overflow: hidden;
  font-family:
    "Outfit",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    sans-serif;
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
  flex: 1;
  overflow-y: auto;
  padding: 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  background: #ffffff;
`;

export const ContentCard = styled.div`
  background: white;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
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

export const InstructionText = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0.25rem 0 0.75rem 0;
  line-height: 1.5;
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

export const EmailContentArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  font-size: 1.05rem;
  line-height: 2.3;
  color: #334155;
  font-weight: 500;
  border-top: 1px solid #e2e8f0;
  padding-top: 1.5rem;
`;

export const InlineSentenceSelect = styled(Select)<{ $hasValue?: boolean; $status?: 'success' | 'error' | 'default' }>`
  width: 160px !important;
  margin: 0 0.4rem;
  display: inline-block;
  vertical-align: middle;
  position: relative !important;

  .ant-select-selector {
    border-radius: 6px !important;
    height: 36px !important;
    display: flex !important;
    align-items: center !important;
    flex-direction: row !important;
    padding-left: 12px !important;
    padding-right: 28px !important;
    transition: all 0.2s !important;
    
    border-color: ${props => {
      if (props.$status === 'success') return '#10b981';
      if (props.$status === 'error') return '#ef4444';
      return props.$hasValue ? '#2563eb' : '#cbd5e1';
    }} !important;
    
    background: ${props => {
      if (props.$status === 'success') return '#ecfdf5';
      if (props.$status === 'error') return '#fef2f2';
      return props.$hasValue ? '#eff6ff' : '#ffffff';
    }} !important;
    
    &:hover {
      border-color: ${props => {
        if (props.$status === 'success') return '#059669';
        if (props.$status === 'error') return '#dc2626';
        return props.$hasValue ? '#1d4ed8' : '#6366f1';
      }} !important;
    }
  }

  .ant-select-selection-placeholder {
    color: #64748b !important;
    font-weight: 600 !important;
  }

  .ant-select-selection-item {
    color: ${props => {
      if (props.$status === 'success') return '#047857';
      if (props.$status === 'error') return '#b91c1c';
      return props.$hasValue ? '#1e40af' : '#334155';
    }} !important;
    font-weight: 700 !important;
  }

  /* Target both standard and custom suffix icons across all Ant versions */
  .ant-select-arrow,
  .ant-select-suffix {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    position: absolute !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    right: 10px !important;
    margin: 0 !important;
    color: ${props => {
      if (props.$status === 'success') return '#059669';
      if (props.$status === 'error') return '#dc2626';
      return props.$hasValue ? '#2563eb' : '#94a3b8';
    }} !important;
    transition: color 0.2s !important;
    pointer-events: none !important;
  }
`;

export const QuestionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 0.875rem 0;
  border-bottom: 1px solid #f1f5f9;
  width: 100%;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-of-type {
    padding-top: 0.5rem;
  }
`;

export const QuestionText = styled.div`
  font-size: 1.1rem;
  color: #1e293b;
  font-weight: 600;
  flex: 1;
  line-height: 1.8;
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

export const QuestionCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.25rem 1.75rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease-in-out;
  width: 100%;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.04);
  }
`;

export const BadgeNumber = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #eff6ff;
  border: 1px solid #dbeafe;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1e40af;
  font-weight: 700;
  font-size: 0.95rem;
  flex-shrink: 0;
`;
