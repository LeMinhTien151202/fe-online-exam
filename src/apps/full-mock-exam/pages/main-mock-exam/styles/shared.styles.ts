import styled, { keyframes } from "styled-components";
import { Link } from "@tanstack/react-router";

// KEYFRAMES
export const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const gradingPulse = keyframes`
  0% { transform: scale(0.82); opacity: 0.7; }
  70%, 100% { transform: scale(1.25); opacity: 0; }
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
  /* width:100% + flex:1 để lấp đầy #root (là flex row) — nếu không sẽ co theo nội dung, lệch trái */
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
`;

export const GradingPage = styled.main`
  min-height: 100dvh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #eef3f8;
  font-family: "Outfit", "Inter", system-ui, sans-serif;

  @media (max-width: 700px) {
    align-items: flex-start;
    padding: 1rem;
  }
`;

export const GradingShell = styled.section`
  width: min(980px, 100%);
  display: grid;
  grid-template-columns: minmax(270px, 0.82fr) minmax(0, 1.45fr);
  overflow: hidden;
  border: 1px solid #dbe4ee;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 24px 70px rgba(23, 52, 86, 0.14);

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const GradingStatusPanel = styled.aside`
  min-height: 580px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
  padding: 2.25rem;
  color: #f8fafc;
  background: #0d2245;

  @media (max-width: 760px) {
    min-height: auto;
    padding: 1.75rem;
  }
`;

export const GradingStatusLabel = styled.span`
  align-self: flex-start;
  padding: 0.45rem 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 999px;
  color: #dbeafe;
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const GradingIconStage = styled.div`
  position: relative;
  width: 148px;
  height: 148px;
  display: grid;
  place-items: center;
  align-self: center;
`;

export const GradingPulseRing = styled.span`
  position: absolute;
  inset: 0;
  border: 1px solid rgba(191, 219, 254, 0.6);
  border-radius: 50%;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${gradingPulse} 2.2s ease-out infinite;
  }
`;

export const GradingIconCircle = styled.div`
  position: relative;
  width: 104px;
  height: 104px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18);
  font-size: 2.7rem;
`;

export const GradingPanelTitle = styled.h2`
  margin: 0 0 0.4rem;
  color: #ffffff;
  font-size: 1.3rem;
  line-height: 1.25;
`;

export const GradingPanelText = styled.p`
  margin: 0;
  color: #b9c8dc;
  font-size: 0.95rem;
  line-height: 1.55;
`;

export const ElapsedTime = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  color: #dbeafe;
  font-size: 0.92rem;
  font-variant-numeric: tabular-nums;
`;

export const GradingContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2.6rem 3rem;

  @media (max-width: 760px) {
    padding: 1.75rem;
  }
`;

export const GradingHeading = styled.h1`
  margin: 0;
  color: #132b4f;
  font-size: clamp(1.75rem, 4vw, 2.35rem);
  line-height: 1.15;
  letter-spacing: -0.03em;
`;

export const GradingLead = styled.p`
  max-width: 58ch;
  margin: 0.85rem 0 1.5rem;
  color: #5d6f86;
  font-size: 1rem;
  line-height: 1.65;
`;

export const GradingEstimate = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  padding: 1rem 1.1rem;
  border: 1px solid #cbd9e8;
  border-radius: 14px;
  background: #f4f8fc;
  color: #1a365d;

  > span:first-child {
    margin-top: 0.18rem;
    font-size: 1.1rem;
  }

  div {
    display: grid;
    gap: 0.2rem;
  }

  strong {
    font-size: 0.98rem;
  }

  div span {
    color: #60728a;
    font-size: 0.88rem;
    line-height: 1.45;
  }
`;

export const GradingSteps = styled.div`
  display: grid;
  gap: 0;
  margin: 1.45rem 0;
`;

export const GradingStep = styled.div<{ $state: 'done' | 'active' | 'waiting' }>`
  position: relative;
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 0.85rem;
  min-height: 66px;
  color: ${({ $state }) => ($state === 'waiting' ? '#8795a7' : '#1a365d')};

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 32px;
    bottom: 0;
    left: 16px;
    width: 1px;
    background: ${({ $state }) => ($state === 'done' ? '#7393b7' : '#d9e2ec')};
  }

  strong,
  span {
    display: block;
  }

  strong {
    margin-top: 0.1rem;
    font-size: 0.95rem;
  }

  span {
    margin-top: 0.2rem;
    color: ${({ $state }) => ($state === 'waiting' ? '#9aa6b6' : '#687b91')};
    font-size: 0.84rem;
    line-height: 1.45;
  }
`;

export const GradingStepIcon = styled.div`
  position: relative;
  z-index: 1;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 1px solid #cbd8e6;
  border-radius: 50%;
  background: #ffffff;
  color: #3b5b8c;
  font-size: 0.85rem;
  font-weight: 800;
`;

export const GradingSafetyNote = styled.div`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  margin-top: 1rem;
  color: #708096;
  font-size: 0.8rem;
  line-height: 1.4;
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
