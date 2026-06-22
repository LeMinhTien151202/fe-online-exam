import React, { useState } from 'react';
import { Typography, Row, Col, Space, Button, Divider, Tooltip } from 'antd';
import {
    LeftOutlined,
    RightOutlined,
    UnlockOutlined,
    DownOutlined,
    UpOutlined
} from '@ant-design/icons';
import * as S from '../styles/shared.styles';
import * as SS from '../styles/speaking.styles';
import { ExamQuestionNavigator, NavSection } from '../../../../../shared/components/ExamQuestionNavigator';
import { SpeakingController } from './speaking/SpeakingController';
import {
    part1Questions,
    part2Questions,
    part3Questions,
    part4Questions,
    ISpeakingQuestion
} from '../services/speakingData';

const { Text, Paragraph } = Typography;

export interface SpeakingHandle {
    next: () => boolean;
    prev: () => boolean;
}

interface SpeakingSectionProps {
    onProgressUpdate?: (answered: number, part: number, question: number) => void;
}

const SpeakingSection = React.forwardRef<SpeakingHandle, SpeakingSectionProps>(({ onProgressUpdate }, ref) => {
    const [activeQuestionNum, setActiveQuestionNum] = useState(1);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [showSampleMap, setShowSampleMap] = useState<Record<number, boolean>>({});
    const [activeSampleIdxMap, setActiveSampleIdxMap] = useState<Record<number, number>>({});

    const isSubmitted = false; // Internal submitted state, can be linked to parent if needed

    const activePart = activeQuestionNum <= 3 ? 1 : activeQuestionNum <= 6 ? 2 : activeQuestionNum <= 9 ? 3 : 4;

    const updateProgress = () => {
        const answered = Object.keys(answers).length;
        onProgressUpdate?.(answered, activePart, activeQuestionNum);
    };

    React.useEffect(() => {
        updateProgress();
    }, [activeQuestionNum, answers]);

    React.useImperativeHandle(ref, () => ({
        next: () => {
            if (activeQuestionNum < 12) {
                setActiveQuestionNum(prev => prev + 1);
                return true;
            }
            return false;
        },
        prev: () => {
            if (activeQuestionNum > 1) {
                setActiveQuestionNum(prev => prev - 1);
                return true;
            }
            return false;
        }
    }), [activeQuestionNum]);

    const toggleSample = (qId: number) => {
        setShowSampleMap(prev => ({ ...prev, [qId]: !prev[qId] }));
    };

    const setSampleIndex = (qId: number, idx: number) => {
        setActiveSampleIdxMap(prev => ({ ...prev, [qId]: idx }));
    };

    const renderActiveQuestionContent = () => {
        // PART 1 (Questions 1 - 3)
        if (activeQuestionNum <= 3) {
            const q = part1Questions[activeQuestionNum - 1];
            return (
                <SS.QuestionBox $borderColor="#0284c7">
                    <div className="q-badge">Câu hỏi {q.id}</div>
                    <div className="q-text">{q.questionText}</div>
                </SS.QuestionBox>
            );
        }

        // PART 2 (Questions 4 - 6)
        if (activeQuestionNum >= 4 && activeQuestionNum <= 6) {
            const q = part2Questions[activeQuestionNum - 4];
            return (
                <SS.SectionColumn>
                    <SS.ImageWrapper $height="280px">
                        <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=60" alt="Family Cooking" />
                    </SS.ImageWrapper>

                    <SS.QuestionBox $borderColor="#059669">
                        <div className="q-badge">{activeQuestionNum === 4 ? 'Mô tả tranh (Describe)' : 'Câu hỏi mở rộng (Explain)'}</div>
                        <div className="q-text">{q.questionText}</div>
                    </SS.QuestionBox>
                </SS.SectionColumn>
            );
        }

        // PART 3 (Questions 7 - 9)
        if (activeQuestionNum >= 7 && activeQuestionNum <= 9) {
            const q = part3Questions[activeQuestionNum - 7];
            return (
                <SS.SectionColumn>
                    <SS.PhotosGrid>
                        <SS.ImageWrapper $height="200px">
                            <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800" alt="Restaurant dining" />
                        </SS.ImageWrapper>
                        <SS.ImageWrapper $height="200px">
                            <img src="https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=800" alt="Home dining" />
                        </SS.ImageWrapper>
                    </SS.PhotosGrid>

                    <SS.QuestionBox $borderColor="#d97706">
                        <div className="q-badge">{activeQuestionNum === 7 ? 'So sánh tranh (Compare)' : 'Câu hỏi mở rộng (Explain)'}</div>
                        <div className="q-text">{q.questionText}</div>
                    </SS.QuestionBox>
                </SS.SectionColumn>
            );
        }

        // PART 4 (Questions 10 - 12)
        if (activeQuestionNum >= 10 && activeQuestionNum <= 12) {
            return (
                <SS.QuestionBox $borderColor="#7c3aed">
                    <div className="q-badge">Part 4: Thuyết trình dài về chủ đề trừu tượng (Câu 10, 11 & 12)</div>
                    <div className="q-text">
                        Trả lời 3 câu hỏi sau đây trong một bài thuyết trình hoàn chỉnh:<br /><br />
                        10. Tell me about a time you had to make an important decision.<br />
                        11. What was the decision and why was it important?<br />
                        12. What was the outcome of your decision?
                    </div>
                </SS.QuestionBox>
            );
        }

        return null;
    };

    const renderActiveQuestionRight = () => {
        let prepTime = 0;
        let recordingTime = 30;
        let statusColor = "#0284c7";
        let q: ISpeakingQuestion | undefined;

        if (activeQuestionNum <= 3) {
            q = part1Questions[activeQuestionNum - 1];
            prepTime = 0;
            recordingTime = 30;
            statusColor = "#0284c7";
        } else if (activeQuestionNum <= 6) {
            q = part2Questions[activeQuestionNum - 4];
            prepTime = 45;
            recordingTime = 45;
            statusColor = "#059669";
        } else if (activeQuestionNum <= 9) {
            q = part3Questions[activeQuestionNum - 7];
            prepTime = 45;
            recordingTime = 45;
            statusColor = "#d97706";
        } else {
            q = part4Questions[0];
            prepTime = 60;
            recordingTime = 120;
            statusColor = "#7c3aed";
        }

        if (!q) return null;

        const showSample = showSampleMap[q.id] ?? false;
        const sampleIdx = activeSampleIdxMap[q.id] ?? 0;

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                <SpeakingController
                    prepTime={prepTime}
                    recordingTime={recordingTime}
                    statusColor={statusColor}
                    title={`speak-test-q${activeQuestionNum}`}
                    onCompleted={(url) => setAnswers(prev => ({ ...prev, [activeQuestionNum]: url || 'recorded' }))}
                />

                {/* Samples are usually visible if it's a practice, but for Mock Exam we might want to hide them until submitted. 
                    However, the requirement says synchronize with speaking-practice. 
                    I'll show them only if needed or keep the structure.
                */}
            </div>
        );
    };

    const navSections: NavSection[] = [
        { label: 'Part 1: Cá nhân (1-3)', questions: [1, 2, 3] },
        { label: 'Part 2: Miêu tả (4-6)', questions: [4, 5, 6] },
        { label: 'Part 3: So sánh (7-9)', questions: [7, 8, 9] },
        { label: 'Part 4: Thuyết trình (10-12)', questions: [10, 11, 12] }
    ];

    const getPartTitle = () => {
        switch (activePart) {
            case 1: return { title: 'Personal Information', subtitle: `Part 1 • Question ${activeQuestionNum} of 3` };
            case 2: return { title: 'Describe, Express Opinion & Explain', subtitle: 'Part 2 • 3 Questions' };
            case 3: return { title: 'Compare & Provide Reasons', subtitle: 'Part 3 • 3 Questions' };
            case 4: return { title: 'Abstract Topic', subtitle: 'Part 4 • Long Presentation' };
            default: return { title: '', subtitle: '' };
        }
    };

    const { title, subtitle } = getPartTitle();

    return (
        <S.SectionWrapper>
            <Row gutter={24}>
                <Col lg={19} md={24}>
                    <S.ContentCard style={{ padding: '0 1rem' }}>
                        <S.TitleArea>
                            <h2>{title}</h2>
                            <div className="subtitle">{subtitle}</div>
                        </S.TitleArea>

                        <SS.SubTabContainer>
                            {navSections[activePart - 1].questions.map((num) => (
                                <SS.SubTab
                                    key={num}
                                    $active={activeQuestionNum === num}
                                    $color={activePart === 1 ? "#0284c7" : activePart === 2 ? "#059669" : activePart === 3 ? "#d97706" : "#7c3aed"}
                                    onClick={() => setActiveQuestionNum(num)}
                                >
                                    Câu {activePart === 4 ? num : (num - (activePart - 1) * 3)} {answers[num] ? '✓' : ''}
                                </SS.SubTab>
                            ))}
                        </SS.SubTabContainer>

                        <Row gutter={24}>
                            <Col lg={13} md={24}>
                                {renderActiveQuestionContent()}
                            </Col>
                            <Col lg={11} md={24}>
                                {renderActiveQuestionRight()}
                            </Col>
                        </Row>
                    </S.ContentCard>
                </Col>

                <Col lg={5} md={24}>
                    <ExamQuestionNavigator
                        sections={navSections}
                        answers={answers}
                        currentQuestion={activeQuestionNum}
                        onNavigate={(q) => setActiveQuestionNum(q)}
                        isSubmitted={false}
                    />
                </Col>
            </Row>
        </S.SectionWrapper>
    );
});

export default SpeakingSection;
