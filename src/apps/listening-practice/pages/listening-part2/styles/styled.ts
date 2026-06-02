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
  font-family: "Outfit", sans-serif;
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
    display: flex;
    align-items: center;
    gap: 1rem;
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
  font-weight: 500;
  color: #64748b;
  margin: 0.25rem 0 1.5rem 0;
  line-height: 1.5;
`;

export const PersonRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.5rem 0;

  .person-label {
    font-weight: 700;
    color: #0f172a;
    width: 100px;
    font-size: 1.05rem;
  }

  .person-select {
    flex: 1;
    max-width: 600px;
  }
`;

export const StyledSelect = styled(Select)<{ $hasValue?: boolean }>`
  width: 100% !important;

  .ant-select-selector {
    border-radius: 8px !important;
    height: 48px !important;
    display: flex !important;
    align-items: center !important;
    padding-left: 16px !important;
    
    border-color: ${props => props.$hasValue ? '#10b981' : '#e2e8f0'} !important;
    background: ${props => props.$hasValue ? '#ecfdf5' : '#ffffff'} !important;
    
    &:hover {
      border-color: ${props => props.$hasValue ? '#059669' : '#94a3b8'} !important;
    }
  }

  .ant-select-selection-placeholder {
    color: #94a3b8 !important;
    font-weight: 500 !important;
  }

  .ant-select-selection-item {
    color: ${props => props.$hasValue ? '#047857' : '#334155'} !important;
    font-weight: 600 !important;
  }
`;

export const TranscriptButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1.5rem;
`;

export const TranscriptBox = styled.div`
  margin-top: 1rem;
  padding: 1.5rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #334155;
  font-size: 1rem;
  line-height: 1.6;
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
