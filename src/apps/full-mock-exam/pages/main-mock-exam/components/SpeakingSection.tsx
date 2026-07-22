import { Col,Row } from 'antd';
import React,{ useMemo,useState } from 'react';
import { ExamQuestionNavigator,NavSection } from '../../../../../shared/components/ExamQuestionNavigator';
import { ISubmitAnswer } from '../../../../../shared/services/student-exam';
import { SpeakingExamData } from '../../../../speaking-practice/services/speakingExamMapper';
import * as S from '../styles/shared.styles';
import * as SS from '../styles/speaking.styles';
import { SpeakingController } from './speaking/SpeakingController';

export interface SpeakingHandle {
    next: () => boolean;
    prev: () => boolean;
    collect: () => ISubmitAnswer[];
}

interface SpeakingSectionProps {
    data: SpeakingExamData;
    onProgressUpdate?: (answered: number, part: number, question: number) => void;
}

// Đơn vị hiển thị: P1 mỗi câu 1 unit; P2/P3 mỗi câu con trong bộ 1 unit; P4 cả bộ (nói 1 lượt) 1 unit
interface SpeakUnit {
    part: number;
    setIndex: number; // index bộ trong part (P1: index câu)
    subIndex: number; // index câu con trong bộ
    label: string;
}

const PART_COLOR: Record<number, string> = { 1: '#0284c7', 2: '#059669', 3: '#d97706', 4: '#7c3aed' };

const SpeakingSection = React.forwardRef<SpeakingHandle, SpeakingSectionProps>(({ data, onProgressUpdate }, ref) => {
    const units = useMemo<SpeakUnit[]>(() => {
        const list: SpeakUnit[] = [];
        data.part1.forEach((_, i) => list.push({ part: 1, setIndex: i, subIndex: 0, label: `P1 câu ${i + 1}` }));
        data.part2.forEach((set, i) => set.questions.forEach((_, j) =>
            list.push({ part: 2, setIndex: i, subIndex: j, label: `P2 bộ ${i + 1} câu ${j + 1}` })));
        data.part3.forEach((set, i) => set.questions.forEach((_, j) =>
            list.push({ part: 3, setIndex: i, subIndex: j, label: `P3 bộ ${i + 1} câu ${j + 1}` })));
        data.part4.forEach((_, i) => list.push({ part: 4, setIndex: i, subIndex: 0, label: `P4 bộ ${i + 1}` }));
        return list;
    }, [data]);

    const [currentUnit, setCurrentUnit] = useState(1); // 1-based
    const [answers, setAnswers] = useState<Record<number, string>>({}); // key = unit number

    const unit = units[currentUnit - 1];
    const activePart = unit?.part ?? 1;

    React.useImperativeHandle(ref, () => ({
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
        },
        // RECORD: P1 mỗi câu = 1 bản ghi -> response = 1 URL.
        // P2/P3: mảng URL theo đúng thứ tự questions (câu chưa ghi = '' để không lệch vị trí).
        // P4: nói cả bộ trong 1 lượt -> lặp lại URL cho từng câu để giữ đúng số phần tử theo questions.
        collect: () => {
            const result: ISubmitAnswer[] = [];
            const unitNum = new Map<string, number>();
            units.forEach((u, i) => unitNum.set(`${u.part}-${u.setIndex}-${u.subIndex}`, i + 1));
            const urlAt = (part: number, setIndex: number, subIndex: number) =>
                answers[unitNum.get(`${part}-${setIndex}-${subIndex}`) ?? -1] ?? '';

            data.part1.forEach((q, i) => {
                if (q.questionId == null) return;
                const url = urlAt(1, i, 0);
                if (url) result.push({ questionId: q.questionId, response: url });
            });

            const collectSets = (part: number, sets: typeof data.part2) => {
                sets.forEach((set, setIndex) => {
                    if (set.questionId == null) return;
                    const response = set.questions.map((_, j) => urlAt(part, setIndex, j));
                    if (response.some((v) => v !== '')) result.push({ questionId: set.questionId, response });
                });
            };
            collectSets(2, data.part2);
            collectSets(3, data.part3);

            data.part4.forEach((set, setIndex) => {
                if (set.questionId == null) return;
                const url = urlAt(4, setIndex, 0);
                if (!url) return;
                result.push({ questionId: set.questionId, response: set.questions.map(() => url) });
            });

            return result;
        },
    }), [currentUnit, units, data, answers]);

    const navSections: NavSection[] = useMemo(() => {
        const sections: NavSection[] = [];
        const labels: Record<number, string> = {
            1: 'Part 1: Cá nhân',
            2: 'Part 2: Miêu tả tranh',
            3: 'Part 3: So sánh tranh',
            4: 'Part 4: Thuyết trình',
        };
        [1, 2, 3, 4].forEach((part) => {
            const nums = units
                .map((u, i) => ({ u, num: i + 1 }))
                .filter(({ u }) => u.part === part)
                .map(({ num }) => num);
            if (nums.length > 0) {
                sections.push({ label: `${labels[part]} (${nums[0]} - ${nums[nums.length - 1]})`, questions: nums });
            }
        });
        return sections;
    }, [units]);

    React.useEffect(() => {
        const answeredCount = Object.values(answers).filter((v) => !!v).length;
        onProgressUpdate?.(answeredCount, activePart, currentUnit);
    }, [answers, activePart, currentUnit, onProgressUpdate]);

    const renderQuestionContent = () => {
        if (!unit) return null;

        if (unit.part === 1) {
            const q = data.part1[unit.setIndex];
            return (
                <SS.QuestionBox $borderColor={PART_COLOR[1]}>
                    <div className="q-badge">Câu hỏi {unit.setIndex + 1}</div>
                    <div className="q-text">{q?.questionText}</div>
                </SS.QuestionBox>
            );
        }

        if (unit.part === 2 || unit.part === 3) {
            const set = (unit.part === 2 ? data.part2 : data.part3)[unit.setIndex];
            if (!set) return null;
            const q = set.questions[unit.subIndex];
            return (
                <SS.SectionColumn>
                    {set.imageUrls.length > 1 ? (
                        <SS.PhotosGrid>
                            {set.imageUrls.map((url, i) => (
                                <SS.ImageWrapper key={i} $height="200px">
                                    <img src={url} alt={`Ảnh ${i + 1}`} />
                                </SS.ImageWrapper>
                            ))}
                        </SS.PhotosGrid>
                    ) : set.imageUrls.length === 1 ? (
                        <SS.ImageWrapper $height="280px">
                            <img src={set.imageUrls[0]} alt="Ảnh đề bài" />
                        </SS.ImageWrapper>
                    ) : null}

                    <SS.QuestionBox $borderColor={PART_COLOR[unit.part]}>
                        <div className="q-badge">
                            {unit.subIndex === 0
                                ? (unit.part === 2 ? 'Mô tả tranh (Describe)' : 'So sánh tranh (Compare)')
                                : 'Câu hỏi mở rộng (Explain)'}
                        </div>
                        <div className="q-text">{q?.questionText}</div>
                    </SS.QuestionBox>
                </SS.SectionColumn>
            );
        }

        // Part 4: cả bộ trả lời trong 1 lượt nói
        const set = data.part4[unit.setIndex];
        if (!set) return null;
        return (
            <SS.SectionColumn>
                {set.imageUrls.length > 0 && (
                    <SS.ImageWrapper $height="240px">
                        <img src={set.imageUrls[0]} alt="Ảnh đề bài" />
                    </SS.ImageWrapper>
                )}
                <SS.QuestionBox $borderColor={PART_COLOR[4]}>
                    <div className="q-badge">Part 4: Trả lời {set.questions.length} câu hỏi trong một bài nói</div>
                    <div className="q-text">
                        {set.questions.map((q, i) => (
                            <div key={q.id} style={{ marginBottom: '0.5rem' }}>{i + 1}. {q.questionText}</div>
                        ))}
                    </div>
                </SS.QuestionBox>
            </SS.SectionColumn>
        );
    };

    const renderRecorder = () => {
        if (!unit) return null;

        // P1: nói ngay 30s; P2/P3/P4: lấy prep/record theo cấu hình bộ
        const timeOf = (): { prepTime: number; recordingTime: number } => {
            if (unit.part === 2 || unit.part === 3) {
                const set = (unit.part === 2 ? data.part2 : data.part3)[unit.setIndex];
                return { prepTime: set?.prepTime ?? 0, recordingTime: set?.recordTime ?? 45 };
            }
            if (unit.part === 4) {
                const set = data.part4[unit.setIndex];
                return { prepTime: set?.prepTime ?? 60, recordingTime: set?.recordTime ?? 120 };
            }
            return { prepTime: 0, recordingTime: 30 };
        };
        const { prepTime, recordingTime } = timeOf();

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                <SpeakingController
                    prepTime={prepTime}
                    recordingTime={recordingTime}
                    statusColor={PART_COLOR[unit.part]}
                    title={`mock-exam-speaking-u${currentUnit}`}
                    uploadPrefix={`speaking/mock/p${unit.part}`}
                    // Chỉ lưu URL CÔNG KHAI đã upload; upload lỗi/không có audio -> '' (coi như chưa trả lời).
                    onCompleted={(url) => setAnswers(prev => ({ ...prev, [currentUnit]: url ?? '' }))}
                />
            </div>
        );
    };

    const getPartTitle = () => {
        switch (activePart) {
            case 1: return { title: 'Personal Information', subtitle: `Part 1 • Câu ${(unit?.setIndex ?? 0) + 1} / ${data.part1.length}` };
            case 2: return { title: 'Describe, Express Opinion & Explain', subtitle: `Part 2 • Bộ ${(unit?.setIndex ?? 0) + 1} / ${data.part2.length}` };
            case 3: return { title: 'Compare & Provide Reasons', subtitle: `Part 3 • Bộ ${(unit?.setIndex ?? 0) + 1} / ${data.part3.length}` };
            case 4: return { title: 'Abstract Topic', subtitle: `Part 4 • Bộ ${(unit?.setIndex ?? 0) + 1} / ${data.part4.length}` };
            default: return { title: '', subtitle: '' };
        }
    };

    const { title, subtitle } = getPartTitle();

    // Sub-tabs: các unit cùng part
    const partUnitNums = units
        .map((u, i) => ({ u, num: i + 1 }))
        .filter(({ u }) => u.part === activePart);

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
                            {partUnitNums.map(({ num }, i) => (
                                <SS.SubTab
                                    key={num}
                                    $active={currentUnit === num}
                                    $color={PART_COLOR[activePart]}
                                    onClick={() => setCurrentUnit(num)}
                                >
                                    Câu {i + 1} {answers[num] ? '✓' : ''}
                                </SS.SubTab>
                            ))}
                        </SS.SubTabContainer>

                        <Row gutter={24}>
                            <Col lg={13} md={24}>
                                {renderQuestionContent()}
                            </Col>
                            <Col lg={11} md={24}>
                                {renderRecorder()}
                            </Col>
                        </Row>
                    </S.ContentCard>
                </Col>

                <Col lg={5} md={24}>
                    <ExamQuestionNavigator
                        sections={navSections}
                        answers={answers}
                        currentQuestion={currentUnit}
                        onNavigate={setCurrentUnit}
                    />
                </Col>
            </Row>
        </S.SectionWrapper>
    );
});

export default SpeakingSection;
