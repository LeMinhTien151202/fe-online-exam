import React from 'react';
import { Typography } from 'antd';
import { ArrowRightOutlined, StarFilled } from '@ant-design/icons';
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
          Tiếp tục hành trình ôn luyện để đạt mục tiêu chứng chỉ B2. Bạn đang làm rất tốt!
        </Paragraph>
        <S.StyledButton icon={<ArrowRightOutlined />}>
          Tiếp tục Luyện tập
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
