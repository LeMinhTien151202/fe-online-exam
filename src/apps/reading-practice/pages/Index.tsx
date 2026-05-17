import React from 'react';
import { Sidebar } from '../../home/components/Sidebar';
import { AlignLeftOutlined, UnorderedListOutlined, FileTextOutlined, CopyOutlined, ReadOutlined, BellOutlined, MenuOutlined } from '@ant-design/icons';
import { PartCard, IPracticePart } from '../components/PartCard';
import * as S from './styled';
import * as HomeS from '../../home/pages/styled';
import { Drawer, Button } from 'antd';
import { Link, useNavigate } from '@tanstack/react-router';

const readingParts: Omit<IPracticePart, 'progress'>[] = [
  {
    id: 'r1',
    title: 'Phần 1',
    subTitle: 'Đọc hiểu câu (Sentence Comprehension)',
    difficulty: 'easy',
    description: 'Chọn từ thích hợp để điền vào chỗ trống trong các câu ngắn, tập trung vào từ vựng cơ bản và cấu trúc ngữ pháp quen thuộc.',
    icon: <AlignLeftOutlined />,
    theme: { bgColor: '#e0f2fe', textColor: '#0284c7', borderColor: '#e5e7eb' }
  },
  {
    id: 'r2',
    title: 'Phần 2',
    subTitle: 'Sắp xếp đoạn văn (Text Cohesion)',
    difficulty: 'medium',
    description: 'Sắp xếp lại các câu bị xáo trộn để tạo thành một đoạn văn có nghĩa, kiểm tra khả năng hiểu mạch lạc và tính liên kết.',
    icon: <UnorderedListOutlined />,
    theme: { bgColor: '#e0e7ff', textColor: '#4f46e5', borderColor: '#e5e7eb' }
  },
  {
    id: 'r3',
    title: 'Phần 3',
    subTitle: 'Đọc hiểu đoạn văn ngắn (Short Text Comprehension)',
    difficulty: 'hard',
    description: 'Đọc các đoạn văn ngắn và chọn đáp án đúng để hoàn thành câu, yêu cầu hiểu ý chính và chi tiết cụ thể trong văn bản.',
    icon: <FileTextOutlined />,
    theme: { bgColor: '#ffedd5', textColor: '#ea580c', borderColor: '#e5e7eb' }
  },
  {
    id: 'r4',
    title: 'Phần 4',
    subTitle: 'Đọc hiểu đoạn văn dài (Long Text Comprehension)',
    difficulty: 'hard',
    description: 'Ghép các tiêu đề phù hợp với các đoạn văn trong một văn bản dài. Đòi hỏi kỹ năng đọc lướt, hiểu cấu trúc và tổng hợp ý chính toàn bài.',
    icon: <CopyOutlined />,
    theme: { bgColor: '#f3e8ff', textColor: '#9333ea', borderColor: '#e5e7eb' }
  }
];

export const ReadingPracticePage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const [readingProgress, setReadingProgress] = React.useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('aptis_reading_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return { r1: 75, r2: 40, r3: 10, r4: 0 };
  });

  const parts = readingParts.map((part) => ({
    ...part,
    progress: readingProgress[part.id] ?? 0,
  }));

  const completedCount = Object.values(readingProgress).filter((prog) => prog === 100).length;

  const handlePartClick = (partId: string) => {
    const currentProg = readingProgress[partId] ?? 0;
    const newProg = currentProg >= 100 ? 0 : currentProg + 25;
    
    const nextProgress = {
      ...readingProgress,
      [partId]: newProg
    };
    
    setReadingProgress(nextProgress);
    localStorage.setItem('aptis_reading_progress', JSON.stringify(nextProgress));

    // Định tuyến đến màn hình luyện tập tương ứng
    if (partId === 'r1') {
      navigate({ to: '/reading/part/1' });
    } else if (partId === 'r2') {
      navigate({ to: '/reading/part/2' });
    } else if (partId === 'r3') {
      navigate({ to: '/reading/part/3' });
    } else if (partId === 'r4') {
      navigate({ to: '/reading/part/4' });
    }
  };

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
                <S.SubTitle>Chọn một phần để bắt đầu luyện tập. Mỗi phần được thiết kế để mô phỏng định dạng và độ khó của bài thi thật.</S.SubTitle>
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

export default ReadingPracticePage;
