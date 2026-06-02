import React from 'react';
import { IGrammarQuestion } from '../../../types';
import * as S from '../styles/styled';

interface GrammarSectionProps {
  questions: IGrammarQuestion[];
  answers: Record<number, string>;
  currentQuestionIndex: number;
  onSelectAnswer: (qNum: number, value: string) => void;
}

export const GrammarSection: React.FC<GrammarSectionProps> = ({
  questions,
  answers,
  currentQuestionIndex,
  onSelectAnswer,
}) => {
  const activeQuestion = questions.find(q => q.questionNumber === currentQuestionIndex);

  if (!activeQuestion) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Không tìm thấy câu hỏi.</div>;
  }

  const answer = answers[activeQuestion.questionNumber];

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', padding: '1rem 0' }}>
      <S.GrammarQuestionCard $isActive={true} style={{ border: 'none', background: 'transparent', padding: 0 }}>
        <S.QuestionText style={{ fontSize: '1.35rem', lineHeight: '2', marginBottom: '2.5rem', fontWeight: 600, display: 'block' }}>
          <S.QuestionNumberBadge 
            $answered={!!answer} 
            style={{ 
              display: 'inline-flex', 
              verticalAlign: 'middle', 
              marginRight: '0.75rem',
              width: '2.25rem',
              height: '2.25rem',
              fontSize: '1rem',
              flexShrink: 0
            }}
          >
            {activeQuestion.questionNumber}
          </S.QuestionNumberBadge>
          <span style={{ verticalAlign: 'middle' }}>
            {renderSentenceWithGap(activeQuestion.sentence, answer)}
          </span>
        </S.QuestionText>

        <S.OptionsGrid style={{ flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
          {activeQuestion.options.map((opt, optIdx) => {
            const optionLabel = String.fromCharCode(65 + optIdx); // A, B, C
            const isOptSelected = answer === opt;

            return (
              <S.OptionLabel
                key={opt}
                $selected={isOptSelected}
                onClick={() => onSelectAnswer(activeQuestion.questionNumber, opt)}
                style={{ padding: '0.85rem 1.5rem', fontSize: '1.05rem', borderRadius: '0.75rem' }}
              >
                <span className="prefix" style={{ width: '1.75rem', height: '1.75rem', fontSize: '0.9rem' }}>
                  {optionLabel}
                </span>
                {opt}
              </S.OptionLabel>
            );
          })}
        </S.OptionsGrid>
      </S.GrammarQuestionCard>
    </div>
  );
};
