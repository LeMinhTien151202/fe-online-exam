import { Link } from "@tanstack/react-router";
import styled from "styled-components";

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
  font-size: 1.05rem;
  font-weight: 500;
  color: #64748b;
  margin: 0.25rem 0 2rem 0;
  line-height: 1.6;
`;

export const QuestionBlock = styled.div`
  margin-bottom: 2.5rem;
`;

export const QuestionTitle = styled.div`
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 1.25rem;
  line-height: 1.5;
`;

export const OptionCard = styled.div<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  border: 1px solid ${props => props.$selected ? '#0ea5e9' : '#e2e8f0'};
  border-radius: 8px;
  margin-bottom: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.$selected ? '#f0f9ff' : '#ffffff'};

  &:hover {
    border-color: ${props => props.$selected ? '#0ea5e9' : '#cbd5e1'};
    background: ${props => props.$selected ? '#f0f9ff' : '#f8fafc'};
  }

  .option-letter {
    font-weight: 700;
    color: ${props => props.$selected ? '#0284c7' : '#0f172a'};
    margin-right: 24px;
    font-size: 1rem;
  }

  .option-text {
    color: ${props => props.$selected ? '#0369a1' : '#334155'};
    font-size: 1rem;
    flex: 1;
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
