import React, { useState, useMemo, useImperativeHandle, forwardRef } from 'react';
import { Typography, Row, Col, Button, Select, Divider } from 'antd';
import {
    CaretRightOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import * as S from '../styles/shared.styles';
import * as LS from '../styles/listening.styles';
import { ExamQuestionNavigator, NavSection } from '../../../../../shared/components/ExamQuestionNavigator';

const { Text } = Typography;

export interface ListeningHandle {
    next: () => boolean;
    prev: () => boolean;
}

interface ListeningSectionProps {
    onProgressUpdate?: (answered: number, part: number, question: number) => void;
    onButtonLabelUpdate?: (label: string) => void;
}

const ListeningSection = forwardRef<ListeningHandle, ListeningSectionProps>(({
    onProgressUpdate,
    onButtonLabelUpdate
}, ref) => {
    const [currentQ, setCurrentQ] = useState(1);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [showTranscript, setShowTranscript] = useState(false);
    const isSubmitted = false; // Mocking as false for now

    // Map question index to Part
    const getPartFromQ = (q: number) => {
        if (q <= 13) return 1;
        if (q <= 17) return 2;
        if (q <= 21) return 3;
        return 4;
    };

    const currentPart = getPartFromQ(currentQ);

    const navSections: NavSection[] = [
        { label: 'Part 1: Câu hỏi ngắn (1 - 13)', questions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] },
        { label: 'Part 2: Điền từ (14 - 17)', questions: [14, 15, 16, 17] },
        { label: 'Part 3: Ghép ý kiến (18 - 21)', questions: [18, 19, 20, 21] },
        { label: 'Part 4: Đàm thoại dài (22 - 25)', questions: [22, 23, 24, 25] },
    ];

    useImperativeHandle(ref, () => ({
        next: () => {
            if (currentQ < 25) {
                setCurrentQ(prev => prev + 1);
                return true;
            }
            return false;
        },
        prev: () => {
            if (currentQ > 1) {
                setCurrentQ(prev => prev - 1);
                return true;
            }
            return false;
        }
    }), [currentQ]);

    const handleSelect = (qId: number, val: string) => {
        const newAnswers = { ...answers, [qId]: val };
        setAnswers(newAnswers);

        // Update orchestrator progress
        const answeredCount = Object.keys(newAnswers).length;
        onProgressUpdate?.(answeredCount, currentPart, currentQ);
    };

    const AudioPlayerSync = () => (
        <LS.PlayerWrapper>
            <LS.PlayButton icon={<CaretRightOutlined />}>
                Play
            </LS.PlayButton>
            <LS.StatusText>
                Press Play to listen <strong>(Listened: 0/2 times)</strong>
            </LS.StatusText>
        </LS.PlayerWrapper>
    );

    const renderContent = () => {
        switch (currentPart) {
            case 1:
                return (
                    <>
                        <S.TitleArea>
                            <h2>Listening</h2>
                            <div className="subtitle">Part 1 • Question {currentQ} of 13</div>
                        </S.TitleArea>
                        <S.InstructionText>Nghe audio và trả lời câu hỏi dưới đây:</S.InstructionText>
                        <AudioPlayerSync />
                        <div style={{ marginTop: '2rem' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#1e293b' }}>
                                {currentQ}. Listen to David talking about the conference. How long did he talk in the speech?
                            </div>
                            {["10 minutes", "15 minutes", "20 minutes"].map((opt, i) => (
                                <S.OptionCard key={i} $selected={answers[currentQ] === opt} onClick={() => handleSelect(currentQ, opt)}>
                                    <div className="option-letter">{String.fromCharCode(65 + i)}</div>
                                    <div className="option-text">{opt}</div>
                                </S.OptionCard>
                            ))}
                        </div>
                    </>
                );
            case 2:
                return (
                    <>
                        <S.TitleArea>
                            <h2>Listening To Music</h2>
                            <div className="subtitle">Part 2 • Questions 14 - 17 of 25</div>
                        </S.TitleArea>
                        <S.InstructionText>Four people are talking about music habits. Complete the sentences below.</S.InstructionText>
                        <AudioPlayerSync />
                        <div style={{ marginTop: '2rem' }}>
                            {[14, 15, 16, 17].map(q => (
                                <div key={q} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #f1f5f9' }}>
                                    <Text strong style={{ fontSize: '1rem', color: '#1e293b' }}>Person {q - 13}</Text>
                                    <Select
                                        placeholder="Select option"
                                        style={{ width: 220 }}
                                        onChange={(v) => handleSelect(q, v)}
                                        value={answers[q]}
                                        dropdownStyle={{ borderRadius: '8px' }}
                                    >
                                        <Select.Option value="A">Loves Jazz</Select.Option>
                                        <Select.Option value="B">Prefers Rock</Select.Option>
                                        <Select.Option value="C">Classical only</Select.Option>
                                    </Select>
                                </div>
                            ))}
                        </div>
                    </>
                );
            case 3:
                return (
                    <>
                        <S.TitleArea>
                            <h2>The Local Central</h2>
                            <div className="subtitle">Part 3 • Questions 18 - 21 of 25</div>
                        </S.TitleArea>
                        <S.InstructionText>Listen and decide whose opinion matches the statements: the man, the woman, or both.</S.InstructionText>
                        <AudioPlayerSync />
                        <div style={{ marginTop: '2rem' }}>
                            {[18, 19, 20, 21].map(q => (
                                <LS.StatementRow key={q}>
                                    <div className="statement-number">{q - 17}.</div>
                                    <div className="statement-text">
                                        {q === 18 && "Exhibitions should be different and diverse"}
                                        {q === 19 && "Traditional customs are gradually losing their significance"}
                                        {q === 20 && "Local festivals will disappear in the near future"}
                                        {q === 21 && "Schools are important in shaping future generations"}
                                    </div>
                                    <LS.StyledSelect
                                        placeholder="Select"
                                        onChange={(v) => handleSelect(q, v as string)}
                                        value={answers[q]}
                                        $hasValue={!!answers[q]}
                                        options={[
                                            { value: 'M', label: 'The Man' },
                                            { value: 'W', label: 'The Woman' },
                                            { value: 'B', label: 'Both' }
                                        ]}
                                    />
                                </LS.StatementRow>
                            ))}
                        </div>
                    </>
                );
            case 4:
                return (
                    <>
                        <S.TitleArea>
                            <h2>A Regional Development Plan</h2>
                            <div className="subtitle">Part 4 • Questions 22 - 25 of 25</div>
                        </S.TitleArea>
                        <S.InstructionText>Listen to a city planner talk at a press conference about Regional Development Planning and answer the questions below.</S.InstructionText>
                        <AudioPlayerSync />
                        <div style={{ marginTop: '2rem' }}>
                            {[22, 23, 24, 25].map(q => (
                                <div key={q} style={{ marginBottom: '2.5rem' }}>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', color: '#1e293b' }}>
                                        Câu {q}: What is one of the main criticisms of the Regional Development Plan?
                                    </div>
                                    {["It places too much emphasis on public transportation.", "It doesn't provide enough alternatives to driving.", "It is too expensive to implement the plan."].map((opt, i) => (
                                        <S.OptionCard key={i} $selected={answers[q] === opt} onClick={() => handleSelect(q, opt)}>
                                            <div className="option-letter">{String.fromCharCode(65 + i)}</div>
                                            <div className="option-text">{opt}</div>
                                        </S.OptionCard>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </>
                );
            default: return null;
        }
    };

    React.useEffect(() => {
        const answeredCount = Object.keys(answers).length;
        onProgressUpdate?.(answeredCount, currentPart, currentQ);

        const isEndOfPart = (currentPart === 1 && currentQ === 13) ||
            (currentPart === 2 && currentQ === 17) ||
            (currentPart === 3 && currentQ === 21) ||
            (currentPart === 4 && currentQ === 25);

        if (isEndOfPart) {
            onButtonLabelUpdate?.('Phần tiếp theo');
        } else {
            onButtonLabelUpdate?.('Câu tiếp theo');
        }
    }, [currentQ, currentPart, answers, onProgressUpdate, onButtonLabelUpdate]);

    return (
        <S.SectionWrapper>
            <Row gutter={24}>
                <Col lg={20} md={24}>
                    <S.ContentCard>
                        {renderContent()}

                        <LS.TranscriptButtonWrapper>
                            <Button icon={<FileTextOutlined />} onClick={() => setShowTranscript(!showTranscript)}>
                                {showTranscript ? 'Ẩn Transcript' : 'Hiện Transcript'}
                            </Button>
                        </LS.TranscriptButtonWrapper>

                        {showTranscript && (
                            <LS.TranscriptBox>
                                Sample transcript text content following the official listening format...
                            </LS.TranscriptBox>
                        )}
                    </S.ContentCard>
                </Col>

                <Col lg={4} md={24}>
                    <ExamQuestionNavigator
                        sections={navSections}
                        answers={answers}
                        currentQuestion={currentQ}
                        onNavigate={(q) => setCurrentQ(q)}
                        isSubmitted={isSubmitted}
                    />
                </Col>
            </Row>
        </S.SectionWrapper>
    );
});

export default ListeningSection;
