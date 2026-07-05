import styled from "styled-components";

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.a`
  background: white;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.05),
    0 1px 2px rgba(0, 0, 0, 0.02);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  overflow: hidden;
  text-decoration: none;

  &:hover {
    transform: translateY(-0.25rem);
    box-shadow:
      0 20px 25px -5px rgba(0, 0, 0, 0.05),
      0 10px 10px -5px rgba(0, 0, 0, 0.03);
  }
`;

export const DecorCircle = styled.div<{ $color: string }>`
  position: absolute;
  top: 0;
  right: 0;
  width: 3rem;
  height: 3rem;
  background: ${(props) => props.$color};
  opacity: 0.08;
  border-bottom-left-radius: 100%;
`;

export const IconBox = styled.div<{ $bgColor: string; $color: string }>`
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background: ${(props) => props.$bgColor};
  color: ${(props) => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;

  span.material-symbols-outlined {
    font-size: 1.125rem;
    font-variation-settings:
      "FILL" 0,
      "wght" 500,
      "GRAD" 0,
      "opsz" 48;
  }
`;

export const Title = styled.h3`
  font-size: 1.125rem; /* 18px */
  font-weight: 800;
  color: #111827;
  margin-bottom: 0.375rem;
`;

export const Description = styled.p`
  font-size: 0.875rem; /* 14px */
  line-height: 1.5;
  color: #4b5563;
  margin-bottom: 0.75rem;
  flex: 1;
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
`;

export const Tag = styled.span<{ $bgColor: string; $color: string }>`
  font-size: 0.6875rem;
  font-weight: 700;
  background: ${(props) => props.$bgColor};
  color: ${(props) => props.$color};
  padding: 0.25rem 0.625rem;
  border-radius: 6.25rem;
`;

export const ActionLink = styled.div`
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #111827;
  opacity: 0.6;
  transition: all 0.3s;

  ${Card}:hover & {
    opacity: 1;
    gap: 0.75rem;
  }
`;

export const ActionCircle = styled.div`
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  color: #111827;
  font-size: 0.75rem;
`;
