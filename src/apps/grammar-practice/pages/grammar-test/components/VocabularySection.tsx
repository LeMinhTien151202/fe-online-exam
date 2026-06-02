import React from 'react';
import { Select, Space } from 'antd';
import { IVocabularySet } from '../../../types';
import * as S from '../styles/styled';

interface VocabularySectionProps {
  sets: IVocabularySet[];
  answers: Record<number, string>;
  currentQuestionIndex: number;
  onSelectAnswer: (qNum: number, value: string) => void;
  onQuestionFocus: (qNum: number) => void;
}

export const VocabularySection: React.FC<VocabularySectionProps> = ({
  sets,
  answers,
  currentQuestionIndex,
  onSelectAnswer,
  onQuestionFocus,
}) => {
  // Find which set contains the currentQuestionIndex
  const activeSet = sets.find(set => 
    set.subQuestions.some(subQ => subQ.questionNumber === currentQuestionIndex)
  ) || sets[0];

  // Helper to check which options are currently selected in this set
  const getSelectedWordsInSet = (set: IVocabularySet) => {
    const selected = new Set<string>();
    set.subQuestions.forEach((subQ) => {
      const answer = answers[subQ.questionNumber];
      if (answer) {
        selected.add(answer);
      }
    });
    return selected;
  };

  const usedWords = getSelectedWordsInSet(activeSet);

  const renderContextQuestion = (label: string, questionNumber: number, answerValue?: string, options: string[] = [], setUsedWords: Set<string> = new Set()) => {
    const parts = label.split('_______');
    if (parts.length < 2) return label;

    return (
      <>
        {parts[0]}
        <div style={{ display: 'inline-block', width: '180px', margin: '0 0.5rem', verticalAlign: 'middle' }}>
          <Select
            placeholder="Chọn từ..."
            style={{ width: '100%' }}
            value={answerValue || undefined}
            onChange={(val) => onSelectAnswer(questionNumber, val)}
            dropdownMatchSelectWidth={false}
          >
            {options.map((opt) => {
              const isUsed = setUsedWords.has(opt) && answerValue !== opt;
              return (
                <Select.Option key={opt} value={opt} disabled={isUsed}>
                  <Space>
                    <span>{opt}</span>
                    {isUsed && <span style={{ fontSize: '11px', color: '#bfbfbf', fontStyle: 'italic' }}>(đã dùng)</span>}
                  </Space>
                </Select.Option>
              );
            })}
          </Select>
        </div>
        {parts[1]}
      </>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
      <S.VocabularySetCard style={{ border: 'none', boxShadow: 'none', padding: 0 }}>
        <S.SetTitle style={{ fontSize: '1.25rem', color: '#001a41', marginBottom: '0.25rem' }}>
          {activeSet.title}
        </S.SetTitle>
        <S.SetInstruction style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '1.5rem' }}>
          {activeSet.instruction}
        </S.SetInstruction>

        <S.VocabGrid>
          {activeSet.subQuestions.map((subQ) => {
            const answer = answers[subQ.questionNumber];

            return (
              <S.GrammarQuestionCard
                key={subQ.id}
                id={`q-container-${subQ.questionNumber}`}
                $isActive={false}
                style={{ 
                  marginBottom: '0.75rem', 
                  padding: '1rem 1.25rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  background: '#ffffff',
                  boxShadow: 'none'
                }}
              >
                {activeSet.type === 'context' ? (
                  <S.QuestionText style={{ marginBottom: 0, fontSize: '1rem', color: '#1e293b', fontWeight: 600, lineHeight: '1.6' }}>
                    <S.QuestionNumberBadge 
                      $answered={!!answer} 
                      style={{ 
                        width: '1.75rem', 
                        height: '1.75rem', 
                        fontSize: '0.85rem',
                        background: answer ? '#e6f4ff' : '#f1f5f9',
                        color: answer ? '#1677ff' : '#475569',
                        display: 'inline-flex',
                        marginRight: '0.5rem',
                        verticalAlign: 'middle',
                        flexShrink: 0
                      }}
                    >
                      {subQ.questionNumber}
                    </S.QuestionNumberBadge>
                    {renderContextQuestion(subQ.leftLabel, subQ.questionNumber, answer, activeSet.optionsList, usedWords)}
                  </S.QuestionText>
                ) : (
                  <S.VocabRow>
                    <S.VocabLabel style={{ fontSize: '1rem', color: '#1e293b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <S.QuestionNumberBadge 
                        $answered={!!answer} 
                        style={{ 
                          width: '1.75rem', 
                          height: '1.75rem', 
                          fontSize: '0.85rem',
                          background: answer ? '#e6f4ff' : '#f1f5f9',
                          color: answer ? '#1677ff' : '#475569',
                          display: 'inline-flex',
                          marginRight: '0.25rem',
                          flexShrink: 0
                        }}
                      >
                        {subQ.questionNumber}
                      </S.QuestionNumberBadge>
                      <span>{subQ.leftLabel}</span>
                    </S.VocabLabel>
                    <S.CustomDropdownWrapper>
                      <Select
                        placeholder="Chọn từ..."
                        value={answer || undefined}
                        onChange={(val) => onSelectAnswer(subQ.questionNumber, val)}
                        dropdownMatchSelectWidth={false}
                        style={{ width: '100%' }}
                      >
                        {activeSet.optionsList.map((opt) => {
                          const isUsed = usedWords.has(opt) && answer !== opt;
                          return (
                            <Select.Option key={opt} value={opt} disabled={isUsed}>
                              <Space>
                                <span>{opt}</span>
                                {isUsed && <span style={{ fontSize: '11px', color: '#bfbfbf', fontStyle: 'italic' }}>(đã dùng)</span>}
                              </Space>
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </S.CustomDropdownWrapper>
                  </S.VocabRow>
                )}
              </S.GrammarQuestionCard>
            );
          })}
        </S.VocabGrid>
      </S.VocabularySetCard>
    </div>
  );
};
