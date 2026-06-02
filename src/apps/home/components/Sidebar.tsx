import React, { useState } from 'react';
import { Badge } from 'antd';
import {
  BellOutlined,
  DownOutlined
} from '@ant-design/icons';
import { useRouterState, useNavigate } from '@tanstack/react-router';
import * as S from './Sidebar.styled';

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    doc: currentPath.startsWith('/reading'),
    nghe: currentPath.startsWith('/listening'),
    noi: currentPath.startsWith('/speaking'),
    viet: currentPath.startsWith('/writing')
  });

  const toggleMenu = (key: string) => {
    if (collapsed) setCollapsed(false);
    setOpenMenus(prev => {
      const next: Record<string, boolean> = {
        doc: false,
        nghe: false,
        noi: false,
        viet: false
      };
      next[key] = !prev[key];
      return next;
    });
  };

  const renderArrow = (isOpen: boolean) => (
    <DownOutlined
      className="arrow-icon"
      style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
    />
  );

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate({ to: '/' });
    if (onClose) onClose();
  };

  const handleSkillClick = (skill: 'reading' | 'listening' | 'speaking' | 'grammar' | 'writing') => {
    navigate({ to: `/${skill}` });
    if (onClose) onClose();
  };

  return (
    <S.SidebarContainer onClick={(e) => e.stopPropagation()} $collapsed={collapsed}>
      <button 
        className="collapse-btn"
        onClick={(e) => {
          e.stopPropagation();
          setCollapsed(!collapsed);
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
          {collapsed ? 'chevron_right' : 'chevron_left'}
        </span>
      </button>
      <S.LogoWrapper onClick={handleHomeClick} style={{ cursor: 'pointer' }} $collapsed={collapsed}>
        <img alt="Icon" src="/image.png" />
        <span>Aptis Test</span>
      </S.LogoWrapper>

      <S.NavContainer>
        <S.NavSection>
          <S.SectionTitle $collapsed={collapsed}>
            <span className="text">Luyện tập</span>
            <div className="line" />
          </S.SectionTitle>
          <div className="space-y-1">
            <S.NavLink as="div" $active={currentPath === '/'} onClick={handleHomeClick} $collapsed={collapsed}>
              <span className="material-symbols-outlined">dashboard</span>
              <span className="nav-text">Bảng điều khiển</span>
            </S.NavLink>

            <S.NavLink as="div" $active={currentPath === '/grammar'} onClick={() => handleSkillClick('grammar')} $collapsed={collapsed}>
              <span className="material-symbols-outlined">spellcheck</span>
              <span className="nav-text">Ngữ pháp & Từ vựng</span>
            </S.NavLink>

            {/* Mục Đọc */}
            <S.NavItemWrapper>
              <S.NavLink as="div" onClick={() => toggleMenu('doc')} $collapsed={collapsed} $active={currentPath.startsWith('/reading')} $isOpen={openMenus.doc}>
                <span className="material-symbols-outlined">auto_stories</span>
                <span className="nav-text">Đọc</span>
                {renderArrow(openMenus.doc)}
              </S.NavLink>
              <S.SubMenuWrapper $isOpen={openMenus.doc} $collapsed={collapsed}>
                <S.NavLink as="div" $isSub $active={currentPath === '/reading' && !window.location.search.includes('tab=mock-tests')} onClick={() => handleSkillClick('reading')} $collapsed={collapsed}>
                  <span className="nav-text">Bài tập theo phần</span>
                </S.NavLink>
                <S.NavLink as="div" $isSub $active={currentPath === '/reading' && window.location.search.includes('tab=mock-tests')} onClick={() => {
                  navigate({ to: '/reading', search: { tab: 'mock-tests' } as any });
                  if (onClose) onClose();
                }} $collapsed={collapsed}>
                  <span className="nav-text">Luyện theo bộ đề</span>
                </S.NavLink>
                <S.NavLink as="div" $isSub onClick={onClose} $collapsed={collapsed}>
                  <span className="nav-text">Mẹo làm bài</span>
                </S.NavLink>
              </S.SubMenuWrapper>
            </S.NavItemWrapper>

            {/* Mục Nghe */}
            <S.NavItemWrapper>
              <S.NavLink as="div" onClick={() => toggleMenu('nghe')} $collapsed={collapsed} $active={currentPath.startsWith('/listening')} $isOpen={openMenus.nghe}>
                <span className="material-symbols-outlined">headphones</span>
                <span className="nav-text">Nghe</span>
                {renderArrow(openMenus.nghe)}
              </S.NavLink>
              <S.SubMenuWrapper $isOpen={openMenus.nghe} $collapsed={collapsed}>
                <S.NavLink as="div" $isSub $active={currentPath.startsWith('/listening')} onClick={() => handleSkillClick('listening')} $collapsed={collapsed}>
                  <span className="nav-text">Luyện nghe hội thoại</span>
                </S.NavLink>
                <S.NavLink as="div" $isSub onClick={onClose} $collapsed={collapsed}>
                  <span className="nav-text">Luyện nghe thông báo</span>
                </S.NavLink>
              </S.SubMenuWrapper>
            </S.NavItemWrapper>

            {/* Mục Nói */}
            <S.NavItemWrapper>
              <S.NavLink as="div" onClick={() => toggleMenu('noi')} $collapsed={collapsed} $active={currentPath.startsWith('/speaking')} $isOpen={openMenus.noi}>
                <span className="material-symbols-outlined">mic</span>
                <span className="nav-text">Nói</span>
                {renderArrow(openMenus.noi)}
              </S.NavLink>
              <S.SubMenuWrapper $isOpen={openMenus.noi} $collapsed={collapsed}>
                <S.NavLink as="div" $isSub $active={currentPath.startsWith('/speaking')} onClick={() => handleSkillClick('speaking')} $collapsed={collapsed}>
                  <span className="nav-text">Luyện theo câu hỏi</span>
                </S.NavLink>
                <S.NavLink as="div" $isSub onClick={onClose} $collapsed={collapsed}>
                  <span className="nav-text">Mẹo học hay</span>
                </S.NavLink>
              </S.SubMenuWrapper>
            </S.NavItemWrapper>

            {/* Mục Viết */}
            <S.NavItemWrapper>
              <S.NavLink as="div" onClick={() => toggleMenu('viet')} $collapsed={collapsed} $active={currentPath.startsWith('/writing')} $isOpen={openMenus.viet}>
                <span className="material-symbols-outlined">edit_document</span>
                <span className="nav-text">Viết</span>
                {renderArrow(openMenus.viet)}
              </S.NavLink>
              <S.SubMenuWrapper $isOpen={openMenus.viet} $collapsed={collapsed}>
                <S.NavLink as="div" $isSub $active={currentPath.startsWith('/writing')} onClick={() => handleSkillClick('writing')} $collapsed={collapsed}>
                  <span className="nav-text">Bài viết theo phần</span>
                </S.NavLink>
                <S.NavLink as="div" $isSub onClick={onClose} $collapsed={collapsed}>
                  <span className="nav-text">Mẫu câu Speaking & Writing</span>
                </S.NavLink>
                <S.NavLink as="div" $isSub onClick={onClose} $collapsed={collapsed}>
                  <span className="nav-text">Luyện viết thư</span>
                </S.NavLink>
              </S.SubMenuWrapper>
            </S.NavItemWrapper>
          </div>
        </S.NavSection>

        <S.NavSection>
          <S.SectionTitle $collapsed={collapsed}>
            <span className="text">Tài liệu & Tiện ích</span>
            <div className="line" />
          </S.SectionTitle>
          <div className="space-y-1">
            <S.ProLink as="div" onClick={() => {
              navigate({ to: '/reading', search: { tab: 'mock-tests' } as any });
              if (onClose) onClose();
            }} $collapsed={collapsed}>
              <span className="material-symbols-outlined">stars</span>
              <span className="nav-text">Thi thử</span>
              <Badge status="warning" className="ml-auto" />
            </S.ProLink>
            <S.NavLink as="div" onClick={onClose} $collapsed={collapsed}>
              <span className="material-symbols-outlined">library_books</span>
              <span className="nav-text">Tài liệu học tập</span>
            </S.NavLink>
            <S.NavLink as="div" onClick={onClose} $collapsed={collapsed}>
              <span className="material-symbols-outlined">forum</span>
              <span className="nav-text">Góc giải đáp (Q&A)</span>
            </S.NavLink>
          </div>
        </S.NavSection>
      </S.NavContainer>

      <S.OnlineBadge $collapsed={collapsed}>
        <div className="dot" />
        <span className="badge-text">1.245 học viên trực tuyến</span>
      </S.OnlineBadge>

      <S.UserProfileCard $collapsed={collapsed}>
        <div className="avatar">T</div>
        <div className="user-info">
          <div className="name">Thí sinh</div>
          <div className="plan">Gói Miễn phí</div>
        </div>
        <button className="notification-btn">
          <BellOutlined style={{ fontSize: '20px' }} />
          <div className="dot" />
        </button>
      </S.UserProfileCard>
    </S.SidebarContainer>
  );
};
