import React from 'react';
import { Sidebar } from '../../home/components/Sidebar';
import { 
  AudioOutlined, 
  UnorderedListOutlined, 
  MessageOutlined, 
  TeamOutlined, 
  BellOutlined, 
  MenuOutlined,
  ClockCircleOutlined,
  QuestionCircleOutlined,
  TrophyOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { PartCard, IPracticePart } from '../components/PartCard';
import * as S from './styled';
import * as HomeS from '../../home/pages/styled';
import { Drawer, Button, Segmented, Progress } from 'antd';
import { Link, useNavigate } from '@tanstack/react-router';

const speakingPartsData: Omit<IPracticePart, 'progress'>[] = [
  {
    id: 's1',
    title: 'Phần 1',
    subTitle: 'Sentence Comprehension',
    difficulty: 'easy',
    description: 'Answer three personal questions about yourself and your interests. Aim for ~30 seconds each, keeping it clear and natural.',
    icon: <AudioOutlined />,
    theme: { bgColor: '#e0f2fe', textColor: '#0284c7', borderColor: '#e5e7eb' }
  },
  {
    id: 's2',
    title: 'Phần 2',
    subTitle: 'Describe, Express Opinion & Explain',
    difficulty: 'medium',
    description: 'Describe a photo and answer two follow-up questions. Share your experience and broaden the topic for about 45 seconds each.',
    icon: <UnorderedListOutlined />,
    theme: { bgColor: '#e0e7ff', textColor: '#4f46e5', borderColor: '#e5e7eb' }
  },
  {
    id: 's3',
    title: 'Phần 3',
    subTitle: 'Compare & Provide Reasons',
    difficulty: 'medium',
    description: 'Compare two related photos and respond to two questions asking for opinions or speculation. Target a structured 45-second answer.',
    icon: <MessageOutlined />,
    theme: { bgColor: '#ffedd5', textColor: '#ea580c', borderColor: '#e5e7eb' }
  },
  {
    id: 's4',
    title: 'Phần 4',
    subTitle: 'Discuss Experience & Opinion',
    difficulty: 'hard',
    description: 'Prepare for one minute, then speak for two minutes on three questions about an abstract topic. Use prep time to outline and note key ideas.',
    icon: <TeamOutlined />,
    theme: { bgColor: '#f3e8ff', textColor: '#9333ea', borderColor: '#e5e7eb' }
  }
];

const mockTestsData = [
  { id: 'm1', title: 'Đề Nói số 1', questions: 12, duration: 20, difficulty: 'medium' as const },
  { id: 'm2', title: 'Đề Nói số 2', questions: 12, duration: 20, difficulty: 'hard' as const },
  { id: 'm3', title: 'Đề Nói số 3', questions: 12, duration: 20, difficulty: 'easy' as const }
];

export const SpeakingPracticePage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'parts' | 'mock-tests'>('parts');
  const navigate = useNavigate();

  const [speakingProgress, setSpeakingProgress] = React.useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('aptis_speaking_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return { s1: 0, s2: 0, s3: 0, s4: 0 };
  });

  const [mockProgress, setMockProgress] = React.useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('aptis_speaking_mock_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return { m1: 0, m2: 0, m3: 0 };
  });

  const parts = speakingPartsData.map((part) => ({
    ...part,
    progress: speakingProgress[part.id] ?? 0,
  }));

  const completedCount = Object.values(speakingProgress).filter((prog) => prog === 100).length;

  const handlePartClick = (partId: string) => {
    const num = partId.replace('s', '');
    navigate({ to: `/speaking/part/${num}` });
  };

  const handleMockClick = (mockId: string) => {
    navigate({ to: `/speaking/mock-test/${mockId}` as any });
  };

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

            {/* Tab selector for Parts vs Mock Tests */}
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

            {activeTab === 'parts' ? (
              <S.PartsContainer>
                {parts.map((part) => (
                  <PartCard
                    key={part.id}
                    part={part}
                    onClick={() => handlePartClick(part.id)}
                  />
                ))}
              </S.PartsContainer>
            ) : (
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
                          background: hasDone ? '#eff6ff' : '#1a365d',
                          borderColor: hasDone ? '#bfdbfe' : '#1a365d',
                          color: hasDone ? '#1d4ed8' : '#ffffff',
                          boxShadow: hasDone ? 'none' : '0 4px 6px -1px rgba(26, 54, 93, 0.15)'
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
