import { Select,Space } from 'antd';
import React from 'react';
import { IVocabularySet } from '../../../types';
import * as S from '../styles/styled';

interface VocabularySectionProps {
  sets: IVocabularySet[];
  answers: Record<number, string>;
  currentQuestionIndex: number;
  onSelectAnswer: (qNum: number, value: string) => void;
  onQuestionFocus?: (qNum: number) => void;
  // Task đã được BE chấm -> khoá dropdown cho tới khi bấm "Làm lại".
  isSubmitted?: boolean;
  // Đáp án đúng { slot_id: từ đúng } do BE trả sau khi chấm; rỗng nếu chưa có.
  correctAnswers?: Record<string, string>;
}

export const VocabularySection: React.FC<VocabularySectionProps> = ({
  sets,
  answers,
  currentQuestionIndex,
  onSelectAnswer,
  isSubmitted = false,
  correctAnswers = {},
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

  // Chỉ hiện đáp án đúng khi đã chấm và học viên chọn sai.
  const wrongAnswerOf = (slotId: string, answerValue?: string) => {
    const correct = correctAnswers[slotId];
    return isSubmitted && !!correct && answerValue !== correct ? correct : undefined;
  };

  const renderContextQuestion = (slotId: string, label: string, questionNumber: number, answerValue?: string, options: string[] = [], setUsedWords: Set<string> = new Set()) => {
    const parts = label.split('_______');
    if (parts.length < 2) return label;

    return (
      <>
        {parts[0]}
        <S.ContextDropdownInlineWrapper>
          <Select
            placeholder="Chọn từ..."
            className="w-full"
            value={answerValue || undefined}
            onChange={(val) => onSelectAnswer(questionNumber, val)}
            dropdownMatchSelectWidth={false}
            disabled={isSubmitted}
          >
            {options.map((opt) => {
              const isUsed = setUsedWords.has(opt) && answerValue !== opt;
              return (
                <Select.Option key={opt} value={opt} disabled={isUsed}>
                  <Space>
                    <span>{opt}</span>
                    {isUsed && <S.UsedOptionText>(đã dùng)</S.UsedOptionText>}
                  </Space>
                </Select.Option>
              );
            })}
          </Select>
        </S.ContextDropdownInlineWrapper>
        {parts[1]}
        {wrongAnswerOf(slotId, answerValue) && (
          <S.CorrectAnswerText>
            (Đáp án đúng: <strong>{wrongAnswerOf(slotId, answerValue)}</strong>)
          </S.CorrectAnswerText>
        )}
      </>
    );
  };

  return (
    <S.VocabularySectionWrapper>
      <S.VocabularySetCardBase>
        <S.SetTitleBase>
          {activeSet.title}
        </S.SetTitleBase>
        <S.SetInstructionBase>
          {activeSet.instruction}
        </S.SetInstructionBase>

        <S.VocabGrid>
          {activeSet.subQuestions.map((subQ, subIdx) => {
            const answer = answers[subQ.questionNumber];

            return (
              <S.VocabQuestionCard
                key={subQ.id}
                id={`q-container-${subQ.questionNumber}`}
                $isActive={false}
              >
                {activeSet.type === 'context' ? (
                  <S.VocabContextQuestionText>
                    {/* Badge = số ý trong task (1..5) — cả task chỉ là 1 câu trên bảng */}
                    <S.VocabQuestionNumberBadge $answered={!!answer}>
                      {subIdx + 1}
                    </S.VocabQuestionNumberBadge>
                    {renderContextQuestion(subQ.id, subQ.leftLabel, subQ.questionNumber, answer, activeSet.optionsList, usedWords)}
                  </S.VocabContextQuestionText>
                ) : (
                  <S.VocabRow>
                    <S.VocabLabelBase>
                      <S.VocabQuestionNumberBadge $answered={!!answer}>
                        {subIdx + 1}
                      </S.VocabQuestionNumberBadge>
                      <span>{subQ.leftLabel}</span>
                    </S.VocabLabelBase>
                    <S.CustomDropdownWrapper>
                      <Select
                        placeholder="Chọn từ..."
                        value={answer || undefined}
                        onChange={(val) => onSelectAnswer(subQ.questionNumber, val)}
                        dropdownMatchSelectWidth={false}
                        className="w-full"
                        disabled={isSubmitted}
                      >
                        {activeSet.optionsList.map((opt) => {
                          const isUsed = usedWords.has(opt) && answer !== opt;
                          return (
                            <Select.Option key={opt} value={opt} disabled={isUsed}>
                              <Space>
                                <span>{opt}</span>
                                {isUsed && <S.UsedOptionText>(đã dùng)</S.UsedOptionText>}
                              </Space>
                            </Select.Option>
                          );
                        })}
                      </Select>
                      {wrongAnswerOf(subQ.id, answer) && (
                        <S.CorrectAnswerText>
                          (Đáp án đúng: <strong>{wrongAnswerOf(subQ.id, answer)}</strong>)
                        </S.CorrectAnswerText>
                      )}
                    </S.CustomDropdownWrapper>
                  </S.VocabRow>
                )}
              </S.VocabQuestionCard>
            );
          })}
        </S.VocabGrid>
      </S.VocabularySetCardBase>
    </S.VocabularySectionWrapper>
  );
};
