import styled from 'styled-components';

export const PartWrapper = styled.div`
  padding: 1.25rem;
  border-radius: 0.5rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;

  & + & {
    margin-top: 1rem;
  }
`;

export const PartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const Block = styled.div`
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const FieldLabel = styled.div`
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

export const AudioPlayer = styled.audio`
  width: 100%;
  margin-top: 0.75rem;
`;
