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
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #cbd5e1;

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

export const TabSectionWrapper = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: flex-start;
  
  .ant-segmented {
    padding: 4px;
    background: #f1f5f9;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    
    .ant-segmented-item {
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.95rem;
      padding: 6px 20px;
      transition: all 0.2s;
      color: #475569;
      
      &:hover {
        color: #0f172a;
      }
    }
    
    .ant-segmented-item-selected {
      background: #00205B !important;
      color: white !important;
      box-shadow: 0 4px 6px -1px rgba(0, 32, 91, 0.2) !important;
    }
  }
`;

export const MockTestGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const MockTestCard = styled.div`
  background: white;
  border-radius: 1rem;
  border: 1px solid #cbd5e1;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(0, 32, 91, 0.06);
    border-color: #cbd5e1;
  }
`;

export const MockTestTitle = styled.h3`
  font-size: 1.15rem;
  font-weight: 800;
  color: #00205B;
  margin-bottom: 0.75rem;
  padding-right: 4.5rem; /* Avoid overlapping badge */
`;

export const MockTestMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex: 1;
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
`;

export const MockTestBadge = styled.span<{ $type: 'easy' | 'medium' | 'hard' }>`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  padding: 0.25rem 0.625rem;
  border-radius: 2rem;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  background: ${props => {
    if (props.$type === 'easy') return '#ecfdf5';
    if (props.$type === 'medium') return '#fffbeb';
    return '#fef2f2';
  }};
  
  color: ${props => {
    if (props.$type === 'easy') return '#047857';
    if (props.$type === 'medium') return '#b45309';
    return '#b91c1c';
  }};
`;

export const TestSetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const TestSetCard = styled.div`
  background: white;
  border-radius: 1rem;
  border: 1px solid #cbd5e1;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(0, 32, 91, 0.06);
    border-color: #94a3b8;
  }
`;

export const TestSetTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  color: #00205B;
  margin-bottom: 1rem;
`;

export const TestSetPartsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex: 1;
`;

export const TestSetPartRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  
  .part-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    
    .part-title {
      font-size: 0.85rem;
      font-weight: 700;
      color: #1e293b;
    }
    
    .part-desc {
      font-size: 0.75rem;
      color: #64748b;
    }
  }
  
  .part-action {
    font-size: 0.75rem;
    font-weight: 700;
    color: #2D447F;
    cursor: pointer;
    text-decoration: none;
    
    &:hover {
      color: #1e3a8a;
      text-decoration: underline;
    }
  }
`;
