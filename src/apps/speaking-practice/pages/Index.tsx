import React from 'react';
import { Sidebar } from '../../home/components/Sidebar';
import { AudioOutlined, UnorderedListOutlined, MessageOutlined, TeamOutlined, BellOutlined, MenuOutlined } from '@ant-design/icons';
import { PartCard, IPracticePart } from '../components/PartCard';
import * as S from './styled';
import * as HomeS from '../../home/pages/styled';
import { Drawer, Button } from 'antd';
import { Link } from '@tanstack/react-router';

const speakingParts: IPracticePart[] = [
  {
    id: 's1',
    title: 'Phần 1',
    subTitle: 'Sentence Comprehension',
    difficulty: 'easy',
    description: 'Answer three personal questions about yourself and your interests. Aim for ~30 seconds each, keeping it clear and natural.',
    progress: 0,
    icon: <AudioOutlined />,
    theme: { bgColor: '#e0f2fe', textColor: '#0284c7', borderColor: '#e5e7eb' }
  },
  {
    id: 's2',
    title: 'Phần 2',
    subTitle: 'Describe, Express Opinion & Explain',
    difficulty: 'medium',
    description: 'Describe a photo and answer two follow-up questions. Share your experience and broaden the topic for about 45 seconds each.',
    progress: 0,
    icon: <UnorderedListOutlined />,
    theme: { bgColor: '#e0e7ff', textColor: '#4f46e5', borderColor: '#e5e7eb' }
  },
  {
    id: 's3',
    title: 'Phần 3',
    subTitle: 'Compare & Provide Reasons',
    difficulty: 'medium',
    description: 'Compare two related photos and respond to two questions asking for opinions or speculation. Target a structured 45-second answer.',
    progress: 0,
    icon: <MessageOutlined />,
    theme: { bgColor: '#ffedd5', textColor: '#ea580c', borderColor: '#e5e7eb' }
  },
  {
    id: 's4',
    title: 'Phần 4',
    subTitle: 'Discuss Experience & Opinion',
    difficulty: 'hard',
    description: 'Prepare for one minute, then speak for two minutes on three questions about an abstract topic. Use prep time to outline and note key ideas.',
    progress: 0,
    icon: <TeamOutlined />,
    theme: { bgColor: '#f3e8ff', textColor: '#9333ea', borderColor: '#e5e7eb' }
  }
];

export const SpeakingPracticePage: React.FC = () => {
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
                  <AudioOutlined /> KỸ NĂNG NÓI
                </S.CategoryTag>
                <S.PageTitle>Question-based Speaking practice</S.PageTitle>
                <S.SubTitle>Practice speaking through the 4 APTIS parts. Each part has a different response length—read carefully and build natural reactions.</S.SubTitle>
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
                    <span>12/40 Bài</span>
                  </div>
                </S.StatPill>
              </S.StatsContainer>
            </S.HeaderSection>

            <S.PartsContainer>
              {speakingParts.map((part) => (
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

export default SpeakingPracticePage;
