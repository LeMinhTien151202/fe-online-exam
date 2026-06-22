import styled from "styled-components";
import { Card, Select, Avatar, Radio } from "antd";
import { Link } from "@tanstack/react-router";

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background: #ffffff;
  overflow: hidden;
  font-family:
    "Outfit",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    sans-serif;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 4.5rem;
  background: #0d2245;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
`;

export const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #94a3b8;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    color: white;
  }
`;

export const HeaderTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 800;
  color: white;
  margin: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const TimerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-family: monospace;
  font-size: 1.125rem;
  font-weight: bold;
`;

export const ContentBody = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;

  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

export const LeftNavigation = styled.aside`
  width: 280px;
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem;
  gap: 0.75rem;
  overflow-y: auto;

  @media (max-width: 992px) {
    width: 100%;
    flex-direction: row;
    height: auto;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
    padding: 0.75rem 1rem;
    overflow-x: auto;
  }
`;

export const NavItem = styled.div<{ $active?: boolean; $completed?: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 0.875rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid ${(props) => (props.$active ? "#bfdbfe" : "transparent")};
  background: ${(props) => {
    if (props.$active) return "#eff6ff";
    return "transparent";
  }};

  &:hover {
    background: ${(props) => (props.$active ? "#eff6ff" : "#f8fafc")};
  }

  .nav-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.25rem;

    .nav-title {
      font-weight: 700;
      color: ${(props) => (props.$active ? "#244b80" : "#334155")};
      font-size: 0.95rem;
    }

    .nav-status {
      font-size: 0.875rem;
      color: ${(props) => (props.$completed ? "#10b981" : "#64748b")};
    }
  }

  .nav-desc {
    font-size: 0.75rem;
    color: #64748b;
    font-weight: 500;

    @media (max-width: 992px) {
      display: none;
    }
  }

  @media (max-width: 992px) {
    padding: 0.5rem 1rem;
    flex-shrink: 0;
    min-width: 140px;
    align-items: center;
    justify-content: center;

    .nav-header {
      margin-bottom: 0;
      gap: 0.5rem;
    }
  }
`;

export const RightWorkspace = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f8fafc;
`;

export const WorkspaceContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 640px) {
    padding: 1rem;
  }
`;

export const PartIntroCard = styled(Card)`
  border-radius: 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
  margin-bottom: 0.5rem;
  background: white;

  .ant-card-body {
    padding: 1.25rem 1.5rem;
  }

  h3 {
    font-weight: 800;
    color: #1a365d;
    font-size: 1.25rem;
    margin: 0 0 6px 0;
  }

  p {
    font-size: 0.95rem;
    color: #64748b;
    margin: 0;
    font-weight: 500;
    line-height: 1.5;
  }
`;

export const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 4.5rem;
  background: white;
  border-top: 1px solid #e2e8f0;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.02);
  z-index: 5;
`;

export const ReportContainer = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  width: 100%;
  overflow-y: auto;
  max-height: calc(100vh - 10rem);
`;

export const ReportCard = styled.div`
  background: white;
  border-radius: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const ScoreRingWrapper = styled.div`
  margin-bottom: 2rem;
  position: relative;
`;

export const ScoreLabel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .score-val {
    font-size: 2.25rem;
    font-weight: 900;
    color: #1a365d;
    line-height: 1.1;
  }

  .score-max {
    font-size: 1rem;
    color: #64748b;
    font-weight: 600;
    margin-top: 2px;
  }
`;

export const ReportGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  width: 100%;
  margin-bottom: 2.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const ReportStatItem = styled.div`
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 0.75rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  .stat-label {
    font-size: 0.8rem;
    text-transform: uppercase;
    color: #64748b;
    font-weight: 700;
    letter-spacing: 0.05em;
    margin-bottom: 6px;
  }

  .stat-value {
    font-size: 1.25rem;
    font-weight: 800;
    color: #1e293b;
  }
`;

export const ReviewSectionTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 800;
  color: #1a365d;
  width: 100%;
  text-align: left;
  margin-top: 2.5rem;
  margin-bottom: 1.25rem;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.5rem;
`;

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

export const QuestionRow = styled.div<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1rem;
  border-bottom: 1px solid
    ${(props) => (props.$isActive ? "transparent" : "#f1f5f9")};
  width: 100%;
  border-radius: 0.5rem;
  background: ${(props) => (props.$isActive ? "#f0f7ff" : "transparent")};
  border: 1px solid ${(props) => (props.$isActive ? "#bfdbfe" : "transparent")};
  transition: all 0.2s ease;

  &:last-child {
    border-bottom: ${(props) =>
      props.$isActive ? "1px solid #bfdbfe" : "none"};
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

export const QuestionText = styled.div`
  font-size: 1.05rem;
  color: #1e293b;
  font-weight: 600;
  flex: 1;
  line-height: 1.8;
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

export const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
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

export const PersonAvatar = styled(Avatar)<{ $color: string }>`
  background-color: ${(props) => props.$color};
  font-weight: bold;
  font-size: 1.125rem;
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
      if (props.$isActive) return "#1a365d";
      return props.$isAnswered ? "#2563eb" : "rgba(0, 0, 0, 0.06)";
    }};
  background: ${(props) => {
    if (props.$status === "success") return "#f6fdfa";
    if (props.$status === "error") return "#fff5f5";
    if (props.$isActive) return "#f0f7ff";
    return "white";
  }};
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02);
  margin-bottom: 0.75rem;
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

    &:first-child {
      border-left: 1px solid #d1d5db !important;
    }
  }

  .ant-radio-button-wrapper-checked {
    background-color: #eff6ff !important;
    color: #2563eb !important;
    border-color: #2563eb !important;
  }
`;

export const ScrollableColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const ParagraphWrapper = styled.div`
  display: flex;
  gap: 1rem;
  background: white;
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
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
      if (props.$isActive) return "#1a365d";
      return props.$isAnswered ? "#2563eb" : "rgba(0, 0, 0, 0.06)";
    }};
  background: ${(props) => {
    if (props.$status === "success") return "#f6fdfa";
    if (props.$status === "error") return "#fff5f5";
    if (props.$isActive) return "#f0f7ff";
    return "white";
  }};
  margin-bottom: 0.75rem;
  transition: all 0.2s ease;
  cursor: pointer;

  .ant-card-body {
    padding: 1rem 1.25rem;
  }
`;

export const WorkspaceGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  width: 100%;
  flex: 1;
  overflow: hidden;
  padding: 2rem;
  background: #ffffff;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }
`;

export const QuestionsColumn = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const NavPanel = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  height: fit-content;
  max-height: calc(100vh - 12rem);
  overflow-y: auto;

  @media (max-width: 1024px) {
    max-height: none;
  }
`;

export const PanelTitle = styled.h4`
  font-size: 1.05rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 1rem;
`;

export const SectionLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 1rem;
  margin-bottom: 0.5rem;

  &:first-child {
    margin-top: 0;
  }
`;

export const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.375rem;
  margin-bottom: 0.5rem;
`;

export const NavGridButton = styled.button<{
  $status: "unanswered" | "answered";
  $active: boolean;
  $isCorrect?: "success" | "error" | "default";
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

  background: ${(props) => {
    if (props.$isCorrect === "success") return "#ecfdf5";
    if (props.$isCorrect === "error") return "#fef2f2";
    if (props.$status === "answered") return "#eff6ff";
    return "#f1f5f9";
  }};

  border-color: ${(props) => {
    if (props.$active) return "#1a365d";
    if (props.$isCorrect === "success") return "#bbf7d0";
    if (props.$isCorrect === "error") return "#fecaca";
    if (props.$status === "answered") return "#bfdbfe";
    return "transparent";
  }};

  color: ${(props) => {
    if (props.$active) return "#1a365d";
    if (props.$isCorrect === "success") return "#10b981";
    if (props.$isCorrect === "error") return "#ef4444";
    if (props.$status === "answered") return "#1d4ed8";
    return "#64748b";
  }};

  &:hover {
    border-color: #1a365d;
    background: ${(props) =>
      props.$status === "answered" ? "#dbeafe" : "#e2e8f0"};
  }
`;

export const Legend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-top: 1px solid #f1f5f9;
  padding-top: 1rem;
  margin-top: 1rem;
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .color-dot {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 0.25rem;
  }
`;

export const ContentCard = styled.div`
  background: white;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 100%;
`;

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

export const OptionsGrid = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: column;
  max-width: 550px;
  width: 100%;
  margin-top: 1.5rem;
`;

export const OptionLabel = styled.button<{
  $selected: boolean;
  $status?: "success" | "error" | "default";
}>`
  width: 100%;
  background: ${(props) => {
    if (props.$status === "success") return "#ecfdf5";
    if (props.$status === "error") return "#fef2f2";
    return props.$selected ? "#e6f4ff" : "white";
  }};
  border: 1.5px solid
    ${(props) => {
      if (props.$status === "success") return "#10b981";
      if (props.$status === "error") return "#ef4444";
      return props.$selected ? "#1677ff" : "#cbd5e1";
    }};
  padding: 0.85rem 1.5rem;
  border-radius: 0.75rem;
  font-size: 1.05rem;
  font-weight: 600;
  color: ${(props) => {
    if (props.$status === "success") return "#047857";
    if (props.$status === "error") return "#b91c1c";
    return props.$selected ? "#1677ff" : "#475569";
  }};
  text-align: left;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &:hover {
    border-color: ${(props) =>
      props.$status && props.$status !== "default" ? "" : "#1677ff"};
    background: ${(props) => {
      if (props.$status === "success") return "#ecfdf5";
      if (props.$status === "error") return "#fef2f2";
      return props.$selected ? "#e6f4ff" : "#f8fafc";
    }};
  }

  .prefix {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 50%;
    background: ${(props) => {
      if (props.$status === "success") return "#10b981";
      if (props.$status === "error") return "#ef4444";
      return props.$selected ? "#1677ff" : "#f1f5f9";
    }};
    color: ${(props) =>
      props.$selected ||
      props.$status === "success" ||
      props.$status === "error"
        ? "white"
        : "#64748b"};
    font-size: 0.9rem;
    font-weight: 700;
    flex-shrink: 0;
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
