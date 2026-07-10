import { Link } from '@tanstack/react-router';
import styled from 'styled-components';

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

export const HeaderTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 800;
  color: white;
  margin: 0;
  
  @media (max-width: 768px) {
    display: none;
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

export const ContentBody = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
  
  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

export const WorkspaceGrid = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  background: #ffffff;
  
  @media (max-width: 640px) {
    padding: 1rem;
  }
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 450px;
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }
`;

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
  padding-right: 0.5rem;
`;

export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  height: 100%;
  padding-right: 0.5rem;
`;

export const SubTabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.5rem;
  margin-top: 1rem;
`;

export const SubTab = styled.button<{ $active: boolean; $color?: string }>`
  border: 1px solid ${props => props.$active ? (props.$color || '#3b5b8c') : '#e2e8f0'};
  background: ${props => props.$active ? `${props.$color || '#3b5b8c'}10` : 'white'};
  color: ${props => props.$active ? (props.$color || '#3b5b8c') : '#64748b'};
  padding: 0.5rem 1.25rem;
  border-radius: 0.375rem;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  outline: none;
  transition: all 0.2s;

  &:hover {
    border-color: ${props => props.$color || '#3b5b8c'};
    color: ${props => props.$color || '#3b5b8c'};
  }
`;

export const QuestionsColumn = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ContentCard = styled.div`
  background: white;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
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

export const ImageWrapper = styled.div<{ $height?: string }>`
  width: 100%;
  height: ${props => props.$height || '260px'};
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  margin-bottom: 1.25rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const PhotosGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: 100%;
  margin-bottom: 1.25rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const QuestionBox = styled.div<{ $borderColor: string }>`
  border-left: 4px solid ${props => props.$borderColor};
  background: #f8fafc;
  padding: 1.25rem;
  border-radius: 0 0.5rem 0.5rem 0;
  margin-bottom: 1.5rem;

  .q-badge {
    font-size: 0.75rem;
    font-weight: 700;
    color: ${props => props.$borderColor};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
  }

  .q-text {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1e293b;
    line-height: 1.5;
  }
`;

export const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 2rem;
  width: 100%;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const SectionColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const CollapsibleWrapper = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: white;
  margin-top: 1rem;
  overflow: hidden;
  width: 100%;
`;

export const CollapsibleHeader = styled.div`
  padding: 1rem 1.25rem;
  background: #f8fafc;
  font-weight: 700;
  color: #334155;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  font-size: 0.95rem;

  &:hover {
    background: #f1f5f9;
  }
`;

export const CollapsibleBody = styled.div`
  padding: 1.25rem;
  border-top: 1px solid #e2e8f0;
  color: #475569;
  font-size: 0.975rem;
  line-height: 1.6;
`;

export const AudioResponsePlaceholder = styled.div<{ $recorded?: boolean }>`
  border: 1px solid ${props => props.$recorded ? '#10b981' : '#cbd5e1'};
  background: ${props => props.$recorded ? '#f0fdf4' : '#f8fafc'};
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.$recorded ? '#15803d' : '#64748b'};
`;

// Nav Panel
export const NavPanel = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  height: fit-content;
  max-height: calc(100vh - 12rem);
  overflow-y: auto;
  
  @media (max-width: 1024px) {
    max-height: none;
  }
`;

export const PanelTitle = styled.h4`
  font-size: 1.05rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 1rem;
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
  grid-template-columns: repeat(4, 1fr);
  gap: 0.375rem;
  margin-bottom: 0.5rem;
`;

export const NavGridButton = styled.button<{
  $status: 'unanswered' | 'answered';
  $active: boolean;
  $isCorrect?: 'success' | 'error' | 'default';
}>`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  border: 1.5px solid transparent;
  transition: all 0.2s;
  outline: none;
  
  background: ${props => {
    if (props.$status === 'answered') return '#eff6ff';
    return '#f1f5f9';
  }};
  
  border-color: ${props => {
    if (props.$active) return '#1a365d';
    if (props.$status === 'answered') return '#bfdbfe';
    return 'transparent';
  }};
  
  color: ${props => {
    if (props.$active) return '#1a365d';
    if (props.$status === 'answered') return '#2f4a6b';
    return '#64748b';
  }};

  &:hover {
    border-color: #1a365d;
    background: ${props => props.$status === 'answered' ? '#dbeafe' : '#e2e8f0'};
  }
`;

export const Legend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-top: 1px solid #f1f5f9;
  padding-top: 1rem;
  margin-top: 1rem;
  font-size: 0.8rem;
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

// Footer
export const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 4.5rem;
  background: white;
  border-top: 1px solid #e2e8f0;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.02);
  z-index: 5;
`;

// Report
export const ReportContainer = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  width: 100%;
  overflow-y: auto;
  max-height: calc(100vh - 10rem);
`;

export const ReportCard = styled.div`
  background: white;
  border-radius: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const ScoreRingWrapper = styled.div`
  margin-bottom: 2rem;
  position: relative;
`;

export const ScoreLabel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .score-val {
    font-size: 2.25rem;
    font-weight: 900;
    color: #1a365d;
    line-height: 1.1;
  }
  
  .score-max {
    font-size: 1rem;
    color: #64748b;
    font-weight: 600;
    margin-top: 2px;
  }
`;

export const ReportGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  width: 100%;
  margin-bottom: 2.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ReportStatItem = styled.div`
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 0.75rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .stat-label {
    font-size: 0.8rem;
    text-transform: uppercase;
    color: #64748b;
    font-weight: 700;
    letter-spacing: 0.05em;
    margin-bottom: 6px;
  }
  
  .stat-value {
    font-size: 1.25rem;
    font-weight: 800;
    color: #1e293b;
  }
`;
