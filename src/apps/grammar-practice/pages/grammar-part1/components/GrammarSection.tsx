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
    return <S.EmptyQuestionsMsg>Không tìm thấy câu hỏi.</S.EmptyQuestionsMsg>;
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
    <S.GrammarSectionWrapper>
      <S.GrammarCardBase $isActive={true}>
        <S.GrammarQuestionText>
          <S.GrammarQuestionNumber $answered={!!answer}>
            {activeQuestion.questionNumber}
          </S.GrammarQuestionNumber>
          <S.QuestionTextSpan>
            {renderSentenceWithGap(activeQuestion.sentence, answer)}
          </S.QuestionTextSpan>
        </S.GrammarQuestionText>

        <S.OptionsGrid>
          {activeQuestion.options.map((opt, optIdx) => {
            const optionLabel = String.fromCharCode(65 + optIdx); // A, B, C
            const isOptSelected = answer === opt;

            return (
              <S.OptionLabel
                key={opt}
                $selected={isOptSelected}
                onClick={() => onSelectAnswer(activeQuestion.questionNumber, opt)}
              >
                <span className="prefix">
                  {optionLabel}
                </span>
                {opt}
              </S.OptionLabel>
            );
          })}
        </S.OptionsGrid>
      </S.GrammarCardBase>
    </S.GrammarSectionWrapper>
  );
};
