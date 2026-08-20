import React from 'react';
import { IGrammarQuestion } from '../../../types';
import * as S from '../styles/styled';

interface GrammarSectionProps {
  questions: IGrammarQuestion[];
  answers: Record<number, string>;
  currentQuestionIndex: number;
  onSelectAnswer: (qNum: number, value: string) => void;
  // Câu đã được BE chấm -> khoá lựa chọn và tô màu đúng/sai.
  isSubmitted?: boolean;
  isCorrect?: boolean;
}

export const GrammarSection: React.FC<GrammarSectionProps> = ({
  questions,
  answers,
  currentQuestionIndex,
  onSelectAnswer,
  isSubmitted = false,
  isCorrect = false,
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
            // Sau khi chấm: đáp án đã chọn xanh nếu đúng, đỏ nếu sai.
            const gradedStyle = isSubmitted && isOptSelected
              ? isCorrect
                ? { borderColor: '#10b981', background: '#ecfdf5', color: '#065f46' }
                : { borderColor: '#ef4444', background: '#fef2f2', color: '#991b1b' }
              : undefined;

            return (
              <S.OptionLabel
                key={opt}
                $selected={isOptSelected}
                onClick={() => onSelectAnswer(activeQuestion.questionNumber, opt)}
                style={{ cursor: isSubmitted ? 'default' : 'pointer', ...gradedStyle }}
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
