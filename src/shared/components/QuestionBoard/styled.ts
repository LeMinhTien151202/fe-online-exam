import styled from 'styled-components';

// Bảng câu hỏi dùng chung cho "luyện theo phần" (giống panel ở luyện theo bộ đề).
// Là 1 cột bên phải, dính (sticky) và tự cuộn khi nhiều câu.
export const NavPanel = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.25rem 1.5rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  width: 100%;
  align-self: start;
  position: sticky;
  top: 1rem;
  max-height: calc(100vh - 8rem);
  overflow-y: auto;

  @media (max-width: 1200px) {
    position: static;
    max-height: none;
  }
`;

export const PanelTitle = styled.h4`
  font-size: 1.05rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 0.75rem;
`;

export const SectionLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
`;

export const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.375rem;
  margin-bottom: 0.75rem;
`;

export const NavGridButton = styled.button<{
  $status: 'unanswered' | 'partial' | 'answered';
  $active: boolean;
}>`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  border: 1.5px solid transparent;
  transition: all 0.2s;
  outline: none;

  background: ${(props) => {
    if (props.$status === 'answered') return '#eff6ff';
    if (props.$status === 'partial') return '#fff7ed';
    return '#f1f5f9';
  }};

  border-color: ${(props) => {
    if (props.$active) return '#1a365d';
    if (props.$status === 'answered') return '#bfdbfe';
    if (props.$status === 'partial') return '#fed7aa';
    return 'transparent';
  }};

  color: ${(props) => {
    if (props.$active) return '#1a365d';
    if (props.$status === 'answered') return '#2f4a6b';
    if (props.$status === 'partial') return '#c2410c';
    return '#64748b';
  }};

  &:hover {
    border-color: #1a365d;
  }
`;

export const Legend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-top: 1px solid #f1f5f9;
  padding-top: 0.875rem;
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const LegendDot = styled.span<{ $variant: 'unanswered' | 'partial' | 'answered' | 'active' }>`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 0.25rem;

  background: ${(props) => {
    if (props.$variant === 'answered') return '#eff6ff';
    if (props.$variant === 'partial') return '#fff7ed';
    if (props.$variant === 'active') return '#ffffff';
    return '#f1f5f9';
  }};
  border: ${(props) => {
    if (props.$variant === 'answered') return '1px solid #bfdbfe';
    if (props.$variant === 'partial') return '1px solid #fed7aa';
    if (props.$variant === 'active') return '1.5px solid #1a365d';
    return '1px solid #cbd5e1';
  }};
`;
