import styled from 'styled-components';
import { ArrowRightOutlined } from '@ant-design/icons';

export const CardWrapper = styled.div<{ $borderColor: string }>`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  height: 100%;

  &:hover {
    transform: translateY(-0.25rem);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    border-color: ${props => props.$borderColor};
  }
`;

export const HeaderArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const IconBox = styled.div<{ $bgColor: string; $color: string }>`
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.5rem;
  background: ${props => props.$bgColor};
  color: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  .anticon {
    font-size: 1.25rem;
  }
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h3`
  font-size: 1.125rem; /* 18px */
  font-weight: 800;
  color: #111827;
  margin: 0 0 0.25rem 0;
`;

export const SubTitle = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
`;

export const Tag = styled.span<{ $type: 'easy' | 'medium' | 'hard' }>`
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  ${props => props.$type === 'easy' && `
    background: #dcfce7;
    color: #16a34a;
  `}
  ${props => props.$type === 'medium' && `
    background: #fef3c7;
    color: #d97706;
  `}
  ${props => props.$type === 'hard' && `
    background: #ffedd5;
    color: #ea580c;
  `}
`;

export const ContentArea = styled.div`
  flex: 1;
  margin-bottom: 1.5rem;
`;

export const Description = styled.p`
  font-size: 0.875rem; /* 14px */
  color: #4b5563;
  margin: 0;
  line-height: 1.6;
`;

export const ProgressContainer = styled.div`
  margin-bottom: 1.25rem;
`;

export const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;

  span:first-child {
    font-size: 0.75rem;
    font-weight: 700;
    color: #111827;
  }
  
  span:last-child {
    font-size: 0.75rem;
    font-weight: 700;
    color: #4b5563;
  }
`;

export const ProgressBarBg = styled.div`
  width: 100%;
  height: 0.375rem;
  background: #f3f4f6;
  border-radius: 1rem;
  overflow: hidden;
`;

export const ProgressBarFill = styled.div<{ $percent: number; $color: string }>`
  height: 100%;
  width: ${props => props.$percent}%;
  background: ${props => props.$color};
  border-radius: 1rem;
  transition: width 0.5s ease;
`;

export const ActionArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  
  span {
    font-size: 0.875rem;
    font-weight: 700;
    color: #00205B;
    transition: color 0.3s;
  }
  
  &:hover span, &:hover .anticon {
    color: #2D447F;
  }
`;

export const StyledArrowIcon = styled(ArrowRightOutlined)`
  color: #00205B;
  font-size: 1rem;
  transition: all 0.3s;
  
  ${ActionArea}:hover & {
    transform: translateX(0.25rem);
  }
`;
