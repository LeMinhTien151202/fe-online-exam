import styled from "styled-components";

export const SubTabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.5rem;
  margin-top: 1rem;
`;

export const SubTab = styled.button<{ $active: boolean; $color?: string }>`
  border: 1px solid
    ${(props) => (props.$active ? props.$color || "#2563eb" : "#e2e8f0")};
  background: ${(props) =>
    props.$active ? `${props.$color || "#2563eb"}10` : "white"};
  color: ${(props) => (props.$active ? props.$color || "#2563eb" : "#64748b")};
  padding: 0.5rem 1.25rem;
  border-radius: 0.375rem;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  outline: none;
  transition: all 0.2s;

  &:hover {
    border-color: ${(props) => props.$color || "#2563eb"};
    color: ${(props) => props.$color || "#2563eb"};
  }
`;

export const ImageWrapper = styled.div<{ $height?: string }>`
  width: 100%;
  height: ${(props) => props.$height || "260px"};
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
  border-left: 4px solid ${(props) => props.$borderColor};
  background: #f8fafc;
  padding: 1.25rem;
  border-radius: 0 0.5rem 0.5rem 0;
  margin-bottom: 1.5rem;

  .q-badge {
    font-size: 0.75rem;
    font-weight: 700;
    color: ${(props) => props.$borderColor};
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
