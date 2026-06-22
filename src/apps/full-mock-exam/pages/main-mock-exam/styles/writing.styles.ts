import styled from "styled-components";
import { Card, Select, Avatar, Radio, Button } from "antd";

export const TitleArea = styled.div`
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 1.25rem;
  margin-bottom: 1.5rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;

  h2 {
    font-size: 1.5rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 6px 0;
  }

  .subtitle {
    font-size: 0.9rem;
    color: #64748b;
    font-weight: 600;
  }
`;

export const InstructionBox = styled.div<{ $borderColor?: string }>`
  background: #f0f9ff;
  border-left: 4px solid ${(props) => props.$borderColor || "#0284c7"};
  padding: 1.25rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  color: #0369a1;
  line-height: 1.5;
  font-weight: 500;
`;

export const ModernInput = styled.input<{
  $isValid?: boolean;
  $hasText?: boolean;
}>`
  width: 100%;
  border-radius: 8px;
  padding: 0.65rem 1rem;
  font-family: inherit;
  font-size: 0.95rem;
  background: #ffffff;
  color: #1e293b;
  border: 1.5px solid
    ${(props) =>
      !props.$hasText ? "#cbd5e1" : props.$isValid ? "#10b981" : "#ef4444"};
  outline: none;
  transition: all 0.2s ease-in-out;

  &:focus {
    border-color: ${(props) =>
      !props.$hasText ? "#9333ea" : props.$isValid ? "#10b981" : "#ef4444"};
    box-shadow: 0 0 0 3px
      ${(props) =>
        !props.$hasText
          ? "rgba(147, 51, 234, 0.15)"
          : props.$isValid
            ? "rgba(16, 185, 129, 0.15)"
            : "rgba(239, 68, 68, 0.15)"};
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

export const ModernTextArea = styled.textarea<{
  $isValid?: boolean;
  $hasText?: boolean;
}>`
  width: 100%;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-family: inherit;
  font-size: 0.95rem;
  line-height: 1.5;
  background: #ffffff;
  color: #1e293b;
  border: 1.5px solid
    ${(props) =>
      !props.$hasText ? "#cbd5e1" : props.$isValid ? "#10b981" : "#ef4444"};
  outline: none;
  resize: none;
  transition: all 0.2s ease-in-out;

  &:focus {
    border-color: ${(props) =>
      !props.$hasText ? "#9333ea" : props.$isValid ? "#10b981" : "#ef4444"};
    box-shadow: 0 0 0 3px
      ${(props) =>
        !props.$hasText
          ? "rgba(147, 51, 234, 0.15)"
          : props.$isValid
            ? "rgba(16, 185, 129, 0.15)"
            : "rgba(239, 68, 68, 0.15)"};
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

export const ModernWordBadge = styled.span<{
  $isValid?: boolean;
  $hasText?: boolean;
}>`
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  background: ${(props) =>
    !props.$hasText
      ? "#e2e8f0"
      : props.$isValid || props.$isValid === undefined
        ? "rgba(16, 185, 129, 0.1)"
        : "rgba(239, 68, 68, 0.1)"};
  color: ${(props) =>
    !props.$hasText
      ? "#64748b"
      : props.$isValid || props.$isValid === undefined
        ? "#10b981"
        : "#ef4444"};
  border: 1px solid
    ${(props) =>
      !props.$hasText
        ? "#cbd5e1"
        : props.$isValid || props.$isValid === undefined
          ? "rgba(16, 185, 129, 0.2)"
          : "rgba(239, 68, 68, 0.2)"};
  transition: all 0.2s ease;
`;

export const QuestionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`;

export const QuestionItem = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .q-text {
    font-size: 1.05rem;
    font-weight: 700;
    color: #1e293b;
  }
`;

export const ErrorText = styled.span`
  font-size: 0.7rem;
  color: #ef4444;
  font-weight: 600;
`;

export const Part3Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const QuestionCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: #f8fafc;
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
`;

export const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

export const AvatarBadge = styled.div<{ $bgColor?: string }>`
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: ${(props) => props.$bgColor || "#3b82f6"};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.75rem;
`;

export const ChatMessageText = styled.div`
  background: #ffffff;
  padding: 0.65rem 0.85rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  color: #334155;
  line-height: 1.4;
  border: 1px solid #f1f5f9;
  font-weight: 500;
`;

export const EmailWorkspaceGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const EmailCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  background: #f8fafc;
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
`;

export const EmailHeaderLabel = styled.div<{ $color?: string }>`
  font-weight: 800;
  color: ${(props) => props.$color || "#4f46e5"};
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
`;

export const EmailPromptText = styled.div`
  font-size: 0.95rem;
  color: #334155;
  font-weight: 600;
  line-height: 1.45;
`;

export const SituationBox = styled.div`
  background: #fdf2f2;
  border-left: 4px solid #ef4444;
  padding: 1.25rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  color: #991b1b;
  line-height: 1.5;
`;
