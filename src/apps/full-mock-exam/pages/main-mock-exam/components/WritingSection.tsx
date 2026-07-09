import { Col,Row,Typography } from 'antd';
import React,{ useEffect,useMemo,useState } from 'react';
import { ExamQuestionNavigator,NavSection } from '../../../../../shared/components/ExamQuestionNavigator';
import { WritingPromptItem } from '../../../../writing-practice/services/writingExamMapper';
import * as S from '../styles/shared.styles';
import * as WS from '../styles/writing.styles';

const { Text } = Typography;

export interface WritingHandle {
    next: () => boolean;
    prev: () => boolean;
}

interface WritingSectionProps {
    prompts: WritingPromptItem[];
    onProgressUpdate?: (answered: number, part: number, question: number) => void;
}

const PART_TITLE: Record<number, { title: string; subtitle: string; color: string }> = {
    1: { title: 'Word-level Writing', subtitle: 'Writing Part 1 • Trả lời ngắn cho từng câu', color: '#0284c7' },
    2: { title: 'Short Text Writing', subtitle: 'Writing Part 2 • Viết đoạn văn ngắn', color: '#4f46e5' },
    3: { title: 'Social Network Chat', subtitle: 'Writing Part 3 • Trả lời từng thành viên trong nhóm chat', color: '#f59e0b' },
    4: { title: 'Formal & Informal Email', subtitle: 'Writing Part 4 • Viết 2 email theo tình huống', color: '#9333ea' },
};

const WritingSection = React.forwardRef<WritingHandle, WritingSectionProps>(({ prompts, onProgressUpdate }, ref) => {
    // Các part có dữ liệu (giữ thứ tự 1..4)
    const availableParts = useMemo(
        () => Array.from(new Set(prompts.map((p) => p.partNumber))).sort((a, b) => a - b),
        [prompts]
    );

    const [activePart, setActivePart] = useState(availableParts[0] ?? 1);
    const [answers, setAnswers] = useState<Record<number, string>>({}); // key = prompt.id

    React.useImperativeHandle(ref, () => ({
        next: () => {
            const idx = availableParts.indexOf(activePart);
            if (idx >= 0 && idx < availableParts.length - 1) {
                setActivePart(availableParts[idx + 1]);
                return true;
            }
            return false;
        },
        prev: () => {
            const idx = availableParts.indexOf(activePart);
            if (idx > 0) {
                setActivePart(availableParts[idx - 1]);
                return true;
            }
            return false;
        }
    }), [activePart, availableParts]);

    const getWordCount = (text: string) => {
        if (!text) return 0;
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    };

    const promptsOfPart = (part: number) => prompts.filter((p) => p.partNumber === part);

    const navSections: NavSection[] = useMemo(
        () => availableParts.map((p) => ({ label: `Part ${p}: ${PART_TITLE[p]?.title ?? 'Writing'}`, questions: [p] })),
        [availableParts]
    );

    const navAnswers = useMemo(() => {
        const map: Record<number, string> = {};
        availableParts.forEach((part) => {
            const items = promptsOfPart(part);
            if (items.length > 0 && items.every((p) => !!answers[p.id]?.trim())) map[part] = 'answered';
        });
        return map;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [answers, availableParts, prompts]);

    useEffect(() => {
        const answered = prompts.filter((p) => !!answers[p.id]?.trim()).length;
        onProgressUpdate?.(answered, activePart, availableParts.indexOf(activePart) + 1);
    }, [answers, activePart, availableParts, prompts, onProgressUpdate]);

    const renderPromptInput = (item: WritingPromptItem, rows: number) => {
        const textVal = answers[item.id] || '';
        const wordCount = getWordCount(textVal);
        const isValid = wordCount >= item.minWords && wordCount <= item.maxWords;
        const isShort = item.maxWords <= 5;

        return (
            <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {(item.title || item.prompt) && (
                    <Text strong style={{ fontSize: '1rem', whiteSpace: 'pre-line' }}>
                        {item.title}{item.title && item.prompt ? ': ' : ''}{item.prompt}
                    </Text>
                )}
                {isShort ? (
                    <WS.ModernInput
                        placeholder={`Nhập câu trả lời (${item.minWords} - ${item.maxWords} từ)...`}
                        value={textVal}
                        onChange={(e) => setAnswers(prev => ({ ...prev, [item.id]: e.target.value }))}
                        $isValid={isValid}
                        $hasText={!!textVal}
                    />
                ) : (
                    <WS.ModernTextArea
                        placeholder={`Nhập câu trả lời (${item.minWords} - ${item.maxWords} từ)...`}
                        value={textVal}
                        onChange={(e) => setAnswers(prev => ({ ...prev, [item.id]: e.target.value }))}
                        rows={rows}
                        $isValid={isValid}
                        $hasText={!!textVal}
                    />
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '1.5rem' }}>
                    <div style={{ flex: 1 }}>
                        {textVal && !isValid && (
                            <WS.ErrorText>
                                {wordCount < item.minWords
                                    ? `Cần thêm ${item.minWords - wordCount} từ`
                                    : `Cần bớt ${wordCount - item.maxWords} từ`}
                            </WS.ErrorText>
                        )}
                    </div>
                    {textVal && (
                        <WS.ModernWordBadge $isValid={isValid} $hasText={!!textVal}>
                            {wordCount} / {item.minWords}-{item.maxWords} từ
                        </WS.ModernWordBadge>
                    )}
                </div>
            </div>
        );
    };

    const renderPart = (part: number) => {
        const meta = PART_TITLE[part];
        const items = promptsOfPart(part);
        if (items.length === 0) return null;
        const instruction = items[0].instruction;
        const rows = part === 4 ? 10 : part === 3 ? 4 : 6;

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <WS.TitleArea>
                    <div>
                        <h2>{meta?.title}</h2>
                        <div className="subtitle">{meta?.subtitle}</div>
                    </div>
                </WS.TitleArea>

                {instruction && (
                    <WS.InstructionBox $borderColor={meta?.color ?? '#0284c7'}>
                        <span style={{ whiteSpace: 'pre-line' }}>{instruction}</span>
                    </WS.InstructionBox>
                )}

                {part === 4 ? (
                    <WS.EmailWorkspaceGrid>
                        {items.map((item) => (
                            <WS.EmailCard key={item.id}>
                                <WS.EmailHeaderLabel $color={item.title.toLowerCase().includes('informal') ? '#4f46e5' : '#9333ea'}>
                                    {item.title}
                                </WS.EmailHeaderLabel>
                                <WS.EmailPromptText style={{ whiteSpace: 'pre-line' }}>{item.prompt}</WS.EmailPromptText>
                                {renderPromptInput({ ...item, title: '', prompt: '' } as WritingPromptItem, 10)}
                            </WS.EmailCard>
                        ))}
                    </WS.EmailWorkspaceGrid>
                ) : (
                    <WS.QuestionsWrapper>
                        {items.map((item) => renderPromptInput(item, rows))}
                    </WS.QuestionsWrapper>
                )}
            </div>
        );
    };

    return (
        <S.SectionWrapper>
            <Row gutter={24}>
                <Col lg={19} md={24}>
                    <S.ContentCard style={{ padding: '0 1rem' }}>
                        {renderPart(activePart)}
                    </S.ContentCard>
                </Col>

                <Col lg={5} md={24}>
                    <ExamQuestionNavigator
                        sections={navSections}
                        answers={navAnswers}
                        currentQuestion={activePart}
                        onNavigate={setActivePart}
                        renderItem={(q) => `P${q}`}
                    />
                </Col>
            </Row>
        </S.SectionWrapper>
    );
});

export default WritingSection;
