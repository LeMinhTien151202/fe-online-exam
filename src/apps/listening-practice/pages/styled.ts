import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  margin: 0;
`;

export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

export const HeaderContent = styled.div`
  max-width: 40rem;
`;

export const CategoryTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #2D447F;
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
  
  .anticon {
    font-size: 1rem;
  }
`;

export const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: #00205B;
  margin-bottom: 0.75rem;
`;

export const SubTitle = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.6;
`;

export const StatsContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

export const StatPill = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: white;
  padding: 0.75rem 1.25rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.04);

  .icon {
    font-size: 1.25rem;
  }

  .info {
    display: flex;
    flex-direction: column;
    
    span:first-child {
      font-size: 0.6875rem;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
    }
    
    span:last-child {
      font-size: 1rem;
      font-weight: 800;
      color: #111827;
    }
  }
`;

export const PartsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;
