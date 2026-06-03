import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const FilterBar = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

export const MaterialCardContent = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  min-height: 90px;
`;

export const MaterialCardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;
