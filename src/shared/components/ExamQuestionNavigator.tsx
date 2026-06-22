import React from 'react';
import styled from 'styled-components';
import { Tooltip } from 'antd';

// --- STYLES (Synchronized with Premium Design) ---

const NavigatorWrapper = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  height: fit-content;
  max-height: calc(100vh - 12rem);
  overflow-y: auto;
  width: 100%;
  max-width: 300px;
  margin-left: auto;
  
  scrollbar-width: thin;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
  }
`;

const NavigatorTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 800;
  color: #0d2245;
  margin-bottom: 1.25rem;
`;

const NavigatorSection = styled.div`
  margin-bottom: 1.25rem;
  
  &:last-child {
    margin-bottom: 0;
  }

  .section-label {
    font-size: 0.7rem;
    font-weight: 800;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.75rem;
  }
`;

const NavigatorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.375rem;
  margin-bottom: 0.5rem;
`;

const NavigatorItem = styled.button<{
    $active: boolean;
    $answered: boolean;
    $status?: 'success' | 'error' | 'default';
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
  
  background: ${props => {
        if (props.$status === 'success') return '#ecfdf5';
        if (props.$status === 'error') return '#fef2f2';
        if (props.$answered) return '#eff6ff';
        return '#f1f5f9';
    }};
  
  border-color: ${props => {
        if (props.$active) return '#1a365d';
        if (props.$status === 'success') return '#bbf7d0';
        if (props.$status === 'error') return '#fecaca';
        if (props.$answered) return '#bfdbfe';
        return 'transparent';
    }};
  
  color: ${props => {
        if (props.$active) return '#1a365d';
        if (props.$status === 'success') return '#10b981';
        if (props.$status === 'error') return '#ef4444';
        if (props.$answered) return '#1d4ed8';
        return '#64748b';
    }};

  &:hover {
    border-color: #1a365d;
    background: ${props => props.$answered ? '#dbeafe' : '#e2e8f0'};
  }
`;

const NavigatorLegend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  border-top: 1px solid #f1f5f9;
  padding-top: 1rem;
  margin-top: 1rem;

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    font-size: 0.85rem;
    color: #64748b;
    font-weight: 600;
    
    .color-dot {
      width: 0.65rem;
      height: 0.65rem;
      border-radius: 0.2rem;
      flex-shrink: 0;
    }
  }
`;

// --- COMPONENT ---

export interface NavSection {
    label: string;
    questions: number[];
}

interface ExamQuestionNavigatorProps {
    sections: NavSection[];
    answers: Record<number, any>;
    currentQuestion: number;
    onNavigate: (qNum: number) => void;
    isSubmitted?: boolean;
    correctAnswers?: Record<number, any>;
    renderItem?: (qNum: number) => React.ReactNode;
}

export const ExamQuestionNavigator: React.FC<ExamQuestionNavigatorProps> = ({
    sections,
    answers,
    currentQuestion,
    onNavigate,
    isSubmitted = false,
    correctAnswers = {},
    renderItem
}) => {
    return (
        <NavigatorWrapper>
            <NavigatorTitle>Bảng câu hỏi</NavigatorTitle>

            {sections.map((section, sIdx) => (
                <NavigatorSection key={sIdx}>
                    <div className="section-label">{section.label}</div>
                    <NavigatorGrid>
                        {section.questions.map((qNum) => {
                            const isAnswered = !!answers[qNum];
                            const isActive = currentQuestion === qNum;

                            let status: 'success' | 'error' | 'default' = 'default';
                            if (isSubmitted) {
                                if (answers[qNum] === correctAnswers[qNum]) status = 'success';
                                else if (isAnswered) status = 'error';
                            }

                            let placement: 'top' | 'topRight' | 'topLeft' = 'top';
                            if (qNum % 5 === 1) placement = 'topRight';
                            else if (qNum % 5 === 0) placement = 'topLeft';

                            return (
                                <Tooltip
                                    key={qNum}
                                    title={`Câu ${qNum}: ${isAnswered ? 'Đã trả lời' : 'Chưa trả lời'}`}
                                    placement={placement}
                                    mouseEnterDelay={0.15}
                                >
                                    <NavigatorItem
                                        $active={isActive}
                                        $answered={isAnswered}
                                        $status={status}
                                        onClick={() => onNavigate(qNum)}
                                    >
                                        {renderItem ? renderItem(qNum) : qNum}
                                    </NavigatorItem>
                                </Tooltip>
                            );
                        })}
                    </NavigatorGrid>
                </NavigatorSection>
            ))}

            <NavigatorLegend>
                {!isSubmitted ? (
                    <>
                        <div className="legend-item">
                            <div className="color-dot" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1' }} />
                            <span>Chưa trả lời</span>
                        </div>
                        <div className="legend-item">
                            <div className="color-dot" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }} />
                            <span>Đã trả lời</span>
                        </div>
                        <div className="legend-item">
                            <div className="color-dot" style={{ background: 'white', border: '1.5px solid #1a365d' }} />
                            <span>Đang chọn</span>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="legend-item">
                            <div className="color-dot" style={{ background: '#ecfdf5', border: '1px solid #bbf7d0' }} />
                            <span>Trả lời đúng</span>
                        </div>
                        <div className="legend-item">
                            <div className="color-dot" style={{ background: '#fef2f2', border: '1px solid #fecaca' }} />
                            <span>Trả lời sai</span>
                        </div>
                    </>
                )}
            </NavigatorLegend>
        </NavigatorWrapper>
    );
};
