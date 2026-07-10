import {
AlignLeftOutlined,
BellOutlined,
ClockCircleOutlined,
EditOutlined,
MailOutlined,
MenuOutlined,
MessageOutlined,
QuestionCircleOutlined,
ThunderboltOutlined,
TrophyOutlined,
UnorderedListOutlined
} from '@ant-design/icons';
import { Link,useNavigate } from '@tanstack/react-router';
import { Button,Drawer,Progress,Segmented } from 'antd';
import React from 'react';
import { Sidebar } from '../../home/components/Sidebar';
import * as HomeS from '../../home/pages/styled';
import { IPracticePart,PartCard } from '../components/PartCard';
import * as S from './styled';

const writingPartsData: Omit<IPracticePart, 'progress'>[] = [
  {
    id: 'w1',
    title: 'Part 1: Word-level Writing',
    subTitle: 'Viết cấp độ từ',
    difficulty: 'easy',
    description: 'Bạn sẽ tham gia một câu lạc bộ/nhóm và cần trả lời 5 câu hỏi ngắn bằng các từ hoặc cụm từ (1-5 từ/câu).',
    icon: <AlignLeftOutlined />,
    theme: { bgColor: '#e0f2fe', textColor: '#0284c7', borderColor: '#e5e7eb' }
  },
  {
    id: 'w2',
    title: 'Part 2: Short Text Writing',
    subTitle: 'Viết đoạn văn ngắn',
    difficulty: 'medium',
    description: 'Điền vào một biểu mẫu (form) của câu lạc bộ, yêu cầu viết các câu hoàn chỉnh (thường từ 20-30 từ).',
    icon: <UnorderedListOutlined />,
    theme: { bgColor: '#e0e7ff', textColor: '#4f46e5', borderColor: '#e5e7eb' }
  },
  {
    id: 'w3',
    title: 'Part 3: Social Network Interaction',
    subTitle: 'Tương tác mạng xã hội',
    difficulty: 'medium',
    description: 'Bạn sẽ tương tác trong một nhóm chat/diễn đàn. Sẽ có 3 câu hỏi từ các thành viên khác và bạn cần trả lời mỗi câu (khoảng 30-40 từ/câu).',
    icon: <MessageOutlined />,
    theme: { bgColor: '#ffedd5', textColor: '#ea580c', borderColor: '#e5e7eb' }
  },
  {
    id: 'w4',
    title: 'Part 4: Formal and Informal Emails',
    subTitle: 'Viết email trang trọng & thân mật',
    difficulty: 'hard',
    description: 'Bạn nhận được một thông báo về một vấn đề nào đó. Bạn phải viết 1 email ngắn gọn, thân mật cho một người bạn (khoảng 50 từ) và 1 email trang trọng gửi cho ban quản lý/công ty (khoảng 120-150 từ).',
    icon: <MailOutlined />,
    theme: { bgColor: '#f3e8ff', textColor: '#9333ea', borderColor: '#e5e7eb' }
  }
];

const mockTestsData = [
  { id: 'm1', title: 'Đề Viết số 1', questions: 11, duration: 50, difficulty: 'medium' as const },
  { id: 'm2', title: 'Đề Viết số 2', questions: 11, duration: 50, difficulty: 'hard' as const },
  { id: 'm3', title: 'Đề Viết số 3', questions: 11, duration: 50, difficulty: 'easy' as const }
];

export const WritingPracticePage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'parts' | 'mock-tests'>('parts');
  const navigate = useNavigate();

  const [writingProgress, setWritingProgress] = React.useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('aptis_writing_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return { w1: 0, w2: 0, w3: 0, w4: 0 };
  });

  const [mockProgress, setMockProgress] = React.useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('aptis_writing_mock_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return { m1: 0, m2: 0, m3: 0 };
  });

  const parts = writingPartsData.map((part) => ({
    ...part,
    progress: writingProgress[part.id] ?? 0,
  }));

  const completedCount = Object.values(writingProgress).filter((prog) => prog === 100).length;

  const handlePartClick = (partId: string) => {
    const num = partId.replace('w', '');
    navigate({ to: `/writing/part/${num}` });
  };

  const handleMockClick = (mockId: string) => {
    navigate({ to: `/writing/mock-test/${mockId}` as any });
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
                          <span>Số câu hỏi: {mock.questions} câu viết</span>
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
                          color: hasDone ? '#2f4a6b' : '#ffffff',
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

export default WritingPracticePage;
