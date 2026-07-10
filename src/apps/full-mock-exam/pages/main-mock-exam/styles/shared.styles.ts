import styled, { keyframes } from "styled-components";
import { Link } from "@tanstack/react-router";

// KEYFRAMES
export const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

// LAYOUT
export const ExamLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background: #ffffff;
  overflow: hidden;
  font-family: "Outfit", "Inter", system-ui, sans-serif;
`;

export const ExamHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 4.5rem;
  background: #0d2245;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
  flex-shrink: 0;
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

export const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #ffffff;

  scrollbar-width: thin;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
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

export const ExamFooter = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem;
  height: 4.5rem;
  background: white;
  border-top: 1px solid #e4e4e7;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.03);
  z-index: 10;
  flex-shrink: 0;
`;

export const FullPageCenter = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
`;

export const SectionWrapper = styled.div`
  width: 100%;
  flex: 1;
`;

// SHARED UI COMPONENTS
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

export const InstructionText = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 1.5rem 0 1rem 0;
  line-height: 1.5;
`;

export const OptionCard = styled.div<{
  $selected?: boolean;
  $status?: "success" | "error" | "default";
}>`
  display: flex;
  align-items: center;
  border: 1.5px solid
    ${(props) => {
      if (props.$status === "success") return "#10b981";
      if (props.$status === "error") return "#ef4444";
      return props.$selected ? "#3b5b8c" : "#e2e8f0";
    }};
  border-radius: 8px;
  margin-bottom: 12px;
  padding: 14px 18px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${(props) => {
    if (props.$status === "success") return "#ecfdf5";
    if (props.$status === "error") return "#fef2f2";
    return props.$selected ? "#eff6ff" : "#ffffff";
  }};

  &:hover {
    border-color: ${(props) =>
      props.$status && props.$status !== "default" ? "" : "#3b5b8c"};
    background: ${(props) => {
      if (props.$status === "success") return "#ecfdf5";
      if (props.$status === "error") return "#fef2f2";
      return props.$selected ? "#eff6ff" : "#f8fafc";
    }};
  }

  .option-letter {
    font-weight: 800;
    color: ${(props) => {
      if (props.$status === "success") return "#047857";
      if (props.$status === "error") return "#b91c1c";
      return props.$selected ? "#3b5b8c" : "#0f172a";
    }};
    margin-right: 24px;
    font-size: 1.1rem;
  }

  .option-text {
    color: ${(props) => {
      if (props.$status === "success") return "#047857";
      if (props.$status === "error") return "#b91c1c";
      return props.$selected ? "#1a365d" : "#334155";
    }};
    font-weight: ${(props) => (props.$selected ? "700" : "500")};
    font-size: 1rem;
    flex: 1;
  }
`;

export const BadgeNumber = styled.div`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: #eff6ff;
  border: 1px solid #dbeafe;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #244b80;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
`;

// LEGACY NAVIGATOR STYLES REMOVED (Migrated to shared component)
