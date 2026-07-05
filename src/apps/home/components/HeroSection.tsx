import { Typography } from 'antd';
import React from 'react';
import * as S from './HeroSection.styled';

const { Title, Paragraph } = Typography;

export const HeroSection: React.FC = () => {
  return (
    <S.HeroContainer>
      <S.ContentWrapper>
        <S.Badge>
          <S.StarIcon />
          Nền tảng Luyện thi Aptis Miễn phí
        </S.Badge>
        <Title level={1}>
          Chào mừng trở lại, Thí sinh!
        </Title>
        <Paragraph>
          Bắt đầu hành trình ôn luyện ngay hôm nay. Bạn đang làm rất tốt!
        </Paragraph>
        <S.StyledButton>
          Bắt đầu Luyện tập <S.StyledArrow />
        </S.StyledButton>
      </S.ContentWrapper>

      <S.MascotWrapper>
        <img
          src="/image.png"
          alt="Mascot"
        />
      </S.MascotWrapper>
    </S.HeroContainer>
  );
};
