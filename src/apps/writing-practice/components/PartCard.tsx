import React from 'react';
import * as S from './PartCard.styled';

export interface IPracticePart {
  id: string;
  title: string;
  subTitle?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  description: string;
  progress?: number;
  icon: React.ReactNode;
  theme: {
    bgColor: string;
    textColor: string;
    borderColor: string;
  };
}

interface PartCardProps {
  part: IPracticePart;
  onClick?: () => void;
}

export const PartCard: React.FC<PartCardProps> = ({ part, onClick }) => {
  return (
    <S.CardWrapper $borderColor={part.theme.borderColor}>
      <S.HeaderArea>
        <S.HeaderLeft>
          <S.IconBox $bgColor={part.theme.bgColor} $color={part.theme.textColor}>
            {part.icon}
          </S.IconBox>
          <S.TitleContainer>
            <S.Title>{part.title}</S.Title>
            {part.subTitle && <S.SubTitle>{part.subTitle}</S.SubTitle>}
          </S.TitleContainer>
        </S.HeaderLeft>
      </S.HeaderArea>

      <S.ContentArea>
        <S.Description>{part.description}</S.Description>
      </S.ContentArea>

      {part.progress !== undefined ? (
        <div>
          <S.ProgressContainer>
            <S.ProgressHeader>
              <span>Tiến độ phần này</span>
              <span>{part.progress}%</span>
            </S.ProgressHeader>
            <S.ProgressBarBg>
              <S.ProgressBarFill $percent={part.progress} $color={part.theme.textColor} />
            </S.ProgressBarBg>
          </S.ProgressContainer>

          <S.ActionArea onClick={onClick}>
            <span>Bắt đầu luyện tập</span>
            <S.StyledArrowIcon />
          </S.ActionArea>
        </div>
      ) : null}
    </S.CardWrapper>
  );
};
