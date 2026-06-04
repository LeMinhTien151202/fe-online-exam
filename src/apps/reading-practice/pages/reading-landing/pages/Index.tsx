import React from 'react';
import { Sidebar } from '../../../../home/components/Sidebar';
import {
  ReadOutlined,
  BellOutlined,
  MenuOutlined,
  ClockCircleOutlined,
  QuestionCircleOutlined,
  TrophyOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { PartCard } from '../components/PartCard';
import * as S from '../styles/styled';
import * as HomeS from '../../../../home/pages/styled';
import { Drawer, Button, Segmented, Progress } from 'antd';
import { Link } from '@tanstack/react-router';
import { mockTestsData } from '../services/data';
import { useReadingLanding } from '../hook/useReadingLanding';

export const ReadingPracticePage: React.FC = () => {
  const {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    activeTab,
    setActiveTab,
    parts,
    completedCount,
    mockProgress,
    handlePartClick,
    handleMockClick
  } = useReadingLanding();

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
            <HomeS.HeaderTitle>Aptis Test</HomeS.HeaderTitle>
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
                  <ReadOutlined /> KỸ NĂNG ĐỌC
                </S.CategoryTag>
                <S.PageTitle>Luyện Tập Đọc Hiểu Aptis</S.PageTitle>
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
                <S.StatPill>
                  <div className="icon" style={{ color: '#16a34a' }}>✅</div>
                  <div className="info">
                    <span>Đã hoàn thành</span>
                    <span>{completedCount}/4 Phần</span>
                  </div>
                </S.StatPill>
              </S.StatsContainer>
            </S.HeaderSection>

            {/* Tab selector for Parts vs Test Sets vs Mock Tests */}
            <S.TabSectionWrapper>
              <Segmented
                value={activeTab}
                onChange={(value) => setActiveTab(value as any)}
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
                {mockTestsData.map((mock) => {
                  const score = mockProgress[mock.id] ?? 0;
                  const difficultyLabel = mock.difficulty === 'easy' ? 'Dễ' : mock.difficulty === 'medium' ? 'Trung bình' : 'Khó';

                  return (
                    <S.MockTestCard key={mock.id}>
                      <S.MockTestBadge $type={mock.difficulty}>
                        {difficultyLabel}
                      </S.MockTestBadge>
                      <S.MockTestTitle>{mock.title}</S.MockTestTitle>

                      <S.MockTestMeta>
                        <S.MetaItem>
                          <QuestionCircleOutlined />
                          <span>Số câu hỏi: {mock.questions} câu</span>
                        </S.MetaItem>
                        <S.MetaItem>
                          <ClockCircleOutlined />
                          <span>Thời gian: {mock.duration} phút</span>
                        </S.MetaItem>
                        <S.MetaItem>
                          <TrophyOutlined />
                          <span>
                            Kết quả tốt nhất:{' '}
                            {score > 0 ? (
                              <strong style={{ color: '#10b981' }}>{score}/24 ({Math.round(score / 24 * 100)}%)</strong>
                            ) : (
                              <span style={{ color: '#64748b' }}>Chưa làm</span>
                            )}
                          </span>
                        </S.MetaItem>
                      </S.MockTestMeta>

                      {score > 0 && (
                        <div style={{ marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>
                            <span>Điểm số</span>
                            <span>{Math.round(score / 24 * 100)}%</span>
                          </div>
                          <Progress percent={Math.round(score / 24 * 100)} size="small" strokeColor="#10b981" showInfo={false} />
                        </div>
                      )}

                      <Button
                        type="primary"
                        icon={<ThunderboltOutlined />}
                        style={{
                          width: '100%',
                          borderRadius: '8px',
                          height: '40px',
                          fontWeight: 700,
                          background: score > 0 ? '#eff6ff' : '#1a365d',
                          borderColor: score > 0 ? '#bfdbfe' : '#1a365d',
                          color: score > 0 ? '#1d4ed8' : '#ffffff',
                          boxShadow: score > 0 ? 'none' : '0 4px 6px -1px rgba(26, 54, 93, 0.15)'
                        }}
                        onClick={() => handleMockClick(mock.id)}
                      >
                        {score > 0 ? 'Làm lại đề thi' : 'Bắt đầu làm đề'}
                      </Button>
                    </S.MockTestCard>
                  );
                })}
              </S.MockTestGrid>
            )}
          </S.Container>
        </HomeS.ContentArea>
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default ReadingPracticePage;
