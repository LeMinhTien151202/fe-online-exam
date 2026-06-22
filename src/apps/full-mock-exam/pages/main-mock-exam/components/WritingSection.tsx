import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Space, Button, Divider } from 'antd';
import {
    LeftOutlined,
    RightOutlined,
    InfoCircleOutlined,
    CheckSquareOutlined
} from '@ant-design/icons';
import * as S from '../styles/shared.styles';
import * as WS from '../styles/writing.styles';
import { ExamQuestionNavigator, NavSection } from '../../../../../shared/components/ExamQuestionNavigator';
import { mockPart1Questions } from '../../../../writing-practice/pages/writing-part1/services/data';
import { mockPart2Question } from '../../../../writing-practice/pages/writing-part2/services/data';
import { mockPart3Messages } from '../../../../writing-practice/pages/writing-part3/services/data';
import { mockPart4Scenario } from '../../../../writing-practice/pages/writing-part4/services/data';

const { Text } = Typography;

export interface WritingHandle {
    next: () => boolean;
    prev: () => boolean;
}

interface WritingSectionProps {
    onProgressUpdate?: (answered: number, part: number, question: number) => void;
}

const WritingSection = React.forwardRef<WritingHandle, WritingSectionProps>(({ onProgressUpdate }, ref) => {
    const [activePart, setActivePart] = useState(1);
    const [p1Answers, setP1Answers] = useState<Record<number, string>>({});
    const [p2Answer, setP2Answer] = useState<string>('');
    const [p3Answers, setP3Answers] = useState<Record<number, string>>({});
    const [p4Informal, setP4Informal] = useState<string>('');
    const [p4Formal, setP4Formal] = useState<string>('');

    const navSections: NavSection[] = [
        { label: 'Part 1: Word-level', questions: [1] },
        { label: 'Part 2: Short Text', questions: [2] },
        { label: 'Part 3: Social Network', questions: [3] },
        { label: 'Part 4: Email Writing', questions: [4] }
    ];

    React.useImperativeHandle(ref, () => ({
        next: () => {
            if (activePart < 4) {
                setActivePart(prev => prev + 1);
                return true;
            }
            return false;
        },
        prev: () => {
            if (activePart > 1) {
                setActivePart(prev => prev - 1);
                return true;
            }
            return false;
        }
    }), [activePart]);

    const getWordCount = (text: string) => {
        if (!text) return 0;
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    };

    const isP1Valid = (text: string) => {
        const count = getWordCount(text);
        return count >= 1 && count <= 5;
    };

    const isP2Valid = (text: string) => {
        const count = getWordCount(text);
        return count >= 20 && count <= 30;
    };

    const isP3Valid = (text: string) => {
        const count = getWordCount(text);
        return count >= 30 && count <= 40;
    };

    const isP4InformalValid = (text: string) => {
        const count = getWordCount(text);
        return count >= 40 && count <= 60;
    };

    const isP4FormalValid = (text: string) => {
        const count = getWordCount(text);
        return count >= 120 && count <= 150;
    };

    const getAnswersMap = () => {
        const map: Record<number, any> = {};
        if (Object.values(p1Answers).some(a => !!a)) map[1] = 'answered';
        if (p2Answer) map[2] = 'answered';
        if (Object.values(p3Answers).some(a => !!a)) map[3] = 'answered';
        if (p4Informal || p4Formal) map[4] = 'answered';
        return map;
    };

    useEffect(() => {
        const answered = Object.keys(getAnswersMap()).length;
        onProgressUpdate?.(answered, activePart, activePart);
    }, [p1Answers, p2Answer, p3Answers, p4Informal, p4Formal, activePart]);

    const renderPart1 = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <WS.TitleArea>
                <div>
                    <h2>Nhập thông tin cơ bản vào biểu mẫu đăng ký</h2>
                    <div className="subtitle">Writing Part 1 • Fill out the form (1 - 5 words)</div>
                </div>
            </WS.TitleArea>
            <WS.InstructionBox $borderColor="#0284c7">
                You are joining an Art club. Fill out the form. Write short answers (1-5 words) for each message.
            </WS.InstructionBox>

            <WS.QuestionsWrapper>
                {mockPart1Questions.map((q) => {
                    const textVal = p1Answers[q.id] || '';
                    const wordCount = getWordCount(textVal);
                    const isValid = isP1Valid(textVal);

                    return (
                        <WS.QuestionItem key={q.id}>
                            <div className="q-text">
                                {q.id}. {q.questionText}
                            </div>
                            <WS.ModernInput
                                placeholder="Nhập câu trả lời của bạn tại đây..."
                                value={textVal}
                                onChange={(e) => setP1Answers({ ...p1Answers, [q.id]: e.target.value })}
                                $isValid={isValid}
                                $hasText={!!textVal}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '1.5rem' }}>
                                <div style={{ flex: 1 }}>
                                    {textVal && !isValid && (
                                        <WS.ErrorText>Phải từ 1 đến 5 từ</WS.ErrorText>
                                    )}
                                </div>
                                {textVal && (
                                    <WS.ModernWordBadge $isValid={isValid} $hasText={!!textVal}>
                                        {wordCount}/5 từ
                                    </WS.ModernWordBadge>
                                )}
                            </div>
                        </WS.QuestionItem>
                    );
                })}
            </WS.QuestionsWrapper>
        </div>
    );

    const renderPart2 = () => {
        const wordCount = getWordCount(p2Answer);
        const isValid = isP2Valid(p2Answer);
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <WS.TitleArea>
                    <div>
                        <h2>Giới thiệu bản thân ngắn gọn cho câu lạc bộ</h2>
                        <div className="subtitle">Writing Part 2 • Write in sentences (20 - 30 words)</div>
                    </div>
                </WS.TitleArea>

                <WS.InstructionBox $borderColor="#4f46e5">
                    {mockPart2Question.instruction}
                </WS.InstructionBox>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Text strong style={{ fontSize: '1.05rem' }}>Prompt: {mockPart2Question.prompt}</Text>

                    <WS.ModernTextArea
                        placeholder="Nhập đoạn văn giới thiệu bản thân của bạn tại đây (20 - 30 từ)..."
                        value={p2Answer}
                        onChange={(e) => setP2Answer(e.target.value)}
                        rows={6}
                        $isValid={isValid}
                        $hasText={!!p2Answer}
                    />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '1.5rem' }}>
                        <div style={{ flex: 1 }}>
                            {p2Answer && !isValid && (
                                <WS.ErrorText>
                                    {wordCount < 20 ? `Cần thêm ${20 - wordCount} từ` : `Cần bớt ${wordCount - 30} từ`}
                                </WS.ErrorText>
                            )}
                        </div>
                        {p2Answer && (
                            <WS.ModernWordBadge $isValid={isValid} $hasText={!!p2Answer}>
                                {wordCount} / 20-30 từ
                            </WS.ModernWordBadge>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderPart3 = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <WS.TitleArea>
                <div>
                    <h2>Tương tác trong nhóm chat/diễn đàn câu lạc bộ</h2>
                    <div className="subtitle">Writing Part 3 • Chat with other members (30 - 40 words per answer)</div>
                </div>
            </WS.TitleArea>

            <WS.InstructionBox $borderColor="#f59e0b">
                You are speaking to fellow members of the Art club in a group chat. Respond to them in full sentences (30-40 words per answer).
            </WS.InstructionBox>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {mockPart3Messages.map((m) => {
                    const textVal = p3Answers[m.id] || '';
                    const wordCount = getWordCount(textVal);
                    const isValid = isP3Valid(textVal);
                    const avatarColor = m.sender === 'Sam' ? '#3b82f6' : m.sender === 'Jenny' ? '#ec4899' : '#f59e0b';

                    return (
                        <div key={m.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <WS.ChatHeader>
                                <WS.AvatarBadge $bgColor={avatarColor}>
                                    {m.avatar}
                                </WS.AvatarBadge>
                                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{m.sender}</span>
                            </WS.ChatHeader>

                            <WS.ChatMessageText style={{ maxWidth: '85%', alignSelf: 'flex-start' }}>
                                {m.messageText}
                            </WS.ChatMessageText>

                            <WS.ModernTextArea
                                placeholder={`Trả lời cho ${m.sender} tại đây (30 - 40 từ)...`}
                                value={textVal}
                                onChange={(e) => setP3Answers({ ...p3Answers, [m.id]: e.target.value })}
                                rows={4}
                                $isValid={isValid}
                                $hasText={!!textVal}
                                style={{ minHeight: '6rem' }}
                            />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '1.5rem' }}>
                                <div style={{ flex: 1 }}>
                                    {textVal && !isValid && (
                                        <WS.ErrorText>
                                            {wordCount < 30 ? `Cần thêm ${30 - wordCount} từ` : `Cần bớt ${wordCount - 40} từ`}
                                        </WS.ErrorText>
                                    )}
                                </div>
                                {textVal && (
                                    <WS.ModernWordBadge $isValid={isValid} $hasText={!!textVal}>
                                        {wordCount} / 30-40 từ
                                    </WS.ModernWordBadge>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderPart4 = () => {
        const informalCount = getWordCount(p4Informal);
        const formalCount = getWordCount(p4Formal);
        const informalValid = isP4InformalValid(p4Informal);
        const formalValid = isP4FormalValid(p4Formal);

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <WS.TitleArea>
                    <div>
                        <h2>Formal & Informal Email Writing</h2>
                        <div className="subtitle">Writing Part 4 • Respond to a club situation</div>
                    </div>
                </WS.TitleArea>

                <WS.SituationBox>
                    <div style={{ fontWeight: 800, marginBottom: '0.25rem', fontSize: '0.75rem', textTransform: 'uppercase' }}>Situation:</div>
                    <div style={{ whiteSpace: 'pre-line' }}>{mockPart4Scenario.situation}</div>
                </WS.SituationBox>

                <WS.EmailWorkspaceGrid>
                    <WS.EmailCard>
                        <WS.EmailHeaderLabel $color="#4f46e5">1. Informal Email</WS.EmailHeaderLabel>
                        <WS.EmailPromptText>{mockPart4Scenario.informalPrompt}</WS.EmailPromptText>
                        <WS.ModernTextArea
                            placeholder="Hi Sarah, I'm so excited about..."
                            value={p4Informal}
                            onChange={(e) => setP4Informal(e.target.value)}
                            rows={10}
                            $isValid={informalValid}
                            $hasText={!!p4Informal}
                            style={{ minHeight: '12rem' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '1.5rem' }}>
                            <div style={{ flex: 1 }}>
                                {p4Informal && !informalValid && (
                                    <WS.ErrorText>Phải từ 40 đến 60 từ</WS.ErrorText>
                                )}
                            </div>
                            {p4Informal && (
                                <WS.ModernWordBadge $isValid={informalValid} $hasText={!!p4Informal}>
                                    {informalCount} / 50 từ
                                </WS.ModernWordBadge>
                            )}
                        </div>
                    </WS.EmailCard>

                    <WS.EmailCard>
                        <WS.EmailHeaderLabel $color="#9333ea">2. Formal Email</WS.EmailHeaderLabel>
                        <WS.EmailPromptText>{mockPart4Scenario.formalPrompt}</WS.EmailPromptText>
                        <WS.ModernTextArea
                            placeholder="Dear President, I am writing to suggest..."
                            value={p4Formal}
                            onChange={(e) => setP4Formal(e.target.value)}
                            rows={10}
                            $isValid={formalValid}
                            $hasText={!!p4Formal}
                            style={{ minHeight: '12rem' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '1.5rem' }}>
                            <div style={{ flex: 1 }}>
                                {p4Formal && !formalValid && (
                                    <WS.ErrorText>Phải từ 120 đến 150 từ</WS.ErrorText>
                                )}
                            </div>
                            {p4Formal && (
                                <WS.ModernWordBadge $isValid={formalValid} $hasText={!!p4Formal}>
                                    {formalCount} / 120-150 từ
                                </WS.ModernWordBadge>
                            )}
                        </div>
                    </WS.EmailCard>
                </WS.EmailWorkspaceGrid>
            </div>
        );
    };

    return (
        <S.SectionWrapper>
            <Row gutter={24}>
                <Col lg={19} md={24}>
                    <S.ContentCard style={{ padding: '0 1rem' }}>
                        {activePart === 1 && renderPart1()}
                        {activePart === 2 && renderPart2()}
                        {activePart === 3 && renderPart3()}
                        {activePart === 4 && renderPart4()}
                    </S.ContentCard>
                </Col>

                <Col lg={5} md={24}>
                    <ExamQuestionNavigator
                        sections={navSections}
                        answers={getAnswersMap()}
                        currentQuestion={activePart}
                        onNavigate={(q) => setActivePart(q)}
                        renderItem={(q) => `Part ${q}`}
                    />
                </Col>
            </Row>
        </S.SectionWrapper>
    );
});

export default WritingSection;
