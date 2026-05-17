import React, { useState } from 'react';
import { Typography, Drawer, Button } from 'antd';
import { InfoCircleOutlined, MessageOutlined, MenuOutlined, BellOutlined } from '@ant-design/icons';

// Components
import { Sidebar } from '../components/Sidebar';
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
 * Quản lý luồng dữ liệu và lắp ráp các Dumb Components
 */
const HomePage: React.FC = () => {
  const { stats, modules, isLoading } = useHomeData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isLoading) return <div>Loading...</div>;

  return (
    <S.MainLayout>
      {/* Sidebar Desktop - Dumb Component */}
      <Sidebar />

      {/* Sidebar Mobile - Drawer */}
      <Drawer
        placement="left"
        onClose={() => setIsMobileMenuOpen(false)}
        open={isMobileMenuOpen}
        bodyStyle={{ padding: 0, background: '#001A41' }}
        width={280}
        closable={false}
      >
        <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
      </Drawer>

      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <S.MobileHeader>
          <div className="flex items-center gap-2">
            <S.HeaderLogo src="/image.png" alt="Logo" />
            <S.HeaderTitle>Aptis Prep</S.HeaderTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button type="text" icon={<BellOutlined />} />
            <Button 
              type="text" 
              icon={<MenuOutlined />} 
              onClick={() => setIsMobileMenuOpen(true)} 
            />
          </div>
        </S.MobileHeader>

        <S.ContentArea>
          <S.Container>
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
                  <a href="#">
                    Đọc Hướng dẫn →
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
                  <a href="#">
                    Tham gia Thảo luận →
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
                <a href="#">Chính sách Bảo mật</a>
                <a href="#">Điều khoản Dịch vụ</a>
                <a href="#">Trung tâm Trợ giúp</a>
                <a href="#">Liên hệ</a>
              </S.FooterLinks>
            </S.Footer>
          </S.Container>
        </S.ContentArea>
      </div>
    </S.MainLayout>
  );
};

export default HomePage;
