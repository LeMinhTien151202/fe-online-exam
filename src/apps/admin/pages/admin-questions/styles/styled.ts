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

export const TextEllipsis = styled.div`
  max-width: 350px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const FlexAlign = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
