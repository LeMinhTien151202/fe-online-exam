import { CaretRightOutlined,PauseOutlined } from '@ant-design/icons';
import { Col,Row,Select,Typography } from 'antd';
import React,{ forwardRef,useImperativeHandle,useMemo,useRef,useState } from 'react';
import { ExamQuestionNavigator,NavSection } from '../../../../../shared/components/ExamQuestionNavigator';
import { ListeningExamData } from '../../../../listening-practice/services/listeningExamMapper';
import * as LS from '../styles/listening.styles';
import * as S from '../styles/shared.styles';

const { Text } = Typography;

export interface ListeningHandle {
    next: () => boolean;
    prev: () => boolean;
}

interface ListeningSectionProps {
    data: ListeningExamData;
    onProgressUpdate?: (answered: number, part: number, question: number) => void;
}

// Player audio thật (mediaUrl từ API)
const AudioPlayer: React.FC<{ src: string | null }> = ({ src }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = useState(false);

    if (!src) {
        return (
            <LS.PlayerWrapper>
                <LS.StatusText>Chưa có file audio cho phần này.</LS.StatusText>
            </LS.PlayerWrapper>
        );
    }

    const toggle = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (playing) { audio.pause(); setPlaying(false); }
        else { audio.play(); setPlaying(true); }
    };

    return (
        <LS.PlayerWrapper>
            <audio ref={audioRef} src={src} onEnded={() => setPlaying(false)} />
            <LS.PlayButton icon={playing ? <PauseOutlined /> : <CaretRightOutlined />} onClick={toggle}>
                {playing ? 'Pause' : 'Play'}
            </LS.PlayButton>
            <LS.StatusText>Nhấn Play để nghe audio</LS.StatusText>
        </LS.PlayerWrapper>
    );
};

// Đơn vị hiển thị theo bài/câu:
// P1: mỗi câu MC 1 unit | P2: mỗi bài (4 speakers) 1 unit | P3: mỗi bài (statements) 1 unit | P4: mỗi bài nghe 1 unit
interface Unit {
    part: number;
    label: string;
    p1Index?: number;
    p2Index?: number;
    p3Index?: number;
    p4Index?: number;
}

const ListeningSection = forwardRef<ListeningHandle, ListeningSectionProps>(({ data, onProgressUpdate }, ref) => {
    const units = useMemo<Unit[]>(() => {
        const list: Unit[] = [];
        data.part1.forEach((_, i) => list.push({ part: 1, label: `P1 câu ${i + 1}`, p1Index: i }));
        data.part2.forEach((_, i) => list.push({ part: 2, label: `P2 bài ${i + 1}`, p2Index: i }));
        data.part3.forEach((_, i) => list.push({ part: 3, label: `P3 bài ${i + 1}`, p3Index: i }));
        data.part4.forEach((_, i) => list.push({ part: 4, label: `P4 bài ${i + 1}`, p4Index: i }));
        return list;
    }, [data]);

    const [currentUnit, setCurrentUnit] = useState(1); // 1-based
    // key answers: chuỗi định danh duy nhất "p{part}-..." để không đè nhau
    const [answers, setAnswers] = useState<Record<string, string>>({});

    const unit = units[currentUnit - 1];
    const currentPart = unit?.part ?? 1;

    const navSections: NavSection[] = useMemo(() => {
        const sections: NavSection[] = [];
        let offset = 0;
        const partsMeta: { part: number; count: number; label: string }[] = [
            { part: 1, count: data.part1.length, label: 'Part 1: Câu hỏi ngắn' },
            { part: 2, count: data.part2.length, label: 'Part 2: Ghép người nói' },
            { part: 3, count: data.part3.length, label: 'Part 3: Ai nói gì' },
            { part: 4, count: data.part4.length, label: 'Part 4: Bài nghe dài' },
        ];
        partsMeta.forEach((meta) => {
            if (meta.count > 0) {
                sections.push({
                    label: `${meta.label} (${offset + 1} - ${offset + meta.count})`,
                    questions: Array.from({ length: meta.count }, (_, i) => offset + i + 1),
                });
                offset += meta.count;
            }
        });
        return sections;
    }, [data]);

    // Unit "đã trả lời": P1 chọn xong; P2/P3/P4 trả lời đủ mọi ý trong bài
    const navAnswers = useMemo(() => {
        const map: Record<number, string> = {};
        units.forEach((u, i) => {
            let done = false;
            if (u.part === 1 && u.p1Index != null) {
                done = !!answers[`p1-${u.p1Index}`];
            } else if (u.part === 2 && u.p2Index != null) {
                const set = data.part2[u.p2Index];
                done = Array.from({ length: set.speakerCount }, (_, s) => `p2-${u.p2Index}-${s + 1}`)
                    .every((k) => !!answers[k]);
            } else if (u.part === 3 && u.p3Index != null) {
                const set = data.part3[u.p3Index];
                done = set.statements.every((st) => !!answers[`p3-${u.p3Index}-${st.id}`]);
            } else if (u.part === 4 && u.p4Index != null) {
                const group = data.part4[u.p4Index];
                done = group.subQuestions.every((sq) => !!answers[`p4-${u.p4Index}-${sq.id}`]);
            }
            if (done) map[i + 1] = 'answered';
        });
        return map;
    }, [units, answers, data]);

    useImperativeHandle(ref, () => ({
        next: () => {
            if (currentUnit < units.length) {
                setCurrentUnit(prev => prev + 1);
                return true;
            }
            return false;
        },
        prev: () => {
            if (currentUnit > 1) {
                setCurrentUnit(prev => prev - 1);
                return true;
            }
            return false;
        }
    }), [currentUnit, units.length]);

    const handleSelect = (key: string, val: string) => {
        setAnswers(prev => ({ ...prev, [key]: val }));
    };

    React.useEffect(() => {
        onProgressUpdate?.(Object.keys(answers).length, currentPart, currentUnit);
    }, [answers, currentPart, currentUnit, onProgressUpdate]);

    const renderContent = () => {
        if (!unit) return null;

        if (unit.part === 1 && unit.p1Index != null) {
            const q = data.part1[unit.p1Index];
            const key = `p1-${unit.p1Index}`;
            return (
                <>
                    <S.TitleArea>
                        <h2>Listening</h2>
                        <div className="subtitle">Part 1 • Câu {unit.p1Index + 1} / {data.part1.length}</div>
                    </S.TitleArea>
                    <S.InstructionText>Nghe audio và trả lời câu hỏi dưới đây:</S.InstructionText>
                    <AudioPlayer src={q.mediaUrl} />
                    <div style={{ marginTop: '2rem' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#1e293b' }}>
                            {unit.p1Index + 1}. {q.questionText}
                        </div>
                        {q.options.map((opt, i) => (
                            <S.OptionCard key={i} $selected={answers[key] === opt} onClick={() => handleSelect(key, opt)}>
                                <div className="option-letter">{String.fromCharCode(65 + i)}</div>
                                <div className="option-text">{opt}</div>
                            </S.OptionCard>
                        ))}
                    </div>
                </>
            );
        }

        if (unit.part === 2 && unit.p2Index != null) {
            const set = data.part2[unit.p2Index];
            return (
                <>
                    <S.TitleArea>
                        <h2>Ghép người nói</h2>
                        <div className="subtitle">Part 2 • Bài {unit.p2Index + 1} / {data.part2.length}</div>
                    </S.TitleArea>
                    <S.InstructionText>{set.instruction}</S.InstructionText>
                    <AudioPlayer src={set.mediaUrl} />
                    <div style={{ marginTop: '2rem' }}>
                        {Array.from({ length: set.speakerCount }, (_, s) => s + 1).map((speaker) => {
                            const key = `p2-${unit.p2Index}-${speaker}`;
                            return (
                                <div key={speaker} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #f1f5f9' }}>
                                    <Text strong style={{ fontSize: '1rem', color: '#1e293b' }}>Người nói {speaker}</Text>
                                    <Select
                                        placeholder="Chọn đáp án"
                                        style={{ width: 320 }}
                                        onChange={(v) => handleSelect(key, v)}
                                        value={answers[key]}
                                        options={set.options}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </>
            );
        }

        if (unit.part === 3 && unit.p3Index != null) {
            const set = data.part3[unit.p3Index];
            return (
                <>
                    <S.TitleArea>
                        <h2>Ai nói gì?</h2>
                        <div className="subtitle">Part 3 • Bài {unit.p3Index + 1} / {data.part3.length}</div>
                    </S.TitleArea>
                    <S.InstructionText>{set.instruction}</S.InstructionText>
                    <AudioPlayer src={set.mediaUrl} />
                    <div style={{ marginTop: '2rem' }}>
                        {set.statements.map((st) => {
                            const key = `p3-${unit.p3Index}-${st.id}`;
                            return (
                                <LS.StatementRow key={st.id}>
                                    <div className="statement-number">{st.id}.</div>
                                    <div className="statement-text">{st.text}</div>
                                    <LS.StyledSelect
                                        placeholder="Select"
                                        onChange={(v) => handleSelect(key, v as string)}
                                        value={answers[key]}
                                        $hasValue={!!answers[key]}
                                        options={[
                                            { value: 'MAN', label: 'The Man' },
                                            { value: 'WOMAN', label: 'The Woman' },
                                            { value: 'BOTH', label: 'Both' }
                                        ]}
                                    />
                                </LS.StatementRow>
                            );
                        })}
                    </div>
                </>
            );
        }

        if (unit.part === 4 && unit.p4Index != null) {
            const group = data.part4[unit.p4Index];
            return (
                <>
                    <S.TitleArea>
                        <h2>{group.title}</h2>
                        <div className="subtitle">Part 4 • Bài {unit.p4Index + 1} / {data.part4.length}</div>
                    </S.TitleArea>
                    <S.InstructionText>{group.instruction}</S.InstructionText>
                    <AudioPlayer src={group.mediaUrl} />
                    <div style={{ marginTop: '2rem' }}>
                        {group.subQuestions.map((sq) => {
                            const key = `p4-${unit.p4Index}-${sq.id}`;
                            return (
                                <div key={sq.id} style={{ marginBottom: '2.5rem' }}>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', color: '#1e293b' }}>
                                        Câu {sq.id}: {sq.title}
                                    </div>
                                    {sq.options.map((opt, i) => (
                                        <S.OptionCard key={i} $selected={answers[key] === opt} onClick={() => handleSelect(key, opt)}>
                                            <div className="option-letter">{String.fromCharCode(65 + i)}</div>
                                            <div className="option-text">{opt}</div>
                                        </S.OptionCard>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </>
            );
        }

        return null;
    };

    return (
        <S.SectionWrapper>
            <Row gutter={24}>
                <Col lg={20} md={24}>
                    <S.ContentCard>
                        {renderContent()}
                    </S.ContentCard>
                </Col>

                <Col lg={4} md={24}>
                    <ExamQuestionNavigator
                        sections={navSections}
                        answers={navAnswers}
                        currentQuestion={currentUnit}
                        onNavigate={setCurrentUnit}
                    />
                </Col>
            </Row>
        </S.SectionWrapper>
    );
});

export default ListeningSection;
