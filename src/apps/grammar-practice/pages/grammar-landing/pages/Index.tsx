import {
  BellOutlined,
  ClockCircleOutlined,
  EditOutlined,
  MenuOutlined,
  QuestionCircleOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { Button, Drawer, Empty, Progress, Segmented, Spin } from 'antd';
import React from 'react';
import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import { PartCard } from '../components/PartCard';
import { useGrammarLanding } from '../hook/useGrammarLanding';
import * as S from '../styles/styled';

export const GrammarPracticePage: React.FC = () => {
  const {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    activeTab,
    setActiveTab,
    parts,
    mockProgress,
    examSets,
    isExamsLoading,
    handlePartClick,
    handleMockClick,
  } = useGrammarLanding();

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
          <S.MobileHeaderLink to="/" className="gap-2">
            <HomeS.HeaderLogo src="/image.png" alt="Logo" />
            <HomeS.HeaderTitle>Aptis Prep</HomeS.HeaderTitle>
          </S.MobileHeaderLink>
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
                  <EditOutlined /> KỸ NĂNG NGỮ PHÁP & TỪ VỰNG
                </S.CategoryTag>
                <S.PageTitle>Học theo câu hỏi - Grammar & Vocabulary</S.PageTitle>
                <S.SubTitle>Mô phỏng chính xác cấu trúc bài thi thực tế. Chọn ôn luyện riêng từng phần hoặc kiểm tra năng lực với bộ đề đầy đủ.</S.SubTitle>
              </S.HeaderContent>
              <S.StatsContainer>
                <S.StatPill>
                  <S.StatPillIcon $color="#ea580c">🔥</S.StatPillIcon>
                  <div className="info">
                    <span>Chuỗi ngày</span>
                    <span>5 Ngày</span>
                  </div>
                </S.StatPill>
              </S.StatsContainer>
            </S.HeaderSection>

            <S.TabSectionWrapper>
              <Segmented
                value={activeTab}
                onChange={(value) => setActiveTab(value as 'parts' | 'mock-tests')}
                options={[
                  { label: 'Luyện tập theo phần', value: 'parts' },
                  { label: 'Luyện tập theo bộ đề', value: 'mock-tests' },
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
                    <Empty description="Chưa có đề Grammar & Vocabulary nào" />
                  </div>
                ) : (
                  examSets.map((exam) => {
                    const score = mockProgress[String(exam.id)] ?? 0;

                    return (
                      <S.MockTestCard key={exam.id}>
                        <S.MockTestTitle>{exam.title}</S.MockTestTitle>

                        <S.MockTestMeta>
                          <S.MetaItem>
                            <QuestionCircleOutlined />
                            <span>Số phần: {exam._count?.sections ?? 0} phần</span>
                          </S.MetaItem>
                          <S.MetaItem>
                            <ClockCircleOutlined />
                            <span>Thời gian: 25 phút</span>
                          </S.MetaItem>
                          <S.MetaItem>
                            <TrophyOutlined />
                            <span>
                              Kết quả tốt nhất:{' '}
                              {score > 0 ? (
                                <S.TrophyScoreText>{score}%</S.TrophyScoreText>
                              ) : (
                                <S.TrophyEmptyText>Chưa làm</S.TrophyEmptyText>
                              )}
                            </span>
                          </S.MetaItem>
                        </S.MockTestMeta>

                        {score > 0 && (
                          <S.ScoreProgressWrapper>
                            <S.ScoreProgressHeader>
                              <span>Điểm số</span>
                              <span>{score}%</span>
                            </S.ScoreProgressHeader>
                            <Progress percent={score} size="small" strokeColor="#10b981" showInfo={false} />
                          </S.ScoreProgressWrapper>
                        )}

                        <S.MockStartButton
                          type="primary"
                          icon={<ThunderboltOutlined />}
                          $hasScore={score > 0}
                          onClick={() => handleMockClick(exam.id)}
                        >
                          {score > 0 ? 'Làm lại đề thi' : 'Bắt đầu làm đề'}
                        </S.MockStartButton>
                      </S.MockTestCard>
                    );
                  })
                )}
              </S.MockTestGrid>
            )}
          </S.Container>
        </HomeS.ContentArea>
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default GrammarPracticePage;
