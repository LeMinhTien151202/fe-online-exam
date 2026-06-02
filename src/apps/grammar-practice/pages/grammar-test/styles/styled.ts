import styled from 'styled-components';
import { Select } from 'antd';
import { Link } from '@tanstack/react-router';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
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
  background: #001a41;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
  flex-shrink: 0;
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
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 2rem;
  width: 100%;
  background: #ffffff;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }
`;

export const ContentCard = styled.div`
  background: white;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100%;
`;

export const TitleArea = styled.div`
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 1.25rem;
  margin-bottom: 1.5rem;
  width: 100%;

  h2 {
    font-size: 1.5rem;
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

export const GrammarQuestionCard = styled.div<{ $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 1.25rem 1.5rem;
  border-radius: 0.75rem;
  background: ${props => props.$isActive ? '#f8fafc' : 'transparent'};
  border: 1px solid ${props => props.$isActive ? 'rgba(22, 119, 255, 0.15)' : 'transparent'};
  margin-bottom: 1rem;
  transition: all 0.25s ease;
`;

export const QuestionNumberBadge = styled.div<{ $answered: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  font-weight: 800;
  font-size: 0.95rem;
  background: ${props => props.$answered ? '#e6f4ff' : '#f1f5f9'};
  color: ${props => props.$answered ? '#1677ff' : '#475569'};
  border: 1px solid ${props => props.$answered ? 'rgba(22, 119, 255, 0.2)' : 'transparent'};
  flex-shrink: 0;
`;

export const QuestionText = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.8;
  margin-bottom: 1rem;
  
  span.gap {
    display: inline-block;
    border-bottom: 2px dashed #94a3b8;
    min-width: 80px;
    text-align: center;
    font-weight: 700;
    color: #1677ff;
    padding: 0 0.25rem;
  }
`;

export const OptionsGrid = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: column;
  max-width: 550px;
  width: 100%;
`;

export const OptionLabel = styled.button<{ $selected: boolean }>`
  width: 100%;
  background: ${props => props.$selected ? '#e6f4ff' : 'white'};
  border: 1.5px solid ${props => props.$selected ? '#1677ff' : '#cbd5e1'};
  padding: 0.85rem 1.5rem;
  border-radius: 0.75rem;
  font-size: 1.05rem;
  font-weight: 600;
  color: ${props => props.$selected ? '#1677ff' : '#475569'};
  text-align: left;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &:hover {
    border-color: #1677ff;
    background: ${props => props.$selected ? '#e6f4ff' : '#f8fafc'};
  }

  .prefix {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 50%;
    background: ${props => props.$selected ? '#1677ff' : '#f1f5f9'};
    color: ${props => props.$selected ? 'white' : '#64748b'};
    font-size: 0.9rem;
    font-weight: 700;
    flex-shrink: 0;
  }
`;

export const VocabularySetCard = styled.div`
  background: white;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const SetTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 0.5rem;
`;

export const SetInstruction = styled.p`
  font-size: 0.95rem;
  color: #64748b;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

export const VocabGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const VocabRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 1.5rem;
  align-items: center;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

export const VocabLabel = styled.div`
  font-size: 1rem;
  color: #1e293b;
  font-weight: 600;
  line-height: 1.5;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const CustomDropdownWrapper = styled.div`
  width: 100%;
  .ant-select {
    width: 100% !important;
  }
  .ant-select-selector {
    border-radius: 0.5rem !important;
    padding: 0.35rem 0.75rem !important;
    height: auto !important;
    font-weight: 600;
  }
`;

// Navigation Panel Styles
export const NavPanel = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

export const PanelTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 1rem;
`;

export const GridScrollContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 1rem;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const SectionLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  &:first-child {
    margin-top: 0;
  }
`;

export const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
`;

export const NavGridButton = styled.button<{
  $status: 'unanswered' | 'answered';
  $active: boolean;
}>`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  position: relative;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  // Background and border logic
  background: ${props => {
    if (props.$status === 'answered') return '#e6f4ff';
    return '#f1f5f9';
  }};

  border: 1.5px solid ${props => {
    if (props.$active) return '#1677ff';
    if (props.$status === 'answered') return 'rgba(22, 119, 255, 0.3)';
    return 'transparent';
  }};

  color: ${props => {
    if (props.$active) return '#1677ff';
    if (props.$status === 'answered') return '#1677ff';
    return '#475569';
  }};

  &:hover {
    background: ${props => {
      if (props.$status === 'answered') return '#bae0ff';
      return '#e2e8f0';
    }};
    border-color: #1677ff;
  }
`;

export const Legend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-top: 1px solid #f1f5f9;
  padding-top: 1rem;
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .color-dot {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 0.25rem;
  }
`;

export const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 4.5rem;
  background: white;
  border-top: 1px solid #e4e4e7;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.03);
  z-index: 10;
  flex-shrink: 0;
`;
