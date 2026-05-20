import React from 'react';
import { Sidebar } from '../../home/components/Sidebar';
import { AudioOutlined, TeamOutlined, MessageOutlined, BookOutlined, BellOutlined, MenuOutlined } from '@ant-design/icons';
import { PartCard, IPracticePart } from '../components/PartCard';
import * as S from './styled';
import * as HomeS from '../../home/pages/styled';
import { Drawer, Button } from 'antd';
import { Link, useNavigate } from '@tanstack/react-router';

const listeningParts: IPracticePart[] = [
  {
    id: 'l1',
    title: 'Phần 1',
    subTitle: 'Questions 1 - 13',
    difficulty: 'easy',
    description: 'Identify specific information like phone numbers, times, or locations from short messages or brief dialogues.',
    progress: 0,
    icon: <AudioOutlined />,
    theme: { bgColor: '#e0f2fe', textColor: '#0284c7', borderColor: '#e5e7eb' }
  },
  {
    id: 'l2',
    title: 'Phần 2',
    subTitle: 'Question 14',
    difficulty: 'medium',
    description: 'Listen to four short monologues on a shared topic and match each speaker to the correct piece of information.',
    progress: 0,
    icon: <TeamOutlined />,
    theme: { bgColor: '#e0e7ff', textColor: '#4f46e5', borderColor: '#e5e7eb' }
  },
  {
    id: 'l3',
    title: 'Phần 3',
    subTitle: 'Question 15',
    difficulty: 'medium',
    description: 'Hear a man and a woman discuss a topic, then determine which speaker expresses each opinion.',
    progress: 0,
    icon: <MessageOutlined />,
    theme: { bgColor: '#ffedd5', textColor: '#ea580c', borderColor: '#e5e7eb' }
  },
  {
    id: 'l4',
    title: 'Phần 4',
    subTitle: 'Questions 16 - 17',
    difficulty: 'hard',
    description: 'Listen to two longer monologues on different topics and identify each speaker\'s viewpoint on specific aspects.',
    progress: 0,
    icon: <BookOutlined />,
    theme: { bgColor: '#f3e8ff', textColor: '#9333ea', borderColor: '#e5e7eb' }
  }
];

export const ListeningPracticePage: React.FC = () => {
  const navigate = useNavigate();
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
                  <AudioOutlined /> KỸ NĂNG NGHE
                </S.CategoryTag>
                <S.PageTitle>Question-based Listening practice</S.PageTitle>
                <S.SubTitle>Practice the 4 APTIS listening parts. Press Play for each audio (you can listen twice) and work through the accompanying questions.</S.SubTitle>
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
              {listeningParts.map((part) => (
                <PartCard
                  key={part.id}
                  part={part}
                  onClick={() => {
                    if (part.id === 'l1') {
                      navigate({ to: '/listening/part/1' });
                    } else if (part.id === 'l2') {
                      navigate({ to: '/listening/part/2' });
                    } else if (part.id === 'l3') {
                      navigate({ to: '/listening/part/3' });
                    } else if (part.id === 'l4') {
                      navigate({ to: '/listening/part/4' });
                    } else {
                      console.log('Chuyển đến màn làm bài', part.id);
                    }
                  }}
                />
              ))}
            </S.PartsContainer>
          </S.Container>
        </HomeS.ContentArea>
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default ListeningPracticePage;
