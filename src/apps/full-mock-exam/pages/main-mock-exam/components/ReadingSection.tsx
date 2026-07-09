import { Col,Radio,Row,Select,Typography } from 'antd';
import React,{ useMemo,useState } from 'react';
import { ExamQuestionNavigator,NavSection } from '../../../../../shared/components/ExamQuestionNavigator';
import { Part2Sentence } from '../../../../reading-practice/services/mappers';
import { ReadingExamData } from '../../../services/mockExamMapper';
import * as RS from '../styles/reading.styles';
import * as S from '../styles/shared.styles';

const { Text, Paragraph } = Typography;

export interface ReadingHandle {
    next: () => boolean;
    prev: () => boolean;
}

interface ReadingSectionProps {
    data: ReadingExamData;
    onProgressUpdate?: (answered: number, part: number, question: number) => void;
}

// Reading bộ đề = 5 phần API: P1 gap-fill | P2 & P3 ordering (cùng dạng) | P4 speaker-match | P5 heading-match
const ReadingSection = React.forwardRef<ReadingHandle, ReadingSectionProps>(({ data, onProgressUpdate }, ref) => {
    // Các phần có dữ liệu, theo thứ tự 1..5
    const availableParts = useMemo(() => {
        const arr: number[] = [];
        if (data.part1.length > 0) arr.push(1);
        if (data.orderingP2) arr.push(2);
        if (data.orderingP3) arr.push(3);
        if (data.speakerP4) arr.push(4);
        if (data.headingP5) arr.push(5);
        return arr;
    }, [data]);

    const [activePart, setActivePart] = useState(availableParts[0] ?? 1);

    // P1: gap answers (gapId -> đáp án)
    const [p1Answers, setP1Answers] = useState<Record<number, string>>({});
    // P2/P3 ordering: slots + pool riêng từng phần
    const [p2Slots, setP2Slots] = useState<Record<number, Part2Sentence | null>>({});
    const [p2Pool, setP2Pool] = useState<Part2Sentence[]>([]);
    const [p3Slots, setP3Slots] = useState<Record<number, Part2Sentence | null>>({});
    const [p3Pool, setP3Pool] = useState<Part2Sentence[]>([]);
    // P4 speaker-match, P5 heading-match
    const [p4Answers, setP4Answers] = useState<Record<number, string>>({});
    const [p5Answers, setP5Answers] = useState<Record<number, string>>({});

    // Kéo thả dùng chung cho P2/P3
    const [draggedItem, setDraggedItem] = useState<Part2Sentence | null>(null);
    const [draggedFromSlot, setDraggedFromSlot] = useState<number | null>(null);
    const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
    const [dragPart, setDragPart] = useState<number>(2);

    // Khởi tạo pool khi có dữ liệu
    React.useEffect(() => {
        if (data.orderingP2) {
            const slots: Record<number, Part2Sentence | null> = {};
            data.orderingP2.initialSentences.forEach((_, i) => { slots[i + 1] = null; });
            setP2Slots(slots);
            setP2Pool([...data.orderingP2.initialSentences]);
        }
    }, [data.orderingP2]);

    React.useEffect(() => {
        if (data.orderingP3) {
            const slots: Record<number, Part2Sentence | null> = {};
            data.orderingP3.initialSentences.forEach((_, i) => { slots[i + 1] = null; });
            setP3Slots(slots);
            setP3Pool([...data.orderingP3.initialSentences]);
        }
    }, [data.orderingP3]);

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

    const PART_LABEL: Record<number, string> = {
        1: 'Part 1: Điền từ',
        2: 'Part 2: Sắp xếp câu',
        3: 'Part 3: Sắp xếp câu',
        4: 'Part 4: Ghép ý kiến',
        5: 'Part 5: Gán tiêu đề',
    };

    const navSections: NavSection[] = useMemo(
        () => availableParts.map((p) => ({ label: PART_LABEL[p], questions: [p] })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [availableParts]
    );

    // Đếm ý đã trả lời + trạng thái hoàn thành từng phần
    const p1Total = data.part1.reduce((s, pd) => s + pd.questions.length, 0);
    const p1Done = Object.keys(p1Answers).length;
    const p2Done = Object.values(p2Slots).filter(Boolean).length;
    const p3Done = Object.values(p3Slots).filter(Boolean).length;
    const p4Done = Object.keys(p4Answers).length;
    const p5Done = Object.keys(p5Answers).length;

    const navAnswers = useMemo(() => {
        const map: Record<number, string> = {};
        if (p1Total > 0 && p1Done >= p1Total) map[1] = 'answered';
        if (data.orderingP2 && p2Done >= data.orderingP2.initialSentences.length) map[2] = 'answered';
        if (data.orderingP3 && p3Done >= data.orderingP3.initialSentences.length) map[3] = 'answered';
        if (data.speakerP4 && p4Done >= data.speakerP4.questions.length) map[4] = 'answered';
        if (data.headingP5 && p5Done >= data.headingP5.paragraphs.length) map[5] = 'answered';
        return map;
    }, [data, p1Total, p1Done, p2Done, p3Done, p4Done, p5Done]);

    React.useEffect(() => {
        const answered = p1Done + p2Done + p3Done + p4Done + p5Done;
        onProgressUpdate?.(answered, activePart, availableParts.indexOf(activePart) + 1);
    }, [p1Done, p2Done, p3Done, p4Done, p5Done, activePart, availableParts, onProgressUpdate]);

    // ===== PART 1: đoạn văn với ô chọn inline =====
    const renderGapSelect = (gapId: number, options: string[]) => (
        <RS.InlineSentenceSelect
            placeholder="Chọn đáp án"
            onChange={(val) => setP1Answers(prev => ({ ...prev, [gapId]: val as string }))}
            value={p1Answers[gapId]}
            dropdownMatchSelectWidth={false}
            $hasValue={!!p1Answers[gapId]}
        >
            {options.map(opt => (
                <Select.Option key={opt} value={opt}>{opt}</Select.Option>
            ))}
        </RS.InlineSentenceSelect>
    );

    const renderPassage = (pd: ReadingExamData['part1'][number], idx: number) => {
        const optionsByGap = new Map(pd.questions.map((q) => [q.id, q.options]));

        if (/___\(\d+\)/.test(pd.content)) {
            const segments = pd.content.split(/___\((\d+)\)/g);
            return (
                <RS.QuestionText key={idx} style={{ whiteSpace: 'pre-line', lineHeight: 2.6 }}>
                    {segments.map((seg, i) =>
                        i % 2 === 1 ? (
                            <React.Fragment key={`gap-${seg}`}>
                                {renderGapSelect(Number(seg), optionsByGap.get(Number(seg)) ?? [])}
                            </React.Fragment>
                        ) : (
                            <React.Fragment key={`text-${i}`}>{seg}</React.Fragment>
                        )
                    )}
                </RS.QuestionText>
            );
        }

        if (/_{2,}/.test(pd.content)) {
            const segments = pd.content.split(/_{2,}/g);
            let blankIdx = -1;
            return (
                <RS.QuestionText key={idx} style={{ whiteSpace: 'pre-line', lineHeight: 2.6 }}>
                    {segments.map((seg, i) => {
                        const nodes = [<React.Fragment key={`text-${i}`}>{seg}</React.Fragment>];
                        if (i < segments.length - 1) {
                            blankIdx += 1;
                            const q = pd.questions[blankIdx];
                            if (q) nodes.push(
                                <React.Fragment key={`gap-${q.id}`}>{renderGapSelect(q.id, q.options)}</React.Fragment>
                            );
                        }
                        return nodes;
                    })}
                </RS.QuestionText>
            );
        }

        return (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {pd.content && (
                    <RS.QuestionText style={{ whiteSpace: 'pre-line' }}>{pd.content}</RS.QuestionText>
                )}
                {pd.questions.map((q) => (
                    <RS.QuestionRow key={q.id}>
                        <RS.BadgeNumber>{q.id}</RS.BadgeNumber>
                        <RS.QuestionText>{renderGapSelect(q.id, q.options)}</RS.QuestionText>
                    </RS.QuestionRow>
                ))}
            </div>
        );
    };

    const renderPart1 = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <S.TitleArea>
                <h2>Part 1: Hoàn thành câu</h2>
                <div className="subtitle">Chọn từ đúng từ danh sách để hoàn thành mỗi câu.</div>
            </S.TitleArea>
            {data.part1.map((pd, idx) => renderPassage(pd, idx))}
        </div>
    );

    // ===== PART 2 & 3: ordering kéo thả =====
    const handleDragStart = (part: number, item: Part2Sentence, fromSlot: number | null = null) => {
        setDragPart(part);
        setDraggedItem(item);
        setDraggedFromSlot(fromSlot);
    };

    const slotsFor = (part: number) => (part === 2 ? p2Slots : p3Slots);
    const setSlotsFor = (part: number) => (part === 2 ? setP2Slots : setP3Slots);
    const setPoolFor = (part: number) => (part === 2 ? setP2Pool : setP3Pool);

    const handleDrop = (part: number, slotId: number) => {
        if (!draggedItem || dragPart !== part) return;
        const item = draggedItem;
        const fromSlot = draggedFromSlot;
        const setPool = setPoolFor(part);
        setSlotsFor(part)((prev) => {
            const next = { ...prev };
            const current = next[slotId];
            if (current) setPool((pool) => [...pool, current]);
            if (fromSlot !== null) next[fromSlot] = null;
            else setPool((pool) => pool.filter((it) => it.id !== item.id));
            next[slotId] = item;
            return next;
        });
        setDraggedItem(null);
        setDraggedFromSlot(null);
        setDragOverSlot(null);
    };

    const handleAutoPlace = (part: number, item: Part2Sentence) => {
        const slots = slotsFor(part);
        const firstEmpty = Object.keys(slots).find(k => !slots[Number(k)]);
        if (firstEmpty) {
            const slotNum = Number(firstEmpty);
            setSlotsFor(part)((prev) => ({ ...prev, [slotNum]: item }));
            setPoolFor(part)((pool) => pool.filter(p => p.id !== item.id));
        }
    };

    const handleRemove = (part: number, slotId: number, item: Part2Sentence) => {
        setSlotsFor(part)((prev) => ({ ...prev, [slotId]: null }));
        setPoolFor(part)((pool) => [...pool, item]);
    };

    const renderOrdering = (part: number) => {
        const ordering = part === 2 ? data.orderingP2 : data.orderingP3;
        const slots = slotsFor(part);
        const pool = part === 2 ? p2Pool : p3Pool;
        if (!ordering) return null;
        const count = ordering.initialSentences.length;

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <S.TitleArea>
                    <h2>{PART_LABEL[part]}</h2>
                    <div className="subtitle">Kéo thả các câu vào đúng vị trí để tạo thành đoạn văn hoàn chỉnh.</div>
                </S.TitleArea>

                <RS.TwoColumnLayout>
                    <RS.Part2Column>
                        <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                            Khung văn bản hoàn chỉnh
                        </div>
                        <RS.StoryContainer>
                            {ordering.fixedSentence && <RS.FixedSentenceCard>{ordering.fixedSentence}</RS.FixedSentenceCard>}
                            {Array.from({ length: count }, (_, i) => i + 1).map((idx) => {
                                const item = slots[idx];
                                return (
                                    <div
                                        key={idx}
                                        onDragOver={(e) => { e.preventDefault(); setDragOverSlot(idx); }}
                                        onDragLeave={() => setDragOverSlot(null)}
                                        onDrop={() => handleDrop(part, idx)}
                                    >
                                        {item ? (
                                            <RS.PlacedItemCard
                                                draggable
                                                onDragStart={() => handleDragStart(part, item, idx)}
                                            >
                                                <span className="text">
                                                    <span style={{ color: '#94a3b8', marginRight: '6px', fontWeight: 'bold' }}>({idx})</span>
                                                    {item.text}
                                                </span>
                                                <button className="btn-remove" onClick={() => handleRemove(part, idx, item)}>✕</button>
                                            </RS.PlacedItemCard>
                                        ) : (
                                            <RS.EmptySlotDropzone $isOver={dragPart === part && dragOverSlot === idx}>
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
                            Kho câu (click hoặc kéo vào ô)
                        </div>
                        <RS.OptionsPool>
                            {pool.map((item) => (
                                <RS.DraggableCard
                                    key={item.id}
                                    draggable
                                    onDragStart={() => handleDragStart(part, item, null)}
                                    onClick={() => handleAutoPlace(part, item)}
                                >
                                    <RS.DragGripHandle>⋮⋮</RS.DragGripHandle>
                                    <RS.DraggableText>{item.text}</RS.DraggableText>
                                </RS.DraggableCard>
                            ))}
                            {pool.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '2rem', border: '1.5px dashed #10b981', borderRadius: '0.5rem', background: '#f6fdfa', color: '#059669', fontWeight: 600 }}>
                                    ✓ Đã xếp đủ tất cả câu!
                                </div>
                            )}
                        </RS.OptionsPool>
                    </RS.Part2Column>
                </RS.TwoColumnLayout>
            </div>
        );
    };

    // ===== PART 4: speaker-match =====
    const renderPart4 = () => {
        const p = data.speakerP4;
        if (!p) return null;
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <S.TitleArea>
                    <h2>Part 4: Ghép ý kiến</h2>
                    <div className="subtitle">Đọc quan điểm của những người phát biểu và ghép với các nhận định.</div>
                </S.TitleArea>

                <RS.TwoColumnLayout $ratio="4.5fr 5.5fr">
                    <RS.Part2Column style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '12px' }}>
                        {p.opinions.map(person => (
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
                        {p.questions.map((q, idx) => (
                            <RS.StatementCard
                                key={q.id}
                                $isAnswered={!!p4Answers[q.id]}
                            >
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <RS.BadgeNumber style={{ backgroundColor: p4Answers[q.id] ? '#2563eb' : '#eff6ff', color: p4Answers[q.id] ? 'white' : '#244b80', border: p4Answers[q.id] ? 'none' : '1px solid #dbeafe' }}>{idx + 1}</RS.BadgeNumber>
                                    <div style={{ flex: 1 }}>
                                        <Text strong style={{ display: 'block', marginBottom: '0.5rem' }}>{q.text}</Text>
                                        <RS.StyledRadioGroup
                                            value={p4Answers[q.id]}
                                            onChange={(e) => setP4Answers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                        >
                                            {p.opinions.map((o) => (
                                                <Radio.Button key={o.id} value={o.id}>{o.id}</Radio.Button>
                                            ))}
                                        </RS.StyledRadioGroup>
                                    </div>
                                </div>
                            </RS.StatementCard>
                        ))}
                    </RS.Part2Column>
                </RS.TwoColumnLayout>
            </div>
        );
    };

    // ===== PART 5: heading-match =====
    const renderPart5 = () => {
        const p = data.headingP5;
        if (!p) return null;
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <S.TitleArea>
                    <h2>Part 5: Gán tiêu đề</h2>
                    <div className="subtitle">Đọc văn bản dài và chọn tiêu đề đúng cho từng đoạn văn.</div>
                </S.TitleArea>

                <RS.TwoColumnLayout $ratio="5.5fr 4.5fr">
                    <RS.Part2Column style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '12px' }}>
                        {p.paragraphs.map(pg => (
                            <RS.ParagraphWrapper key={pg.num}>
                                <RS.ParagraphNumber>{pg.num}</RS.ParagraphNumber>
                                <Paragraph style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.7 }}>{pg.text}</Paragraph>
                            </RS.ParagraphWrapper>
                        ))}
                    </RS.Part2Column>

                    <RS.Part2Column style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '12px' }}>
                        {p.paragraphs.map((pg) => (
                            <RS.QuestionSlot
                                key={pg.num}
                                $isAnswered={!!p5Answers[pg.num]}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <Text strong>Đoạn văn {pg.num}:</Text>
                                    <Select
                                        placeholder="Chọn tiêu đề..."
                                        style={{ width: '100%' }}
                                        value={p5Answers[pg.num]}
                                        onChange={(val) => setP5Answers(prev => ({ ...prev, [pg.num]: val }))}
                                        allowClear
                                    >
                                        {p.headings.map(h => (
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
    };

    return (
        <S.SectionWrapper>
            <Row gutter={24}>
                <Col lg={19} md={24}>
                    <S.ContentCard style={{ padding: '0 1rem' }}>
                        {activePart === 1 && renderPart1()}
                        {activePart === 2 && renderOrdering(2)}
                        {activePart === 3 && renderOrdering(3)}
                        {activePart === 4 && renderPart4()}
                        {activePart === 5 && renderPart5()}
                    </S.ContentCard>
                </Col>

                <Col lg={5} md={24}>
                    <ExamQuestionNavigator
                        sections={navSections}
                        answers={navAnswers}
                        currentQuestion={activePart}
                        onNavigate={setActivePart}
                        renderItem={(p) => `P${p}`}
                    />
                </Col>
            </Row>
        </S.SectionWrapper>
    );
});

export default ReadingSection;
