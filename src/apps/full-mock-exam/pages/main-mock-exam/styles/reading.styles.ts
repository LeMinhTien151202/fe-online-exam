import styled from "styled-components";
import { Select, Card, Avatar, Radio } from "antd";

export const InlineSentenceSelect = styled(Select)<{
  $hasValue?: boolean;
  $status?: "success" | "error" | "default";
}>`
  width: 160px !important;
  margin: 0 0.4rem;
  display: inline-block;
  vertical-align: middle;
  position: relative !important;

  .ant-select-selector {
    border-radius: 6px !important;
    height: 36px !important;
    display: flex !important;
    align-items: center !important;
    flex-direction: row !important;
    padding-left: 12px !important;
    padding-right: 28px !important;
    transition: all 0.2s !important;

    border-color: ${(props) => {
      if (props.$status === "success") return "#10b981";
      if (props.$status === "error") return "#ef4444";
      return props.$hasValue ? "#2563eb" : "#cbd5e1";
    }} !important;

    background: ${(props) => {
      if (props.$status === "success") return "#ecfdf5";
      if (props.$status === "error") return "#fef2f2";
      return props.$hasValue ? "#eff6ff" : "#ffffff";
    }} !important;

    &:hover {
      border-color: ${(props) => {
        if (props.$status === "success") return "#059669";
        if (props.$status === "error") return "#dc2626";
        return props.$hasValue ? "#1d4ed8" : "#6366f1";
      }} !important;
    }
  }

  .ant-select-selection-placeholder {
    color: #64748b !important;
    font-weight: 600 !important;
  }

  .ant-select-selection-item {
    color: ${(props) => {
      if (props.$status === "success") return "#047857";
      if (props.$status === "error") return "#b91c1c";
      return props.$hasValue ? "#244b80" : "#334155";
    }} !important;
    font-weight: 700 !important;
  }

  .ant-select-arrow,
  .ant-select-suffix {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    position: absolute !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    right: 10px !important;
    margin: 0 !important;
    color: ${(props) => {
      if (props.$status === "success") return "#059669";
      if (props.$status === "error") return "#dc2626";
      return props.$hasValue ? "#2563eb" : "#94a3b8";
    }} !important;
    transition: color 0.2s !important;
    pointer-events: none !important;
  }
`;

export const TipBox = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  color: #b45309;
  font-weight: 500;
  font-style: italic;
`;

export const PersonCard = styled(Card)`
  border-radius: 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.01);
  background: white;
  margin-bottom: 0.75rem;

  .ant-card-body {
    padding: 1.25rem;
  }
`;

export const PersonHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

export const StatementCard = styled(Card)<{
  $isAnswered: boolean;
  $isActive?: boolean;
  $status?: "success" | "error" | "default";
}>`
  border-radius: 0.75rem;
  border: 1.5px solid
    ${(props) => {
      if (props.$status === "success") return "#10b981";
      if (props.$status === "error") return "#ef4444";
      return props.$isAnswered ? "#2563eb" : "rgba(0, 0, 0, 0.06)";
    }};
  background: ${(props) => {
    if (props.$status === "success") return "#f6fdfa";
    if (props.$status === "error") return "#fff5f5";
    return "white";
  }};
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02);
  margin-bottom: 1rem;
  transition: all 0.2s ease;
  cursor: pointer;

  .ant-card-body {
    padding: 1rem 1.25rem;
  }
`;

export const StyledRadioGroup = styled(Radio.Group)`
  display: flex;
  gap: 1.25rem;
  margin-top: 0.5rem;

  .ant-radio-button-wrapper {
    border-radius: 0.375rem !important;
    border: 1px solid #d1d5db !important;
    font-weight: bold;
    width: 3.5rem;
    text-align: center;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:first-child {
      border-left: 1px solid #d1d5db !important;
    }

    &::before {
      display: none !important;
    }
  }

  .ant-radio-button-wrapper-checked {
    background-color: #eff6ff !important;
    color: #2563eb !important;
    border-color: #2563eb !important;
  }
`;

export const TwoColumnLayout = styled.div<{ $ratio?: string }>`
  display: grid;
  grid-template-columns: ${(props) => props.$ratio || "1.15fr 0.85fr"};
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const Part2Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const StoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
`;

export const FixedSentenceCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem 1.25rem;
  font-size: 0.975rem;
  line-height: 1.5;
  color: #0f172a;
  font-weight: 600;
  min-height: 56px;
  display: flex;
  align-items: center;
`;

export const EmptySlotDropzone = styled.div<{ $isOver?: boolean }>`
  background: ${(props) => (props.$isOver ? "#f0fdf4" : "#fafafa")};
  border: 1px dashed ${(props) => (props.$isOver ? "#10b981" : "#cbd5e1")};
  border-radius: 0.5rem;
  padding: 1rem 1.25rem;
  font-size: 0.975rem;
  color: #94a3b8;
  font-weight: 600;
  text-align: center;
  min-height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background: #f8fafc;
    border-color: #94a3b8;
  }
`;

export const PlacedItemCard = styled.div<{
  $status?: "success" | "error" | "default";
}>`
  background: #ffffff;
  border: 1px solid
    ${(props) => {
      if (props.$status === "success") return "#10b981";
      if (props.$status === "error") return "#ef4444";
      return "#3b82f6";
    }};
  border-radius: 0.5rem;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 56px;
  cursor: grab;

  .text {
    font-size: 0.975rem;
    color: #1e293b;
    font-weight: 600;
    line-height: 1.5;
    flex: 1;
  }

  .btn-remove {
    background: none;
    border: none;
    color: #ef4444;
    font-weight: 700;
    cursor: pointer;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const OptionsPool = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const DraggableCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: grab;
  transition: all 0.2s;
  min-height: 56px;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02);
  }
`;

export const DragGripHandle = styled.div`
  color: #94a3b8;
  font-size: 1.15rem;
  user-select: none;
`;

export const DraggableText = styled.span`
  font-size: 0.975rem;
  color: #334155;
  font-weight: 600;
  line-height: 1.5;
`;

export const PersonAvatar = styled(Avatar)<{ $color: string }>`
  background-color: ${(props) => props.$color};
  font-weight: bold;
  font-size: 1.125rem;
`;

export const QuestionRow = styled.div<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  width: 100%;
  border-radius: 0.5rem;
  background: transparent;
  border: 1px solid transparent;
  transition: all 0.2s ease;

  &:last-child {
    border-bottom: none;
  }
`;

export const QuestionText = styled.div`
  font-size: 1.05rem;
  color: #1e293b;
  font-weight: 600;
  flex: 1;
  line-height: 1.8;
`;

export const ParagraphWrapper = styled.div`
  display: flex;
  gap: 1rem;
  background: white;
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  margin-bottom: 1rem;
`;

export const ParagraphNumber = styled.div`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: #eff6ff;
  color: #2563eb;
  font-weight: bold;
  font-size: 1.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const QuestionSlot = styled(Card)<{
  $isAnswered: boolean;
  $isActive?: boolean;
  $status?: "success" | "error" | "default";
}>`
  border-radius: 0.75rem;
  border: 1.5px solid
    ${(props) => {
      if (props.$status === "success") return "#10b981";
      if (props.$status === "error") return "#ef4444";
      return props.$isAnswered ? "#2563eb" : "rgba(0, 0, 0, 0.06)";
    }};
  background: ${(props) => {
    if (props.$status === "success") return "#f6fdfa";
    if (props.$status === "error") return "#fff5f5";
    return "white";
  }};
  margin-bottom: 0.75rem;
  transition: all 0.2s ease;
  cursor: pointer;

  .ant-card-body {
    padding: 1rem 1.25rem;
  }
`;

export const BadgeNumber = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #eff6ff;
  border: 1px solid #dbeafe;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #244b80;
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
`;
