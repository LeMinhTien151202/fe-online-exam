import React from 'react';
import { Typography } from 'antd';
import { InfoCircleOutlined, MessageOutlined, ArrowRightOutlined } from '@ant-design/icons';

// Components
import { DashboardLayout } from '../components/DashboardLayout';
import { HeroSection } from '../components/HeroSection';
import { StatsSection } from '../components/StatsSection';
import { ModuleGrid } from '../components/ModuleGrid';

// Hooks
import { useHomeData } from '../hook/useHomeData';

// Styled Components
import * as S from './styled';

const { Title, Text } = Typography;

/**
 * Smart Component: Trang chủ (Dashboard)
 */
const HomePage: React.FC = () => {
  const { stats, modules, isLoading } = useHomeData();

  if (isLoading) return <div>Loading...</div>;

  return (
    <DashboardLayout>
      {/* Hero Section - Dumb Component */}
      <HeroSection />

      {/* Stats Section - Dumb Component */}
      <StatsSection stats={stats} />

      {/* Modules Grid - Dumb Component */}
      <S.SectionTitleWrapper>
        <Title level={2}>
          Học phần Luyện tập
        </Title>
      </S.SectionTitleWrapper>
      <ModuleGrid modules={modules} />

      {/* Bottom Info Section */}
      <S.BottomInfoGrid>
        <S.InfoCard>
          <S.InfoIconBox>
            <InfoCircleOutlined />
          </S.InfoIconBox>
          <S.InfoCardContent>
            <Title level={4}>Hiểu về Aptis</Title>
            <Text>
              Tìm hiểu thêm về cấu trúc bài thi, hệ thống tính điểm và cách tối đa hóa kết quả của bạn.
            </Text>
            <a href="" onClick={(e) => e.preventDefault()}>
              Đọc Hướng dẫn <ArrowRightOutlined style={{ fontSize: '0.8125rem', marginLeft: '4px' }} />
            </a>
          </S.InfoCardContent>
        </S.InfoCard>

        <S.InfoCard>
          <S.InfoIconBox>
            <MessageOutlined />
          </S.InfoIconBox>
          <S.InfoCardContent>
            <Title level={4}>Diễn đàn Cộng đồng</Title>
            <Text>
              Kết nối với các thí sinh khác, chia sẻ mẹo học và đặt câu hỏi về quá trình ôn luyện của bạn.
            </Text>
            <a href="" onClick={(e) => e.preventDefault()}>
              Tham gia Thảo luận <ArrowRightOutlined style={{ fontSize: '0.8125rem', marginLeft: '4px' }} />
            </a>
          </S.InfoCardContent>
        </S.InfoCard>
      </S.BottomInfoGrid>

      {/* Footer */}
      <S.Footer>
        <S.CopyrightText>
          © 2024 Trung tâm Luyện thi Aptis Prep. Bảo lưu mọi quyền.
        </S.CopyrightText>
        <S.FooterLinks>
          <a href="/" onClick={(e) => e.preventDefault()}>Chính sách Bảo mật</a>
          <a href="/" onClick={(e) => e.preventDefault()}>Điều khoản Dịch vụ</a>
          <a href="/" onClick={(e) => e.preventDefault()}>Trung tâm Trợ giúp</a>
          <a href="/" onClick={(e) => e.preventDefault()}>Liên hệ</a>
        </S.FooterLinks>
      </S.Footer>
    </DashboardLayout>
  );
};

export default HomePage;
