import React from 'react';
import { Sidebar } from '../../home/components/Sidebar';
import { BookOutlined, FormOutlined, BellOutlined, MenuOutlined, EditOutlined } from '@ant-design/icons';
import { PartCard, IPracticePart } from '../components/PartCard';
import * as S from './styled';
import * as HomeS from '../../home/pages/styled';
import { Drawer, Button } from 'antd';
import { Link } from '@tanstack/react-router';

const grammarParts: IPracticePart[] = [
  {
    id: 'g1',
    title: 'Part 1: Grammar',
    subTitle: '25 Multiple-choice questions',
    difficulty: 'medium',
    description: 'Answer 25 multiple-choice questions. Read each complete sentence carefully before selecting the option that best completes it. Feel free to flag difficult items and revisit them later.',
    progress: 0,
    icon: <BookOutlined />,
    theme: { bgColor: '#e6f4ff', textColor: '#1677ff', borderColor: '#e5e7eb' }
  },
  {
    id: 'g2',
    title: 'Part 2: Vocabulary',
    subTitle: '25 Multiple-choice questions',
    difficulty: 'medium',
    description: 'Complete 25 questions covering definitions, synonyms, usage in context, and common word combinations. Use context clues to determine the most natural choice.',
    progress: 0,
    icon: <FormOutlined />,
    theme: { bgColor: '#f6ffed', textColor: '#52c41a', borderColor: '#e5e7eb' }
  }
];

export const GrammarPracticePage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

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
                  <EditOutlined /> KỸ NĂNG NGỮ PHÁP & TỪ VỰNG
                </S.CategoryTag>
                <S.PageTitle>Học theo câu hỏi - Grammar & Vocabulary</S.PageTitle>
                <S.SubTitle>Luyện thi phần Grammar & Vocabulary của APTIS với 2 phần chính. Mỗi phần gồm 25 câu hỏi dạng trắc nghiệm – hãy quản lý thời gian thật tốt.</S.SubTitle>
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
                    <span>0/50 Câu</span>
                  </div>
                </S.StatPill>
              </S.StatsContainer>
            </S.HeaderSection>

            <S.PartsContainer>
              {grammarParts.map((part) => (
                <PartCard
                  key={part.id}
                  part={part}
                  onClick={() => console.log('Chuyển đến màn làm bài', part.id)}
                />
              ))}
            </S.PartsContainer>
          </S.Container>
        </HomeS.ContentArea>
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default GrammarPracticePage;
