import React from 'react';
import { Sidebar } from '../../../../home/components/Sidebar';
import {
  AudioOutlined,
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
import { useLandingAction } from '../hook/useLandingAction';
import { speakingPartsData, mockTestsData } from '../services/data';

export const SpeakingPracticePage: React.FC = () => {
  const {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    activeTab,
    setActiveTab,
    speakingProgress,
    mockProgress,
    completedCount,
    handlePartClick,
    handleMockClick,
  } = useLandingAction();

  const parts = speakingPartsData.map((part) => ({
    ...part,
    progress: speakingProgress[part.id] ?? 0,
  }));

  return (
    <HomeS.MainLayout>
      <Sidebar />

      <Drawer
        placement="left"
        onClose={() => setIsMobileMenuOpen(false)}
        open={isMobileMenuOpen}
        styles={{ body: { padding: 0, background: '#001A41' } }}
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
                  <AudioOutlined /> KỸ NĂNG NÓI
                </S.CategoryTag>
                <S.PageTitle>Luyện Tập Nói Tiếng Anh Aptis</S.PageTitle>
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
                  const hasDone = mockProgress[mock.id] === 100;
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
                          <span>Số câu hỏi: {mock.questions} câu ghi âm</span>
                        </S.MetaItem>
                        <S.MetaItem>
                          <ClockCircleOutlined />
                          <span>Thời gian: {mock.duration} phút</span>
                        </S.MetaItem>
                        <S.MetaItem>
                          <TrophyOutlined />
                          <span>
                            Kết quả tốt nhất:{' '}
                            {hasDone ? (
                              <strong style={{ color: '#10b981' }}>Đã hoàn thành (100%)</strong>
                            ) : (
                              <span style={{ color: '#64748b' }}>Chưa làm</span>
                            )}
                          </span>
                        </S.MetaItem>
                      </S.MockTestMeta>

                      {hasDone && (
                        <div style={{ marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>
                            <span>Tiến độ</span>
                            <span>100%</span>
                          </div>
                          <Progress percent={100} size="small" strokeColor="#10b981" showInfo={false} />
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
                          background: hasDone ? '#eff6ff' : '#00205B',
                          borderColor: hasDone ? '#bfdbfe' : '#00205B',
                          color: hasDone ? '#1d4ed8' : '#ffffff',
                          boxShadow: hasDone ? 'none' : '0 4px 6px -1px rgba(0, 32, 91, 0.15)'
                        }}
                        onClick={() => handleMockClick(mock.id)}
                      >
                        {hasDone ? 'Làm lại đề thi' : 'Bắt đầu làm đề'}
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

export default SpeakingPracticePage;
