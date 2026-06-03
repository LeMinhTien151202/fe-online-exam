import styled from 'styled-components';

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #cbd5e1;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-0.25rem);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  }
`;

export const IconWrapper = styled.div<{ $bgColor: string; $color: string }>`
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  background: ${props => props.$bgColor};
  color: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

export const Label = styled.div`
  font-size: 0.8125rem;
  color: #6b7280;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

export const Value = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: #111827;
`;
