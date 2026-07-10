import { Col,Row,Select } from 'antd';
import React,{ useMemo,useState } from 'react';
import { ExamQuestionNavigator,NavSection } from '../../../../../shared/components/ExamQuestionNavigator';
import { ISubmitAnswer } from '../../../../../shared/services/student-exam';
import { collectGrammarAnswers, GrammarExamData } from '../../../../grammar-practice/services/grammarExamMapper';
import * as GS from '../styles/grammar.styles';
import * as S from '../styles/shared.styles';

export interface GrammarVocabHandle {
    next: () => boolean;
    prev: () => boolean;
    collect: () => ISubmitAnswer[];
}

interface GrammarVocabSectionProps {
    data: GrammarExamData;
    onProgressUpdate?: (answered: number, part: number, question: number) => void;
}

const GrammarVocabSection = React.forwardRef<GrammarVocabHandle, GrammarVocabSectionProps>(({ data, onProgressUpdate }, ref) => {
    const grammarQuestions = data.grammarQuestions;
    const vocabularySets = data.vocabularySets;

    const grammarCount = grammarQuestions.length;
    // Đơn vị hiển thị: grammar mỗi câu 1 số; vocab mỗi task (bản ghi) 1 số
    const totalUnits = grammarCount + vocabularySets.length;

    const [activeUnit, setActiveUnit] = useState(1);
    const [answers, setAnswers] = useState<Record<number, string>>({}); // key = questionNumber toàn cục

    const activePart = activeUnit <= grammarCount ? 1 : 2;

    React.useImperativeHandle(ref, () => ({
        next: () => {
            if (activeUnit < totalUnits) {
                setActiveUnit(activeUnit + 1);
                return true;
            }
            return false;
        },
        prev: () => {
            if (activeUnit > 1) {
                setActiveUnit(activeUnit - 1);
                return true;
            }
            return false;
        },
        // Grammar P1 (MC): index đáp án. Vocab P2 (WORD_BANK): { slot_id: từ }.
        collect: () => collectGrammarAnswers({ grammarQuestions, vocabularySets }, answers),
    }), [activeUnit, totalUnits, grammarQuestions, vocabularySets, answers]);

    // Bảng câu hỏi: vocab mỗi task 1 ô, tô "đã trả lời" khi đủ hết ý
    const navAnswers = useMemo(() => {
        const map: Record<number, string> = {};
        grammarQuestions.forEach((q, i) => {
            if (answers[q.questionNumber]) map[i + 1] = 'answered';
        });
        vocabularySets.forEach((set, i) => {
            const done = set.subQuestions.length > 0 && set.subQuestions.every((sub) => !!answers[sub.questionNumber]);
            if (done) map[grammarCount + i + 1] = 'answered';
        });
        return map;
    }, [answers, grammarQuestions, vocabularySets, grammarCount]);

    const navSections: NavSection[] = useMemo(() => {
        const sections: NavSection[] = [];
        if (grammarCount > 0) {
            sections.push({ label: `Ngữ pháp (1 - ${grammarCount})`, questions: Array.from({ length: grammarCount }, (_, i) => i + 1) });
        }
        if (vocabularySets.length > 0) {
            sections.push({
                label: `Từ vựng (${grammarCount + 1} - ${totalUnits}) — mỗi số 1 task`,
                questions: Array.from({ length: vocabularySets.length }, (_, i) => grammarCount + i + 1),
            });
        }
        return sections;
    }, [grammarCount, vocabularySets.length, totalUnits]);

    const handleSelect = (questionNumber: number, val: string) => {
        setAnswers(prev => ({ ...prev, [questionNumber]: val }));
    };

    React.useEffect(() => {
        onProgressUpdate?.(Object.keys(answers).length, activePart, activeUnit);
    }, [answers, activePart, activeUnit, onProgressUpdate]);

    const renderSentenceWithGap = (sentence: string, selectedValue?: string) => {
        const parts = sentence.split('_______');
        if (parts.length < 2) return sentence;
        return (
            <>
                {parts[0]}
                <span className="gap">{selectedValue || '.......'}</span>
                {parts[1]}
            </>
        );
    };

    const renderGrammarPart = () => {
        const activeQuestion = grammarQuestions[activeUnit - 1];
        if (!activeQuestion) return <div>Không tìm thấy câu hỏi.</div>;

        const answer = answers[activeQuestion.questionNumber];

        return (
            <GS.GrammarSectionWrapper>
                <GS.GrammarQuestionText>
                    <GS.QuestionNumberBadge $answered={!!answer}>
                        {activeUnit}
                    </GS.QuestionNumberBadge>
                    <span>
                        {renderSentenceWithGap(activeQuestion.sentence, answer)}
                    </span>
                </GS.GrammarQuestionText>

                <GS.OptionsGrid>
                    {activeQuestion.options.map((opt, i) => {
                        const optionLabel = String.fromCharCode(65 + i);
                        const isSelected = answer === opt;

                        return (
                            <GS.OptionLabel
                                key={opt}
                                $selected={isSelected}
                                onClick={() => handleSelect(activeQuestion.questionNumber, opt)}
                            >
                                <span className="prefix">{optionLabel}</span>
                                {opt}
                            </GS.OptionLabel>
                        );
                    })}
                </GS.OptionsGrid>
            </GS.GrammarSectionWrapper>
        );
    };

    const renderVocabPart = () => {
        const activeSet = vocabularySets[activeUnit - grammarCount - 1] ?? vocabularySets[0];
        if (!activeSet) return <div>Không có task từ vựng.</div>;

        const usedWords = new Set<string>();
        activeSet.subQuestions.forEach(sq => {
            if (answers[sq.questionNumber]) usedWords.add(answers[sq.questionNumber]);
        });

        const renderOptions = (answer?: string) =>
            activeSet.optionsList.map(opt => {
                const isUsed = usedWords.has(opt) && answer !== opt;
                return (
                    <Select.Option key={opt} value={opt} disabled={isUsed}>
                        {opt} {isUsed && <GS.UsedOptionText>(đã dùng)</GS.UsedOptionText>}
                    </Select.Option>
                );
            });

        return (
            <GS.VocabularySectionWrapper>
                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
                        {activeSet.title}
                    </h3>
                    <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.5 }}>
                        {activeSet.instruction}
                    </p>
                </div>

                <GS.VocabGrid>
                    {activeSet.subQuestions.map((subQ, subIdx) => {
                        const answer = answers[subQ.questionNumber];

                        return (
                            <GS.VocabQuestionCard key={subQ.id} $isActive={false}>
                                {activeSet.type === 'context' ? (
                                    <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', lineHeight: 1.6 }}>
                                        <GS.VocabQuestionNumberBadge $answered={!!answer}>
                                            {subIdx + 1}
                                        </GS.VocabQuestionNumberBadge>
                                        {(() => {
                                            const parts = subQ.leftLabel.split('_______');
                                            if (parts.length < 2) return subQ.leftLabel;
                                            return (
                                                <>
                                                    {parts[0]}
                                                    <GS.ContextDropdownInlineWrapper>
                                                        <Select
                                                            placeholder="Chọn từ..."
                                                            style={{ width: '100%' }}
                                                            value={answer || undefined}
                                                            onChange={(val) => handleSelect(subQ.questionNumber, val)}
                                                            dropdownMatchSelectWidth={false}
                                                        >
                                                            {renderOptions(answer)}
                                                        </Select>
                                                    </GS.ContextDropdownInlineWrapper>
                                                    {parts[1]}
                                                </>
                                            );
                                        })()}
                                    </div>
                                ) : (
                                    <GS.VocabRow>
                                        <GS.VocabLabel>
                                            <GS.VocabQuestionNumberBadge $answered={!!answer}>
                                                {subIdx + 1}
                                            </GS.VocabQuestionNumberBadge>
                                            <span>{subQ.leftLabel}</span>
                                        </GS.VocabLabel>
                                        <Select
                                            placeholder="Chọn từ..."
                                            style={{ width: '280px' }}
                                            value={answer || undefined}
                                            onChange={(val) => handleSelect(subQ.questionNumber, val)}
                                            dropdownMatchSelectWidth={false}
                                        >
                                            {renderOptions(answer)}
                                        </Select>
                                    </GS.VocabRow>
                                )}
                            </GS.VocabQuestionCard>
                        );
                    })}
                </GS.VocabGrid>
            </GS.VocabularySectionWrapper>
        );
    };

    return (
        <S.SectionWrapper>
            <Row gutter={24}>
                <Col lg={19} md={24}>
                    <S.ContentCard style={{ padding: '0 1rem' }}>
                        <S.TitleArea>
                            <h2>Grammar & Vocabulary</h2>
                            <div className="subtitle">
                                {activePart === 1
                                    ? `Part 1: Grammar (Câu 1 - ${grammarCount})`
                                    : `Part 2: Vocabulary (Câu ${grammarCount + 1} - ${totalUnits}, mỗi câu 1 task)`}
                            </div>
                        </S.TitleArea>

                        {activePart === 1 ? renderGrammarPart() : renderVocabPart()}
                    </S.ContentCard>
                </Col>

                <Col lg={5} md={24}>
                    <ExamQuestionNavigator
                        sections={navSections}
                        answers={navAnswers}
                        currentQuestion={activeUnit}
                        onNavigate={setActiveUnit}
                    />
                </Col>
            </Row>
        </S.SectionWrapper>
    );
});

export default GrammarVocabSection;
