import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Badge, Tooltip } from 'antd';
import {
  DownOutlined
} from '@ant-design/icons';
import { useRouterState, useNavigate } from '@tanstack/react-router';
import { useAppSelector } from '@/shared/store/hooks';
import { useLogout } from '@/shared/hooks/useLogout';
import * as S from './Sidebar.styled';

interface SidebarProps {
  onClose?: () => void;
}

interface Notification {
  id: number;
  type: string;
  icon: string;
  text: string;
  time: string;
  group: 'Hôm nay' | 'Hôm qua' | 'Tuần này';
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { logout } = useLogout();

  const displayName = user?.fullName || user?.profile?.fullName || user?.email || 'Thí sinh';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    if (onClose) onClose();
  };

  const [collapsed, setCollapsed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    doc: currentPath.startsWith('/reading'),
    nghe: currentPath.startsWith('/listening'),
    noi: currentPath.startsWith('/speaking'),
    viet: currentPath.startsWith('/writing')
  });

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    if (isNotifOpen) setIsNotifOpen(false);
  };

  const toggleNotif = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsNotifOpen(!isNotifOpen);
    if (isUserMenuOpen) setIsUserMenuOpen(false);
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

  const handleLoginClick = () => {
    navigate({ to: '/login' });
    if (onClose) onClose();
  };

  const notifications: Notification[] = [
    {
      id: 1,
      type: 'streak',
      icon: 'local_fire_department',
      text: 'Chuỗi 12 ngày học tập của bạn sắp bị ngắt. Vào ôn luyện ngay để duy trì phong độ!',
      time: '10 phút trước',
      group: 'Hôm nay'
    },
    {
      id: 2,
      type: 'mock-test',
      icon: 'auto_awesome',
      text: 'Bộ đề thi thử Aptis tháng 6 vừa được cập nhật! Thử sức ngay để biết trình độ hiện tại.',
      time: '1 giờ trước',
      group: 'Hôm nay'
    },
    {
      id: 3,
      type: 'progress',
      icon: 'emoji_events',
      text: 'Chúc mừng! Bạn đã hoàn thành 4/15 học phần tuần này, đạt 26% tiến độ.',
      time: 'Hôm qua',
      group: 'Hôm qua'
    },
    {
      id: 4,
      type: 'question',
      icon: 'school',
      text: 'Thầy cô vừa thêm 50 câu hỏi Ngữ pháp mới trong kho tài liệu.',
      time: '2 ngày trước',
      group: 'Tuần này'
    },
  ];

  const groupedNotifications = useMemo(() => {
    return notifications.reduce((acc, notif) => {
      if (!acc[notif.group]) acc[notif.group] = [];
      acc[notif.group].push(notif);
      return acc;
    }, {} as Record<string, Notification[]>);
  }, []);

  return (
    <S.SidebarContainer onClick={(e) => e.stopPropagation()} $collapsed={collapsed}>
      <button
        className="collapse-btn"
        aria-label="Toggle Sidebar"
        onClick={(e) => {
          e.stopPropagation();
          setCollapsed(!collapsed);
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
          {collapsed ? 'chevron_right' : 'chevron_left'}
        </span>
      </button>

      <S.LogoWrapper onClick={handleHomeClick} style={{ cursor: 'pointer' }} $collapsed={collapsed}>
        <img alt="Aptis Test Logo" src="/image.png" />
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
                <S.NavLink as="div" $isSub $active={currentPath === '/reading'} onClick={() => handleSkillClick('reading')} $collapsed={collapsed}>
                  <span className="nav-text">Bài tập theo phần</span>
                </S.NavLink>
                <S.NavLink as="div" $isSub $active={currentPath === '/reading' && window.location.search.includes('tab=mock-tests')} onClick={() => {
                  navigate({ to: '/reading', search: { tab: 'mock-tests' } as any });
                  if (onClose) onClose();
                }} $collapsed={collapsed}>
                  <span className="nav-text">Luyện theo bộ đề</span>
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
            <S.NavLink as="div" $active={currentPath === '/materials'} onClick={() => {
              navigate({ to: '/materials' });
              if (onClose) onClose();
            }} $collapsed={collapsed}>
              <span className="material-symbols-outlined">library_books</span>
              <span className="nav-text">Tài liệu học tập</span>
            </S.NavLink>
            <S.NavLink as="div" $active={currentPath === '/faq'} onClick={() => {
              navigate({ to: '/faq' });
              if (onClose) onClose();
            }} $collapsed={collapsed}>
              <span className="material-symbols-outlined">forum</span>
              <span className="nav-text">Góc giải đáp (Q&A)</span>
            </S.NavLink>
          </div>
        </S.NavSection>
      </S.NavContainer>

      {/* <S.OnlineBadge $collapsed={collapsed}>
        <div className="dot" />
        <span className="badge-text">1.245 học viên trực tuyến</span>
      </S.OnlineBadge> */}

      <div style={{ position: 'relative' }}>
        {/* Learning Notification Popover */}
        <S.NotificationPopover ref={notifRef} $isOpen={isNotifOpen} $collapsed={collapsed} role="dialog">
          <S.PopoverHeader>
            <h3>Thông báo học tập</h3>
            <button className="mark-read-btn" onClick={(e) => { e.stopPropagation(); setIsNotifOpen(false); }}>
              Đánh dấu đã đọc
            </button>
          </S.PopoverHeader>

          <S.PopoverBody>
            {Object.entries(groupedNotifications).map(([group, list]) => (
              <React.Fragment key={group}>
                <S.TimeGroupTitle>{group}</S.TimeGroupTitle>
                {list.map(notif => (
                  <S.NotificationEntry key={notif.id} tabIndex={0}>
                    <S.IconBox $type={notif.type}>
                      <span className="material-symbols-outlined">{notif.icon}</span>
                    </S.IconBox>
                    <S.EntryContent>
                      <div className="message">{notif.text}</div>
                      <div className="time">{notif.time}</div>
                    </S.EntryContent>
                  </S.NotificationEntry>
                ))}
              </React.Fragment>
            ))}
          </S.PopoverBody>

          <S.PopoverFooter>
            <button onClick={(e) => { e.stopPropagation(); setIsNotifOpen(false); }}>
              Xem tất cả thông báo
            </button>
          </S.PopoverFooter>
        </S.NotificationPopover>

        {/* User Profile Footer */}
        <S.UserProfileWrapper>
          {isAuthenticated ? (
            <div ref={userMenuRef}>
              <S.DropdownMenu $isOpen={isUserMenuOpen} $collapsed={collapsed}>
                <S.MenuItem onClick={() => { setIsUserMenuOpen(false); navigate({ to: '/profile' }); }}>
                  <span className="material-symbols-outlined">person</span>
                  Hồ sơ cá nhân
                </S.MenuItem>
                <S.MenuItem onClick={() => setIsUserMenuOpen(false)}>
                  <span className="material-symbols-outlined">settings</span>
                  Cài đặt tài khoản
                </S.MenuItem>
                <S.MenuItem $danger onClick={handleLogout}>
                  <span className="material-symbols-outlined">logout</span>
                  Đăng xuất
                </S.MenuItem>
              </S.DropdownMenu>

              <Tooltip title={collapsed ? displayName : ""} placement="right">
                <S.UserProfileCard
                  $collapsed={collapsed}
                  $isActive={isUserMenuOpen}
                  onClick={toggleUserMenu}
                >
                  <div className="avatar-container" onClick={collapsed ? toggleNotif : undefined}>
                    <div className="avatar">{avatarLetter}</div>
                    {collapsed && <S.CollapsedBadge>4</S.CollapsedBadge>}
                  </div>
                  <div className="user-info">
                    <div className="name">{displayName}</div>
                    <div className="plan">Gói Miễn phí</div>
                  </div>
                  {!collapsed && (
                    <div
                      className="notif-wrapper"
                      onClick={toggleNotif}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>notifications</span>
                      <S.NotificationBadge>4</S.NotificationBadge>
                    </div>
                  )}
                </S.UserProfileCard>
              </Tooltip>
            </div>
          ) : (
            <>
              {collapsed ? (
                <Tooltip title="Đăng nhập ngay" placement="right">
                  <S.CollapsedLoginBtn onClick={handleLoginClick}>
                    <span className="material-symbols-outlined">login</span>
                  </S.CollapsedLoginBtn>
                </Tooltip>
              ) : (
                <S.LoginCTAWrapper>
                  <S.LoginCTATitle>
                    🎯 Chinh phục mục tiêu B2
                  </S.LoginCTATitle>
                  <S.LoginCTADesc>
                    Lưu tiến độ học tập, điểm dự đoán và kết quả thi thử của bạn.
                  </S.LoginCTADesc>
                  <S.CTAButtonGroup>
                    <S.PrimaryCTAButton onClick={handleLoginClick}>
                      Đăng nhập ngay
                    </S.PrimaryCTAButton>
                    <S.SecondaryCTAButton onClick={() => navigate({ to: '/register' })}>
                      Tạo tài khoản miễn phí
                    </S.SecondaryCTAButton>
                  </S.CTAButtonGroup>
                </S.LoginCTAWrapper>
              )}
            </>
          )}
        </S.UserProfileWrapper>
      </div>
    </S.SidebarContainer>
  );
};
