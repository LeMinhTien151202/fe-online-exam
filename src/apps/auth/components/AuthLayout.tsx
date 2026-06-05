import React from 'react';
import * as S from '../styles/layout.styled';

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <S.AuthLayoutContainer>
            {/* Left Panel: Premium SaaS Branding */}
            <S.BrandPanel>
                <S.HeroContent>
                    <S.BrandLogo src="/image.png" alt="Aptis Test Logo" />

                    <S.HeroTitle>Chào mừng trở lại!</S.HeroTitle>
                    <S.HeroSubtitle>
                        Tiếp tục hành trình ôn luyện để đạt mục tiêu chứng chỉ B2 của bạn.
                    </S.HeroSubtitle>

                    <S.BenefitList>
                        <S.BenefitItem>
                            <div className="check-dot" />
                            Luyện đầy đủ 5 kỹ năng Aptis
                        </S.BenefitItem>
                        <S.BenefitItem>
                            <div className="check-dot" />
                            Chấm điểm tự động tức thì
                        </S.BenefitItem>
                        <S.BenefitItem>
                            <div className="check-dot" />
                            Theo dõi tiến độ từng ngày
                        </S.BenefitItem>
                        <S.BenefitItem>
                            <div className="check-dot" />
                            Bộ đề thi thử sát thực tế
                        </S.BenefitItem>
                    </S.BenefitList>
                </S.HeroContent>

                <S.StatsWrapper>
                    <S.StatItem>
                        <span className="value">14,820</span>
                        <span className="label">Học viên</span>
                    </S.StatItem>
                    <S.StatItem>
                        <span className="value">1,245</span>
                        <span className="label">Trực tuyến</span>
                    </S.StatItem>
                    <S.StatItem>
                        <span className="value">50,000+</span>
                        <span className="label">Câu hỏi</span>
                    </S.StatItem>
                </S.StatsWrapper>
            </S.BrandPanel>

            {/* Right Panel: Focused Form Area */}
            <S.FormPanel>
                <S.AuthCard>
                    {children}
                </S.AuthCard>
            </S.FormPanel>
        </S.AuthLayoutContainer>
    );
};

export default AuthLayout;
