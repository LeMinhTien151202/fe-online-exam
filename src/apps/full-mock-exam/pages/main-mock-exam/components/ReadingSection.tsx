import { Col,Radio,Row,Select,Typography } from 'antd';
import React,{ useState } from 'react';
import { ExamQuestionNavigator,NavSection } from '../../../../../shared/components/ExamQuestionNavigator';
import {
initialP2Sentences,
ISentence,
p1QuestionsData,
p2FixedSentence,
p3Opinions,
p3Questions,
p4Headings,
p4Paragraphs
} from '../../../../reading-practice/pages/reading-mock-test/services/data';
import * as RS from '../styles/reading.styles';
import * as S from '../styles/shared.styles';

const { Text, Paragraph } = Typography;

export interface ReadingHandle {
    next: () => boolean;
    prev: () => boolean;
}

interface ReadingSectionProps {
    onProgressUpdate?: (answered: number, part: number, question: number) => void;
}

const ReadingSection = React.forwardRef<ReadingHandle, ReadingSectionProps>(({ onProgressUpdate }, ref) => {
    const [activeQuestionNum, setActiveQuestionNum] = useState(1);
    const [p1Answers, setP1Answers] = useState<Record<number, string>>({});
    const [p2Slots, setP2Slots] = useState<Record<number, ISentence | null>>({
        1: null, 2: null, 3: null, 4: null, 5: null
    });
    const [p2Pool, setP2Pool] = useState<ISentence[]>(initialP2Sentences);
    const [p3Answers, setP3Answers] = useState<Record<number, string>>({});
    const [p4Answers, setP4Answers] = useState<Record<number, string>>({});

    const [draggedItem, setDraggedItem] = useState<ISentence | null>(null);
    const [draggedFromSlot, setDraggedFromSlot] = useState<number | null>(null);
    const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);

    const isSubmitted = false;

    const activePart = activeQuestionNum <= 5 ? 1 : activeQuestionNum <= 10 ? 2 : activeQuestionNum <= 17 ? 3 : 4;

    React.useImperativeHandle(ref, () => ({
        next: () => {
            if (activeQuestionNum < 24) {
                // Reading navigation logic
                if (activeQuestionNum <= 5) {
                    if (activeQuestionNum === 5) setActiveQuestionNum(6);
                    else setActiveQuestionNum(activeQuestionNum + 1);
                } else if (activeQuestionNum <= 10) {
                    if (activeQuestionNum === 10) setActiveQuestionNum(11);
                    else setActiveQuestionNum(activeQuestionNum + 1);
                } else if (activeQuestionNum <= 17) {
                    if (activeQuestionNum === 17) setActiveQuestionNum(18);
                    else setActiveQuestionNum(activeQuestionNum + 1);
                } else {
                    setActiveQuestionNum(activeQuestionNum + 1);
                }
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

    const navSections: NavSection[] = [
        { label: 'Part 1: Điền từ (1 - 5)', questions: [1, 2, 3, 4, 5] },
        { label: 'Part 2: Sắp xếp câu (6 - 10)', questions: [6, 7, 8, 9, 10] },
        { label: 'Part 3: Ghép ý kiến (11 - 17)', questions: [11, 12, 13, 14, 15, 16, 17] },
        { label: 'Part 4: Gán tiêu đề (18 - 24)', questions: [18, 19, 20, 21, 22, 23, 24] }
    ];

    const getAnswersMap = () => {
        const map: Record<number, string> = {};
        Object.entries(p1Answers).forEach(([k, v]) => { if (v) map[Number(k)] = v; });
        Object.entries(p2Slots).forEach(([k, v]) => { if (v) map[Number(k) + 5] = 'answered'; });
        Object.entries(p3Answers).forEach(([k, v]) => { if (v) map[Number(k) + 10] = v; });
        Object.entries(p4Answers).forEach(([k, v]) => { if (v) map[Number(k) + 17] = v; });
        return map;
    };

    const updateProgress = () => {
        const answered = Object.keys(getAnswersMap()).length;
        onProgressUpdate?.(answered, activePart, activeQuestionNum);
    };

    React.useEffect(() => {
        updateProgress();
    }, [activeQuestionNum, p1Answers, p2Slots, p3Answers, p4Answers]);

    // PART 1
    const renderPart1 = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <S.TitleArea>
                <h2>Part 1: Hoàn thành câu</h2>
                <div className="subtitle">Select the correct word from the dropdown to complete each sentence.</div>
                <RS.TipBox style={{ marginTop: '8px' }}>
                    💡 Tip: Double-click vào từ tiếng Anh bất kỳ để tra nghĩa
                </RS.TipBox>
            </S.TitleArea>

            {p1QuestionsData.map((q) => {
                const parts = q.sentence.split('_______');
                return (
                    <RS.QuestionRow key={q.id}>
                        <RS.BadgeNumber>{q.id}</RS.BadgeNumber>
                        <RS.QuestionText>
                            {parts[0]}
                            <RS.InlineSentenceSelect
                                placeholder="Select option"
                                onChange={(val) => {
                                    setP1Answers(prev => ({ ...prev, [q.id]: val as string }));
                                }}
                                value={p1Answers[q.id]}
                                $hasValue={!!p1Answers[q.id]}
                                disabled={isSubmitted}
                            >
                                {q.options.map(opt => (
                                    <Select.Option key={opt} value={opt}>{opt}</Select.Option>
                                ))}
                            </RS.InlineSentenceSelect>
                            {parts[1]}
                        </RS.QuestionText>
                    </RS.QuestionRow>
                );
            })}
        </div>
    );

    // PART 2 Logic
    const handleDragStart = (item: ISentence, fromSlot: number | null = null) => {
        setDraggedItem(item);
        setDraggedFromSlot(fromSlot);
    };

    const handleDrop = (slotId: number) => {
        if (!draggedItem) return;
        const currentInSlot = p2Slots[slotId];
        if (currentInSlot) {
            setP2Pool(prev => [...prev, currentInSlot]);
        }
        if (draggedFromSlot !== null) {
            setP2Slots(prev => ({ ...prev, [draggedFromSlot]: null }));
        } else {
            setP2Pool(prev => prev.filter(item => item.id !== draggedItem.id));
        }
        setP2Slots(prev => ({ ...prev, [slotId]: draggedItem }));
        setDraggedItem(null);
        setDraggedFromSlot(null);
        setDragOverSlot(null);
    };

    const handleAutoPlace = (item: ISentence) => {
        const firstEmptySlot = Object.keys(p2Slots).find(key => !p2Slots[Number(key)]);
        if (firstEmptySlot) {
            const slotNum = Number(firstEmptySlot);
            setP2Slots(prev => ({ ...prev, [slotNum]: item }));
            setP2Pool(prev => prev.filter(p => p.id !== item.id));
        }
    };

    const renderPart2 = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <S.TitleArea>
                <h2>Part 2: Sắp xếp câu</h2>
                <div className="subtitle">Rearrange the sentences into the correct order to complete the text.</div>
            </S.TitleArea>

            <RS.TwoColumnLayout>
                <RS.Part2Column>
                    <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                        Khung văn bản hoàn chỉnh
                    </div>
                    <RS.StoryContainer>
                        <RS.FixedSentenceCard>{p2FixedSentence}</RS.FixedSentenceCard>
                        {[1, 2, 3, 4, 5].map((idx) => {
                            const item = p2Slots[idx];
                            return (
                                <div
                                    key={idx}
                                    onDragOver={(e) => { e.preventDefault(); setDragOverSlot(idx); }}
                                    onDragLeave={() => setDragOverSlot(null)}
                                    onDrop={() => handleDrop(idx)}
                                >
                                    {item ? (
                                        <RS.PlacedItemCard
                                            draggable
                                            onDragStart={() => handleDragStart(item, idx)}
                                        >
                                            <span className="text">
                                                <span style={{ color: '#94a3b8', marginRight: '6px', fontWeight: 'bold' }}>({idx})</span>
                                                {item.text}
                                            </span>
                                            <button className="btn-remove" onClick={() => {
                                                setP2Slots(prev => ({ ...prev, [idx]: null }));
                                                setP2Pool(prev => [...prev, item]);
                                            }}>✕</button>
                                        </RS.PlacedItemCard>
                                    ) : (
                                        <RS.EmptySlotDropzone $isOver={dragOverSlot === idx}>
                                            Kéo thả câu vào vị trí số ({idx})
                                        </RS.EmptySlotDropzone>
                                    )}
                                </div>
                            );
                        })}
                    </RS.StoryContainer>
                </RS.Part2Column>

                <RS.Part2Column>
                    <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                        Kho câu hỏi lựa chọn
                    </div>
                    <RS.OptionsPool>
                        {p2Pool.map((item) => (
                            <RS.DraggableCard
                                key={item.id}
                                draggable
                                onDragStart={() => handleDragStart(item, null)}
                                onClick={() => handleAutoPlace(item)}
                            >
                                <RS.DragGripHandle>⋮⋮</RS.DragGripHandle>
                                <RS.DraggableText>{item.text}</RS.DraggableText>
                            </RS.DraggableCard>
                        ))}
                    </RS.OptionsPool>
                </RS.Part2Column>
            </RS.TwoColumnLayout>
        </div>
    );

    // PART 3
    const renderPart3 = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <S.TitleArea>
                <h2>Part 3: Ghép ý kiến</h2>
                <div className="subtitle">Read the opinions of the four people and match them to the statements.</div>
            </S.TitleArea>

            <RS.TwoColumnLayout $ratio="4.5fr 5.5fr">
                <RS.Part2Column style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '12px' }}>
                    {p3Opinions.map(person => (
                        <RS.PersonCard key={person.id}>
                            <RS.PersonHeader>
                                <RS.PersonAvatar $color={person.color}>{person.id}</RS.PersonAvatar>
                                <Text strong style={{ fontSize: '1rem' }}>{person.name}</Text>
                            </RS.PersonHeader>
                            <Paragraph style={{ margin: 0, color: '#475569' }}>{person.text}</Paragraph>
                        </RS.PersonCard>
                    ))}
                </RS.Part2Column>

                <RS.Part2Column style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '12px' }}>
                    {p3Questions.map((q, idx) => (
                        <RS.StatementCard
                            key={q.id}
                            $isAnswered={!!p3Answers[idx + 1]}
                        >
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <RS.BadgeNumber style={{ backgroundColor: p3Answers[idx + 1] ? '#2563eb' : '#eff6ff', color: p3Answers[idx + 1] ? 'white' : '#244b80', border: p3Answers[idx + 1] ? 'none' : '1px solid #dbeafe' }}>{idx + 11}</RS.BadgeNumber>
                                <div style={{ flex: 1 }}>
                                    <Text strong style={{ display: 'block', marginBottom: '0.5rem' }}>{q.text}</Text>
                                    <RS.StyledRadioGroup
                                        value={p3Answers[idx + 1]}
                                        onChange={(e) => setP3Answers(prev => ({ ...prev, [idx + 1]: e.target.value }))}
                                    >
                                        <Radio.Button value="A">A</Radio.Button>
                                        <Radio.Button value="B">B</Radio.Button>
                                        <Radio.Button value="C">C</Radio.Button>
                                        <Radio.Button value="D">D</Radio.Button>
                                    </RS.StyledRadioGroup>
                                </div>
                            </div>
                        </RS.StatementCard>
                    ))}
                </RS.Part2Column>
            </RS.TwoColumnLayout>
        </div>
    );

    // PART 4
    const renderPart4 = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <S.TitleArea>
                <h2>Part 4: Gán tiêu đề</h2>
                <div className="subtitle">Read the long text and match the correct headings to the paragraphs.</div>
            </S.TitleArea>

            <RS.TwoColumnLayout $ratio="5.5fr 4.5fr">
                <RS.Part2Column style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '12px' }}>
                    {p4Paragraphs.map(p => (
                        <RS.ParagraphWrapper key={p.num}>
                            <RS.ParagraphNumber>{p.num}</RS.ParagraphNumber>
                            <Paragraph style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.7 }}>{p.text}</Paragraph>
                        </RS.ParagraphWrapper>
                    ))}
                </RS.Part2Column>

                <RS.Part2Column style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '12px' }}>
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                        <RS.QuestionSlot
                            key={num}
                            $isAnswered={!!p4Answers[num]}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <Text strong>Đoạn văn {num}:</Text>
                                <Select
                                    placeholder="Chọn tiêu đề..."
                                    style={{ width: '100%' }}
                                    value={p4Answers[num]}
                                    onChange={(val) => setP4Answers(prev => ({ ...prev, [num]: val }))}
                                    allowClear
                                >
                                    {p4Headings.map(h => (
                                        <Select.Option key={h.value} value={h.value}>{h.label}</Select.Option>
                                    ))}
                                </Select>
                            </div>
                        </RS.QuestionSlot>
                    ))}
                </RS.Part2Column>
            </RS.TwoColumnLayout>
        </div>
    );

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
                        currentQuestion={activeQuestionNum}
                        onNavigate={(q) => setActiveQuestionNum(q)}
                        isSubmitted={isSubmitted}
                    />
                </Col>
            </Row>
        </S.SectionWrapper>
    );
});

export default ReadingSection;
