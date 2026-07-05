import { Col,Row,Select,Typography } from 'antd';
import React,{ useState } from 'react';
import { ExamQuestionNavigator,NavSection } from '../../../../../shared/components/ExamQuestionNavigator';
import { mockGrammarQuestions,mockVocabularySets } from '../../../../grammar-practice/pages/grammar-mock-test/services/mockExamData';
import * as GS from '../styles/grammar.styles';
import * as S from '../styles/shared.styles';

const { Text } = Typography;

export interface GrammarVocabHandle {
    next: () => boolean;
    prev: () => boolean;
}

interface GrammarVocabSectionProps {
    onProgressUpdate?: (answered: number, part: number, question: number) => void;
}

const GrammarVocabSection = React.forwardRef<GrammarVocabHandle, GrammarVocabSectionProps>(({ onProgressUpdate }, ref) => {
    const [activePart, setActivePart] = useState(1); // 1: Grammar, 2: Vocabulary
    const [currentIndex, setCurrentIndex] = useState(1);
    const [answers, setAnswers] = useState<Record<number, string>>({});

    React.useImperativeHandle(ref, () => ({
        next: () => {
            if (currentIndex < 50) {
                handleNavigateQuestion(currentIndex + 1);
                return true;
            }
            return false;
        },
        prev: () => {
            if (currentIndex > 1) {
                handleNavigateQuestion(currentIndex - 1);
                return true;
            }
            return false;
        }
    }), [currentIndex]);

    const navSections: NavSection[] = [
        { label: 'Ngữ pháp (1 - 25)', questions: Array.from({ length: 25 }, (_, i) => i + 1) },
        { label: 'Từ vựng (26 - 50)', questions: Array.from({ length: 25 }, (_, i) => i + 26) }
    ];

    const handleSelect = (qId: number, val: string) => {
        const newAnswers = { ...answers, [qId]: val };
        setAnswers(newAnswers);
    };

    React.useEffect(() => {
        const answeredCount = Object.keys(answers).length;
        onProgressUpdate?.(answeredCount, activePart, currentIndex);
    }, [answers, activePart, currentIndex]);

    const handleNavigateQuestion = (qNum: number) => {
        setCurrentIndex(qNum);
        if (qNum <= 25) setActivePart(1);
        else setActivePart(2);
    };

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
        const activeQuestion = mockGrammarQuestions.find(q => q.questionNumber === currentIndex);
        if (!activeQuestion) return <div>Không tìm thấy câu hỏi.</div>;

        const answer = answers[currentIndex];

        return (
            <GS.GrammarSectionWrapper>
                <GS.GrammarQuestionText>
                    <GS.QuestionNumberBadge $answered={!!answer}>
                        {currentIndex}
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
                                onClick={() => handleSelect(currentIndex, opt)}
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
        const activeSet = mockVocabularySets.find(set =>
            set.subQuestions.some(subQ => subQ.questionNumber === currentIndex)
        ) || mockVocabularySets[0];

        const getUsedWordsInSet = () => {
            const used = new Set<string>();
            activeSet.subQuestions.forEach(sq => {
                if (answers[sq.questionNumber]) used.add(answers[sq.questionNumber]);
            });
            return used;
        };

        const usedWords = getUsedWordsInSet();

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
                    {activeSet.subQuestions.map((subQ) => {
                        const answer = answers[subQ.questionNumber];
                        const isActive = subQ.questionNumber === currentIndex;

                        return (
                            <GS.VocabQuestionCard key={subQ.id} $isActive={isActive}>
                                {activeSet.type === 'context' ? (
                                    <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', lineHeight: 1.6 }}>
                                        <GS.VocabQuestionNumberBadge $answered={!!answer}>
                                            {subQ.questionNumber}
                                        </GS.VocabQuestionNumberBadge>
                                        {(() => {
                                            const parts = subQ.leftLabel.split('_______');
                                            return (
                                                <>
                                                    {parts[0]}
                                                    <GS.ContextDropdownInlineWrapper>
                                                        <Select
                                                            placeholder="Chọn từ..."
                                                            style={{ width: '100%' }}
                                                            value={answer || undefined}
                                                            onChange={(val) => handleSelect(subQ.questionNumber, val)}
                                                            onFocus={() => setCurrentIndex(subQ.questionNumber)}
                                                        >
                                                            {activeSet.optionsList.map(opt => {
                                                                const isUsed = usedWords.has(opt) && answer !== opt;
                                                                return (
                                                                    <Select.Option key={opt} value={opt} disabled={isUsed}>
                                                                        {opt} {isUsed && <GS.UsedOptionText>(đã dùng)</GS.UsedOptionText>}
                                                                    </Select.Option>
                                                                );
                                                            })}
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
                                                {subQ.questionNumber}
                                            </GS.VocabQuestionNumberBadge>
                                            <span>{subQ.leftLabel}</span>
                                        </GS.VocabLabel>
                                        <Select
                                            placeholder="Chọn từ..."
                                            style={{ width: '280px' }}
                                            value={answer || undefined}
                                            onChange={(val) => handleSelect(subQ.questionNumber, val)}
                                            onFocus={() => setCurrentIndex(subQ.questionNumber)}
                                        >
                                            {activeSet.optionsList.map(opt => {
                                                const isUsed = usedWords.has(opt) && answer !== opt;
                                                return (
                                                    <Select.Option key={opt} value={opt} disabled={isUsed}>
                                                        {opt} {isUsed && <GS.UsedOptionText>(đã dùng)</GS.UsedOptionText>}
                                                    </Select.Option>
                                                );
                                            })}
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
                                    ? 'Part 1: Grammar (Questions 1 - 25)'
                                    : 'Part 2: Vocabulary (Questions 26 - 50)'}
                            </div>
                        </S.TitleArea>

                        {activePart === 1 ? renderGrammarPart() : renderVocabPart()}
                    </S.ContentCard>
                </Col>

                <Col lg={5} md={24}>
                    <ExamQuestionNavigator
                        sections={navSections}
                        answers={answers}
                        currentQuestion={currentIndex}
                        onNavigate={handleNavigateQuestion}
                    />
                </Col>
            </Row>
        </S.SectionWrapper>
    );
});

export default GrammarVocabSection;
