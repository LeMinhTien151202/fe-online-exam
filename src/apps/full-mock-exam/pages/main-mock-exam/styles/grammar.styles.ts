import styled from "styled-components";

export const TitleArea = styled.div`
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 1.25rem;
  margin-bottom: 1.5rem;
  width: 100%;

  h2 {
    font-size: 1.5rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 6px 0;
  }

  .subtitle {
    font-size: 0.95rem;
    color: #64748b;
    font-weight: 600;
    margin-bottom: 8px;
  }
`;

export const GrammarSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  padding: 1rem 0;
`;

export const GrammarQuestionText = styled.div`
  font-size: clamp(1.15rem, 4vw, 1.35rem);
  line-height: 2;
  margin-bottom: 2.5rem;
  font-weight: 600;
  color: #1e293b;
  display: block;

  span.gap {
    display: inline-block;
    border-bottom: 2px dashed #94a3b8;
    min-width: 80px;
    text-align: center;
    font-weight: 700;
    color: #1677ff;
    padding: 0 0.25rem;
  }
`;

export const QuestionNumberBadge = styled.div<{ $answered: boolean }>`
  display: inline-flex;
  vertical-align: middle;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  font-weight: 800;
  font-size: 1rem;
  background: ${(props) => (props.$answered ? "#e6f4ff" : "#f1f5f9")};
  color: ${(props) => (props.$answered ? "#1677ff" : "#475569")};
  border: 1px solid
    ${(props) => (props.$answered ? "rgba(22, 119, 255, 0.2)" : "transparent")};
  margin-right: 0.75rem;
  flex-shrink: 0;
`;

export const OptionsGrid = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: column;
  max-width: 550px;
  width: 100%;
`;

export const OptionLabel = styled.button<{ $selected: boolean }>`
  width: 100%;
  background: ${(props) => (props.$selected ? "#e6f4ff" : "white")};
  border: 1.5px solid ${(props) => (props.$selected ? "#1677ff" : "#cbd5e1")};
  padding: 0.85rem 1.5rem;
  border-radius: 0.75rem;
  font-size: 1.05rem;
  font-weight: 600;
  color: ${(props) => (props.$selected ? "#1677ff" : "#475569")};
  text-align: left;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &:hover {
    border-color: #1677ff;
    background: ${(props) => (props.$selected ? "#e6f4ff" : "#f8fafc")};
  }

  .prefix {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 50%;
    background: ${(props) => (props.$selected ? "#1677ff" : "#f1f5f9")};
    color: ${(props) => (props.$selected ? "white" : "#64748b")};
    font-size: 0.9rem;
    font-weight: 700;
    flex-shrink: 0;
  }
`;

export const VocabularySectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
`;

export const VocabGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const VocabQuestionCard = styled.div<{ $isActive: boolean }>`
  padding: 1rem 1.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  background: #ffffff;
  margin-bottom: 0.75rem;
  display: flex;
  flex-direction: column;
`;

export const VocabRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 1.5rem;
  align-items: center;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

export const VocabLabel = styled.div`
  font-size: 1rem;
  color: #1e293b;
  font-weight: 600;
  line-height: 1.5;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const VocabQuestionNumberBadge = styled(QuestionNumberBadge)`
  width: 1.75rem !important;
  height: 1.75rem !important;
  font-size: 0.85rem !important;
  margin-right: 0.5rem !important;
`;

export const ContextDropdownInlineWrapper = styled.div`
  display: inline-block;
  width: 180px;
  margin: 0 0.5rem;
  vertical-align: middle;
`;

export const UsedOptionText = styled.span`
  font-size: 11px;
  color: #bfbfbf;
  font-style: italic;
`;
