import React, { useState, useRef, useEffect } from 'react';
import { Badge, Tooltip } from 'antd';
import {
  DownOutlined
} from '@ant-design/icons';
import { useRouterState, useNavigate } from '@tanstack/react-router';
import { useAppSelector } from '@/shared/store/hooks';
import { useLogout } from '@/shared/hooks/useLogout';
import { useNotifications } from '../hook/useNotifications';
import * as S from './Sidebar.styled';

interface SidebarProps {
  onClose?: () => void;
}

// 5 kỹ năng dùng chung 2 mục con: "Bài tập theo phần" & "Luyện theo bộ đề"
const SKILL_MENUS = [
  { key: 'grammar', label: 'Ngữ pháp & Từ vựng', icon: 'spellcheck', path: '/grammar' },
  { key: 'reading', label: 'Đọc', icon: 'auto_stories', path: '/reading' },
  { key: 'listening', label: 'Nghe', icon: 'headphones', path: '/listening' },
  { key: 'speaking', label: 'Nói', icon: 'mic', path: '/speaking' },
  { key: 'writing', label: 'Viết', icon: 'edit_document', path: '/writing' },
] as const;

const EXAM_ROUTE_PATTERNS = [
  /^\/(grammar|reading|listening|speaking|writing)\/part\/\d+$/,
  /^\/(grammar|reading|listening|speaking|writing)\/mock-test\/[^/]+$/,
  /^\/grammar\/test$/,
  /^\/mock-exam\/main\/[^/]+$/,
];

const isExamRoute = (path: string) => EXAM_ROUTE_PATTERNS.some((pattern) => pattern.test(path));

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  // Đọc search từ router state (reactive) thay vì window.location
  const currentSearch = routerState.location.search as Record<string, unknown>;
  // Đang ở tab "Luyện theo bộ đề" của kỹ năng này?
  const isMockTab = (path: string) => currentPath === path && currentSearch?.tab === 'mock-tests';
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { logout } = useLogout();
  const { groupedNotifications, unreadCount, handleMarkRead, handleReadAll } = useNotifications();

  const displayName = user?.fullName || user?.profile?.fullName || user?.email || 'Thí sinh';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    if (onClose) onClose();
  };

  const isExamMode = isExamRoute(currentPath);
  const [sidebarOverride, setSidebarOverride] = useState<{
    path: string;
    collapsed: boolean;
  } | null>(null);
  const collapsed = sidebarOverride?.path === currentPath
    ? sidebarOverride.collapsed
    : isExamMode;
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SKILL_MENUS.map((menu) => [menu.key, currentPath.startsWith(menu.path)]))
  );

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
    if (collapsed) {
      setSidebarOverride({ path: currentPath, collapsed: false });
    }
    setOpenMenus(prev => ({
      ...Object.fromEntries(SKILL_MENUS.map((menu) => [menu.key, false])),
      [key]: !prev[key],
    }));
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

  // Route kỹ năng chưa khai báo validateSearch nên phải ép kiểu search
  const goToSkillTab = (path: string, tab?: 'mock-tests') => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigate({ to: path, search: tab ? { tab } : {} } as any);
    if (onClose) onClose();
  };

  const handleLoginClick = () => {
    navigate({ to: '/login' });
    if (onClose) onClose();
  };

  return (
    <S.SidebarContainer onClick={(e) => e.stopPropagation()} $collapsed={collapsed}>
      <button
        className="collapse-btn"
        aria-label={collapsed ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng'}
        onClick={(e) => {
          e.stopPropagation();
          setSidebarOverride({ path: currentPath, collapsed: !collapsed });
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
            <Tooltip title={collapsed ? 'Bảng điều khiển' : ''} placement="right">
              <S.NavLink as="div" $active={currentPath === '/'} onClick={handleHomeClick} $collapsed={collapsed}>
                <span className="material-symbols-outlined">dashboard</span>
                <span className="nav-text">Bảng điều khiển</span>
              </S.NavLink>
            </Tooltip>

            {/* 5 kỹ năng: mỗi kỹ năng có 2 mục con thống nhất */}
            {SKILL_MENUS.map((menu) => (
              <S.NavItemWrapper key={menu.key}>
                <Tooltip title={collapsed ? menu.label : ''} placement="right">
                  <S.NavLink
                    as="div"
                    onClick={() => isExamMode && collapsed ? goToSkillTab(menu.path) : toggleMenu(menu.key)}
                    $collapsed={collapsed}
                    $active={currentPath.startsWith(menu.path)}
                    $isOpen={openMenus[menu.key]}
                  >
                    <span className="material-symbols-outlined">{menu.icon}</span>
                    <span className="nav-text">{menu.label}</span>
                    {renderArrow(openMenus[menu.key])}
                  </S.NavLink>
                </Tooltip>
                <S.SubMenuWrapper $isOpen={openMenus[menu.key]} $collapsed={collapsed}>
                  <S.NavLink
                    as="div"
                    $isSub
                    $active={currentPath.startsWith(menu.path) && !isMockTab(menu.path)}
                    onClick={() => goToSkillTab(menu.path)}
                    $collapsed={collapsed}
                  >
                    <span className="nav-text">Bài tập theo phần</span>
                  </S.NavLink>
                  <S.NavLink
                    as="div"
                    $isSub
                    $active={isMockTab(menu.path)}
                    onClick={() => goToSkillTab(menu.path, 'mock-tests')}
                    $collapsed={collapsed}
                  >
                    <span className="nav-text">Luyện theo bộ đề</span>
                  </S.NavLink>
                </S.SubMenuWrapper>
              </S.NavItemWrapper>
            ))}
          </div>
        </S.NavSection>

        <S.NavSection>
          <S.SectionTitle $collapsed={collapsed}>
            <span className="text">Tài liệu & Tiện ích</span>
            <div className="line" />
          </S.SectionTitle>
          <div className="space-y-1">
            <Tooltip title={collapsed ? 'Thi thử' : ''} placement="right">
              <S.ProLink as="div" $active={currentPath.startsWith('/mock-exam')} onClick={() => {
                navigate({ to: '/mock-exam' });
                if (onClose) onClose();
              }} $collapsed={collapsed}>
                <span className="material-symbols-outlined">stars</span>
                <span className="nav-text">Thi thử</span>
                <Badge status="processing" className="ml-auto" />
              </S.ProLink>
            </Tooltip>
            <Tooltip title={collapsed ? 'Tài liệu học tập' : ''} placement="right">
              <S.NavLink as="div" $active={currentPath === '/materials'} onClick={() => {
                navigate({ to: '/materials' });
                if (onClose) onClose();
              }} $collapsed={collapsed}>
                <span className="material-symbols-outlined">library_books</span>
                <span className="nav-text">Tài liệu học tập</span>
              </S.NavLink>
            </Tooltip>
            <Tooltip title={collapsed ? 'Góc giải đáp' : ''} placement="right">
              <S.NavLink as="div" $active={currentPath === '/faq'} onClick={() => {
                navigate({ to: '/faq' });
                if (onClose) onClose();
              }} $collapsed={collapsed}>
                <span className="material-symbols-outlined">forum</span>
                <span className="nav-text">Góc giải đáp (Q&A)</span>
              </S.NavLink>
            </Tooltip>
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
            <button className="mark-read-btn" onClick={(e) => { e.stopPropagation(); handleReadAll(); }}>
              Đánh dấu đã đọc
            </button>
          </S.PopoverHeader>

          <S.PopoverBody>
            {Object.keys(groupedNotifications).length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.8125rem' }}>
                Chưa có thông báo nào.
              </div>
            ) : (
              Object.entries(groupedNotifications).map(([group, list]) => (
                <React.Fragment key={group}>
                  <S.TimeGroupTitle>{group}</S.TimeGroupTitle>
                  {list.map(notif => (
                    <S.NotificationEntry
                      key={notif.id}
                      tabIndex={0}
                      onClick={() => handleMarkRead(notif.id, notif.receiverId)}
                      style={{ opacity: notif.isRead ? 0.6 : 1 }}
                    >
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
              ))
            )}
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
                    {collapsed && unreadCount > 0 && <S.CollapsedBadge>{unreadCount}</S.CollapsedBadge>}
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
                      {unreadCount > 0 && <S.NotificationBadge>{unreadCount}</S.NotificationBadge>}
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
