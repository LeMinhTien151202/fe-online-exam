import styled from "styled-components";
import { Link } from "@tanstack/react-router";

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background: #ffffff;
  overflow: hidden;
  font-family: "Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
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

export const MainContent = styled.main`
  flex: 1;
  overflow: hidden;
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  background: #ffffff;
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 450px;
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  overflow: hidden;

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
  overflow-y: auto;
  padding-right: 0.5rem;
`;

export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding-right: 0.5rem;
`;

export const ContentCard = styled.div`
  background: white;
  width: 100%;
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

export const QuestionBox = styled.div<{ $borderColor?: string }>`
  background: #f8fafc;
  border-left: 5px solid ${props => props.$borderColor || '#3b82f6'};
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);

  .q-badge {
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
    color: ${props => props.$borderColor || '#3b82f6'};
    margin-bottom: 0.25rem;
    letter-spacing: 0.05em;
  }

  .q-text {
    font-size: 1.15rem;
    font-weight: 700;
    color: #1e293b;
    line-height: 1.35;
  }
`;

// Collapsible Panels (Sample Answer / Tips)
export const CollapsibleWrapper = styled.div`
  margin-top: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  overflow: hidden;
  background: white;
  width: 100%;
  max-width: 480px;
`;

export const CollapsibleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  font-weight: 700;
  color: #334155;
  cursor: pointer;
  background: #f8fafc;
  transition: background 0.2s;

  &:hover {
    background: #f1f5f9;
  }
`;

export const CollapsibleBody = styled.div`
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  font-size: 0.9rem;
  color: #475569;
  line-height: 1.5;
  background: white;
  white-space: pre-line;
  max-height: 180px;
  overflow-y: auto;
`;

export const AdminExperienceCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 0.75rem;
  padding: 1.25rem;
  margin-top: 0.5rem;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;

  .info-left {
    display: flex;
    align-items: center;
    gap: 1rem;

    .icon-bulb {
      font-size: 1.5rem;
      color: #d97706;
      background: #fef3c7;
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .text-content {
      display: flex;
      flex-direction: column;
      
      .title {
        font-size: 1rem;
        font-weight: 700;
        color: #78350f;
      }
      .subtitle {
        font-size: 0.85rem;
        color: #b45309;
        margin-top: 2px;
      }
    }
  }

  .btn-show {
    background: #d97706;
    color: white;
    border: none;
    padding: 0.5rem 1.25rem;
    border-radius: 1.5rem;
    font-weight: 700;
    font-size: 0.85rem;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: #b45309;
    }
  }
`;

export const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 5rem;
  background: white;
  border-top: 1px solid #e2e8f0;
  z-index: 10;
`;

// Part 2 & 3 custom components
export const SubTabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 4px;
`;

export const SubTab = styled.button<{ $active: boolean; $color: string }>`
  background: ${props => props.$active ? props.$color : 'transparent'};
  color: ${props => props.$active ? 'white' : '#64748b'};
  border: none;
  padding: 0.5rem 1.25rem;
  font-weight: 700;
  font-size: 0.875rem;
  border-radius: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$active ? props.$color : '#f1f5f9'};
    color: ${props => props.$active ? 'white' : '#334155'};
  }
`;

export const ImageWrapper = styled.div<{ $height?: string }>`
  width: 100%;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  background: #ffffff;
  max-height: ${props => props.$height || '380px'};

  img {
    max-width: 100%;
    height: ${props => props.$height || '380px'};
    object-fit: contain;
    display: block;
  }
`;

export const DoubleImageGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: 100%;
  margin-bottom: 1.5rem;

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

export const DoubleImageWrapper = styled.div<{ $height?: string }>`
  width: 100%;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  position: relative;
  display: flex;
  justify-content: center;
  background: #ffffff;
  max-height: ${props => props.$height || '280px'};

  img {
    max-width: 100%;
    height: ${props => props.$height || '280px'};
    object-fit: contain;
    display: block;
  }

  .label {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    background: rgba(0,0,0,0.65);
    color: white;
    padding: 0.2rem 0.6rem;
    font-size: 0.7rem;
    font-weight: 700;
    border-radius: 1rem;
    backdrop-filter: blur(4px);
  }
`;

// Part 4 custom components
export const QListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const QListItem = styled.div<{ $borderColor?: string }>`
  background: #f8fafc;
  border-left: 4px solid ${props => props.$borderColor || '#8b5cf6'};
  padding: 1.25rem;
  border-radius: 0.5rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;

  .q-num {
    background: ${props => props.$borderColor || '#8b5cf6'}15;
    color: ${props => props.$borderColor || '#8b5cf6'};
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 0.875rem;
    flex-shrink: 0;
  }

  .q-content {
    font-size: 1.1rem;
    font-weight: 700;
    color: #334155;
    line-height: 1.4;
    margin-top: 2px;
  }
`;
