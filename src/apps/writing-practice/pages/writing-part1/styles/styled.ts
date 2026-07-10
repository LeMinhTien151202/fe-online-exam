import styled from "styled-components";
import { Link } from "@tanstack/react-router";
import { Button } from "antd";

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100dvh;
  width: 100%;
  background: #ffffff;
  overflow: hidden;
  font-family: "Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 4.5rem;
  background: #0D2245;
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
  overflow: hidden;
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #ffffff;
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 1.5rem;
  height: 100%;
  overflow: hidden;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }
`;

export const LeftColumn = styled.div`
  height: 100%;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
`;

export const RightColumn = styled.div`
  height: 100%;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
`;

export const CenteredContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow-y: auto;
  padding-right: 0.5rem;
  
  /* Scrollbar styling - hidden */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
`;


export const ContentCard = styled.div`
  background: white;
  width: 100%;
  padding: 0.5rem 0;
`;

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
  border-left: 4px solid ${props => props.$borderColor || '#0284c7'};
  padding: 1.25rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  color: #0369a1;
  line-height: 1.5;
  font-weight: 500;
`;

export const ExampleBox = styled.div`
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  padding: 1rem 1.25rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: #475569;
  line-height: 1.5;

  .title {
    font-weight: 700;
    color: #334155;
    margin-bottom: 0.25rem;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
  }
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

export const WordCounter = styled.div<{ $isInvalid?: boolean }>`
  align-self: flex-end;
  font-size: 0.8rem;
  font-weight: 700;
  color: ${props => props.$isInvalid ? '#ef4444' : '#10b981'};
  margin-top: 0.25rem;
`;

export const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 5rem;
  background: white;
  border-top: 1px solid #e2e8f0;
  z-index: 10;
`;

/* Specific to Part 3 Social Chat Layout (Re-used for column layout) */
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
  border: none; /* Borderless card */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
`;

/* Specific to Part 4 Email Workspace */
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
  border: none; /* Borderless card */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
`;

/* Modern Form Components */
export const ModernInput = styled.input<{ $isValid?: boolean; $hasText?: boolean }>`
  width: 100%;
  border-radius: 8px;
  padding: 0.65rem 1rem;
  font-family: inherit;
  font-size: 0.95rem;
  background: #ffffff;
  color: #1e293b;
  border: 1.5px solid ${props => 
    !props.$hasText ? '#cbd5e1' : 
    (props.$isValid ? '#10b981' : '#ef4444')
  };
  outline: none;
  transition: all 0.2s ease-in-out;

  &:focus {
    border-color: ${props => 
      !props.$hasText ? '#9333ea' : 
      (props.$isValid ? '#10b981' : '#ef4444')
    };
    box-shadow: 0 0 0 3px ${props => 
      !props.$hasText ? 'rgba(147, 51, 234, 0.15)' : 
      (props.$isValid ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)')
    };
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

export const ModernTextArea = styled.textarea<{ $isValid?: boolean; $hasText?: boolean }>`
  width: 100%;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-family: inherit;
  font-size: 0.95rem;
  line-height: 1.5;
  background: #ffffff;
  color: #1e293b;
  border: 1.5px solid ${props => 
    !props.$hasText ? '#cbd5e1' : 
    (props.$isValid ? '#10b981' : '#ef4444')
  };
  outline: none;
  resize: none;
  transition: all 0.2s ease-in-out;

  /* Hide scrollbar */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */

  &:focus {
    border-color: ${props => 
      !props.$hasText ? '#9333ea' : 
      (props.$isValid ? '#10b981' : '#ef4444')
    };
    box-shadow: 0 0 0 3px ${props => 
      !props.$hasText ? 'rgba(147, 51, 234, 0.15)' : 
      (props.$isValid ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)')
    };
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

export const ModernWordBadge = styled.span<{ $isValid?: boolean; $hasText?: boolean }>`
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  background: ${props => 
    !props.$hasText ? '#e2e8f0' : 
    (props.$isValid ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)')
  };
  color: ${props => 
    !props.$hasText ? '#64748b' : 
    (props.$isValid ? '#10b981' : '#ef4444')
  };
  border: 1px solid ${props => 
    !props.$hasText ? '#cbd5e1' : 
    (props.$isValid ? 'rgba(26, 54, 93, 0.25)' : 'rgba(239, 68, 68, 0.2)')
  };
  transition: all 0.2s ease;
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
  background: ${props => props.$bgColor || '#3b82f6'};
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

export const HeaderTitle = styled.span`
  font-size: clamp(1rem, 3vw, 1.15rem);
  font-weight: 700;
  color: white;
`;

export const SampleAnswersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const SampleAnswerItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const SampleAnswerTitle = styled.div`
  font-weight: 700;
  color: #1e293b;
  font-size: 0.92rem;
`;

export const SampleAnswerText1 = styled.div`
  color: #0284c7;
  font-style: italic;
  font-weight: 500;
`;

export const SampleAnswerText2 = styled.div`
  color: #4f46e5;
  font-style: italic;
  font-weight: 500;
`;

export const SampleAnswerText3 = styled.div`
  color: #ea580c;
  font-style: italic;
  font-weight: 500;
`;

export const FooterButton = styled(Button)`
  border-radius: 2rem !important;
  font-weight: 600 !important;
  padding: 0 1.5rem !important;
  color: #64748b !important;
`;

export const SubmitButton = styled(Button)`
  border-radius: 2rem !important;
  font-weight: 600 !important;
  background: #1a365d !important;
  border-color: #1a365d !important;
  padding: 0 2rem !important;
  color: white !important;
  
  &:hover {
    background: #12263f !important;
    border-color: #12263f !important;
  }
`;

export const ViewSampleButton = styled(Button)`
  border-radius: 1.5rem !important;
  color: #9333ea !important;
  border-color: #d8b4fe !important;
  font-weight: 600 !important;
`;

export const QuestionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`;

export const ErrorText = styled.span`
  font-size: 0.7rem;
  color: #ef4444;
  font-weight: 600;
`;

export const SampleAnswerContainer = styled.div`
  color: #1e293b;
  font-size: 1rem;
  font-style: italic;
`;

export const SampleAnswerWordCount = styled.div`
  margin-top: 12px;
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 600;
`;

export const SampleModalList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const SampleModalItem = styled.div`
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 12px;
  
  &:last-child {
    border-bottom: none;
  }
`;

export const SampleModalHeader = styled.div`
  font-weight: 700;
  color: #475569;
  font-size: 0.85rem;
  text-transform: uppercase;
`;

export const SampleModalQuestionText = styled.div`
  color: #0f172a;
  font-weight: 600;
  font-size: 0.9rem;
  margin: 4px 0;
`;

export const SampleModalAnswerText = styled.div`
  color: #9333ea;
  font-style: italic;
  margin-top: 6px;
  font-weight: 500;
`;

export const SampleModalAnswerText2 = styled.div`
  color: #7c3aed;
  font-style: italic;
  margin-top: 6px;
  font-weight: 500;
`;

export const SampleModalWordCount = styled.div`
  font-size: 0.8rem;
  color: #94a3b8;
  margin-top: 4px;
`;

export const InstructionText = styled.div`
  font-size: 0.92rem;
  color: #475569;
  font-weight: 600;
  margin-bottom: 1.25rem;
  line-height: 1.5;
`;

export const SenderName = styled.span`
  font-size: 0.9rem;
  font-weight: 700;
  color: #1e293b;
`;

export const SampleModalListLarge = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const SampleModalSubHeader = styled.div`
  font-weight: 800;
  color: #4f46e5;
  font-size: 1rem;
  border-bottom: 2px solid #e0e7ff;
  padding-bottom: 4px;
  margin-bottom: 8px;
  text-transform: uppercase;
`;

export const SampleModalSubHeader2 = styled.div`
  font-weight: 800;
  color: #9333ea;
  font-size: 1rem;
  border-bottom: 2px solid #f3e8ff;
  padding-bottom: 4px;
  margin-bottom: 8px;
  text-transform: uppercase;
`;

export const SampleModalTextCard = styled.div`
  white-space: pre-line;
  font-style: italic;
  color: #1e293b;
  background: #f8fafc;
  padding: 12px;
  border-radius: 6px;
`;

export const Subtitle = styled.div`
  font-size: 0.92rem;
  color: #475569;
  font-weight: 600;
  margin-top: 4px;
`;

export const SituationTitle = styled.div`
  font-weight: 800;
  color: #2f4a6b;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
`;

export const SituationBody = styled.div`
  white-space: pre-line;
  font-weight: 500;
  line-height: 1.45;
`;

export const EmailSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const EmailGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`;

export const EmailHeaderLabel = styled.div`
  font-weight: 800;
  color: #4f46e5;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
`;

export const EmailHeaderLabel2 = styled.div`
  font-weight: 800;
  color: #9333ea;
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

export const SubmitButtonPurple = styled(Button)`
  border-radius: 2rem !important;
  font-weight: 600 !important;
  background: #1a365d !important;
  border-color: #1a365d !important;
  padding: 0 2.5rem !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(26, 54, 93, 0.3) !important;

  &:hover {
    background: #12263f !important;
    border-color: #12263f !important;
  }
`;






