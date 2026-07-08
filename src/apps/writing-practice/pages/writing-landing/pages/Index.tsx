import {
BellOutlined,
EditOutlined,
MenuOutlined,
QuestionCircleOutlined,
ThunderboltOutlined,
} from '@ant-design/icons';
import { Link } from '@tanstack/react-router';
import { Button,Drawer,Empty,Segmented,Spin } from 'antd';
import React from 'react';
import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import { PartCard } from '../components/PartCard';
import { useLandingAction } from '../hook/useLandingAction';
import { writingPartsData } from '../services/data';
import * as S from '../styles/styled';

export const WritingPracticePage: React.FC = () => {
  const {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    activeTab,
    setActiveTab,
    writingProgress,
    examSets,
    isExamsLoading,
    handlePartClick,
    handleMockClick,
  } = useLandingAction();

  const parts = writingPartsData.map((part) => ({
    ...part,
    progress: writingProgress[part.id] ?? 0,
  }));

  return (
    <HomeS.MainLayout>
      <Sidebar />

      <Drawer
        placement="left"
        onClose={() => setIsMobileMenuOpen(false)}
        open={isMobileMenuOpen}
        styles={{ body: { padding: 0, background: '#0D2245' } }}
        width={280}
        closable={false}
      >
        <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
      </Drawer>

      <HomeS.RightColumn>
        <HomeS.MobileHeader>
          <Link
            to="/"
            className="flex items-center gap-2"
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            <HomeS.HeaderLogo src="/image.png" alt="Logo" />
            <HomeS.HeaderTitle>Aptis Prep</HomeS.HeaderTitle>
          </Link>
          <div className="flex items-center gap-2">
            <Button type="text" icon={<BellOutlined />} />
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setIsMobileMenuOpen(true)}
            />
          </div>
        </HomeS.MobileHeader>

        <HomeS.ContentArea>
          <S.Container>
            <S.HeaderSection>
              <S.HeaderContent>
                <S.CategoryTag>
                  <EditOutlined /> KỸ NĂNG VIẾT
                </S.CategoryTag>
                <S.PageTitle>Luyện Tập Viết Tiếng Anh Aptis</S.PageTitle>
                <S.SubTitle>Mô phỏng chính xác cấu trúc bài thi thực tế. Chọn ôn luyện riêng từng phần hoặc kiểm tra năng lực với bộ đề thi thử đầy đủ.</S.SubTitle>
              </S.HeaderContent>
              <S.StatsContainer>
                <S.StatPill>
                  <div className="icon" style={{ color: '#ea580c' }}>🔥</div>
                  <div className="info">
                    <span>Chuỗi ngày</span>
                    <span>5 Ngày</span>
                  </div>
                </S.StatPill>

              </S.StatsContainer>
            </S.HeaderSection>

            {/* Tab selector for Parts vs Test Sets vs Mock Tests */}
            <S.TabSectionWrapper>
              <Segmented
                value={activeTab}
                onChange={(value) => setActiveTab(value as 'parts' | 'mock-tests')}
                options={[
                  { label: 'Luyện tập theo phần', value: 'parts' },
                  { label: 'Luyện tập theo bộ đề', value: 'mock-tests' }
                ]}
                size="large"
              />
            </S.TabSectionWrapper>

            {activeTab === 'parts' && (
              <S.PartsContainer>
                {parts.map((part) => (
                  <PartCard
                    key={part.id}
                    part={part}
                    onClick={() => handlePartClick(part.id)}
                  />
                ))}
              </S.PartsContainer>
            )}

            {activeTab === 'mock-tests' && (
              <S.MockTestGrid>
                {isExamsLoading ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
                    <Spin size="large" />
                  </div>
                ) : examSets.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Empty description="Chưa có đề viết nào" />
                  </div>
                ) : (
                  examSets.map((exam) => (
                    <S.MockTestCard key={exam.id}>
                      <S.MockTestTitle>{exam.title}</S.MockTestTitle>

                      <S.MockTestMeta>
                        <S.MetaItem>
                          <QuestionCircleOutlined />
                          <span>Số phần: {exam._count?.sections ?? 0} phần</span>
                        </S.MetaItem>
                        {exam.description && (
                          <S.MetaItem>
                            <EditOutlined />
                            <span>{exam.description}</span>
                          </S.MetaItem>
                        )}
                      </S.MockTestMeta>

                      <Button
                        type="primary"
                        icon={<ThunderboltOutlined />}
                        style={{
                          width: '100%',
                          borderRadius: '8px',
                          height: '40px',
                          fontWeight: 700,
                          background: '#1a365d',
                          borderColor: '#1a365d',
                          color: '#ffffff',
                          boxShadow: '0 4px 6px -1px rgba(26, 54, 93, 0.15)'
                        }}
                        onClick={() => handleMockClick(exam.id)}
                      >
                        Bắt đầu làm đề
                      </Button>
                    </S.MockTestCard>
                  ))
                )}
              </S.MockTestGrid>
            )}
          </S.Container>
        </HomeS.ContentArea>
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default WritingPracticePage;
