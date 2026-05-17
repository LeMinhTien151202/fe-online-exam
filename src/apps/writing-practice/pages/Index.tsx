import React from 'react';
import { Sidebar } from '../../home/components/Sidebar';
import { AlignLeftOutlined, UnorderedListOutlined, MessageOutlined, MailOutlined, EditOutlined, BellOutlined, MenuOutlined } from '@ant-design/icons';
import { PartCard, IPracticePart } from '../components/PartCard';
import * as S from './styled';
import * as HomeS from '../../home/pages/styled';
import { Drawer, Button } from 'antd';
import { Link } from '@tanstack/react-router';

const writingParts: Omit<IPracticePart, 'progress'>[] = [
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
    title: 'Part 3: Three Written Parts of a Text',
    subTitle: 'Viết tương tác mạng xã hội',
    difficulty: 'medium',
    description: 'Bạn sẽ tương tác trong một nhóm chat/diễn đàn. Sẽ có 3 câu hỏi từ các thành viên khác và bạn cần trả lời mỗi câu (khoảng 30-40 từ/câu).',
    icon: <MessageOutlined />,
    theme: { bgColor: '#ffedd5', textColor: '#ea580c', borderColor: '#e5e7eb' }
  },
  {
    id: 'w4',
    title: 'Part 4: Formal and Informal Writing',
    subTitle: 'Viết email trang trọng & thân mật',
    difficulty: 'hard',
    description: 'Bạn nhận được một thông báo về một vấn đề nào đó. Bạn phải viết 1 email ngắn gọn, thân mật cho một người bạn (khoảng 50 từ) và 1 email trang trọng gửi cho ban quản lý/công ty (khoảng 120-150 từ).',
    icon: <MailOutlined />,
    theme: { bgColor: '#f3e8ff', textColor: '#9333ea', borderColor: '#e5e7eb' }
  }
];

export const WritingPracticePage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Quản lý trạng thái tiến trình cục bộ bằng React state (không sử dụng Redux)
  const [progress, setProgress] = React.useState<Record<string, number>>({
    w1: 0,
    w2: 0,
    w3: 0,
    w4: 0
  });

  const completedCount = Object.values(progress).filter(prog => prog === 100).length;

  const handlePartClick = (partId: string) => {
    setProgress(prev => {
      const current = prev[partId] ?? 0;
      const nextVal = current >= 100 ? 0 : current + 25;
      return {
        ...prev,
        [partId]: nextVal
      };
    });
  };

  const parts = writingParts.map(part => ({
    ...part,
    progress: progress[part.id] ?? 0
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
                  <EditOutlined /> KỸ NĂNG VIẾT
                </S.CategoryTag>
                <S.PageTitle>Thống kê 4 phần thi Aptis Writing</S.PageTitle>
                <S.SubTitle>Luyện tập 4 phần thi viết của đề thi APTIS chuẩn hóa. Từng phần thi được thiết kế để cải thiện tốc độ và sự mạch lạc trong văn viết.</S.SubTitle>
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

            <S.PartsContainer>
              {parts.map((part) => (
                <PartCard
                  key={part.id}
                  part={part as any}
                  onClick={() => handlePartClick(part.id)}
                />
              ))}
            </S.PartsContainer>
          </S.Container>
        </HomeS.ContentArea>
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default WritingPracticePage;
