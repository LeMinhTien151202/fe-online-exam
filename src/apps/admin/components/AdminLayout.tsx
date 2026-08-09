import React, { useState, useEffect, useMemo } from 'react';
import { ConfigProvider, Breadcrumb, Badge, Button, Drawer, Layout } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined,
  UserOutlined,
  DashboardOutlined,
  TeamOutlined,
  BookOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  CheckSquareOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { useRouterState, useNavigate, Outlet, Link, type LinkProps } from '@tanstack/react-router';
import * as S from '../styles/layout.styled';
import { ADMIN_THEME, ADMIN_COLORS } from '../constants';
import { GlobalAdminStyle } from '../styles/GlobalAdminStyle';
import { useGeneralSettings } from '../pages/admin-settings/hook/useGeneralSettings';
import { useExamDetailQuery } from '../pages/admin-exams/services/examQuery';
import { useAppSelector } from '@/shared/store/hooks';
import { BYPASS_ROLE, ROLE_ACCESS, ROLE_LABEL, UserRole, hasAnyRole } from '@/shared/auth/roleAccess';

const AdminLayout: React.FC = () => {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const navigate = useNavigate();

  const { generalSettings } = useGeneralSettings();

  // Vai trò của người dùng đang đăng nhập -> lọc menu và hiển thị đúng danh tính.
  const user = useAppSelector((s) => s.auth.user);
  const role = (user?.role as UserRole | undefined) ?? undefined;
  const displayName = user?.fullName || user?.profile?.fullName || user?.email || 'Người dùng';
  const roleLabel = role ? ROLE_LABEL[role] : '';

  // Áp dụng nhận diện nền tảng (tên + favicon) từ cài đặt hệ thống
  useEffect(() => {
    document.title = `${generalSettings.appName} · Quản trị`;
  }, [generalSettings.appName]);

  useEffect(() => {
    if (!generalSettings.faviconUrl) return;
    let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = generalSettings.faviconUrl;
  }, [generalSettings.faviconUrl]);

  // Màu chủ đạo do admin cấu hình sẽ ghi đè token theme của khu vực quản trị
  const adminTheme = useMemo(
    () => ({
      ...ADMIN_THEME,
      token: { ...ADMIN_THEME.token, colorPrimary: generalSettings.primaryColor || ADMIN_COLORS.primary },
    }),
    [generalSettings.primaryColor],
  );

  // Breadcrumb trang chi tiết đề: hiển thị tên đề thay vì id (dùng cache query của trang chi tiết)
  const examIdMatch = currentPath.match(/^\/admin\/exams\/(\d+)/);
  const breadcrumbExamId = examIdMatch ? Number(examIdMatch[1]) : null;
  const { data: breadcrumbExam } = useExamDetailQuery(breadcrumbExamId);

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      if (width < 1280 && width >= 768) {
        setCollapsed(true);
      } else if (width >= 1280) {
        setCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate({ to: key });
    setMobileOpen(false);
  };

  const getBreadcrumbs = () => {
    const paths = currentPath.split('/').filter(Boolean);
    const breadcrumbItems = [
      {
        title: <Link to="/admin">Admin</Link>,
      },
    ];

    let currentAcc = '/admin';
    paths.forEach((path, index) => {
      if (path === 'admin') return;
      currentAcc += `/${path}`;

      let label = path.charAt(0).toUpperCase() + path.slice(1);
      // Trang chi tiết đề thi: thay id số bằng tên đề
      if (breadcrumbExamId && path === String(breadcrumbExamId)) {
        label = breadcrumbExam?.title ?? `Đề #${path}`;
      }
      else if (path === 'users') label = 'Người dùng';
      else if (path === 'questions') label = 'Ngân hàng câu hỏi';
      else if (path === 'exams') label = 'Bộ đề thi';
      else if (path === 'materials') label = 'Tài liệu học tập';
      else if (path === 'grading') label = 'Kết quả & Lịch sử thi';
      else if (path === 'settings') label = 'Cài đặt';
      else if (path === 'faq') label = 'Quản lý Q&A';
      else if (path === 'notifications') label = 'Quản lý thông báo';
      else if (path === 'create') label = 'Tạo bộ đề';

      breadcrumbItems.push({
        title: index === paths.length - 1 ? <span>{label}</span> : <Link to={currentAcc as LinkProps['to']}>{label}</Link>,
      });
    });

    return breadcrumbItems;
  };

  // allowedRoles ánh xạ theo @PreAuthorize: adminOnly (Người dùng/Cài đặt),
  // còn lại (gồm cả Tổng quan & Thông báo) là ADMIN + TEACHER.
  const allMenuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: 'Tổng quan',
      allowedRoles: ROLE_ACCESS.contentManagers,
    },
    {
      key: 'users-group',
      icon: <TeamOutlined />,
      label: 'Người dùng',
      allowedRoles: ROLE_ACCESS.adminOnly,
      children: [
        { key: '/admin/users', label: 'Danh sách người dùng' },
      ],
    },
    {
      key: 'questions-group',
      icon: <BookOutlined />,
      label: 'Ngân hàng câu hỏi',
      allowedRoles: ROLE_ACCESS.contentManagers,
      children: [
        { key: '/admin/questions/grammar', label: 'Ngữ pháp & Từ vựng' },
        { key: '/admin/questions/reading', label: 'Đọc hiểu' },
        { key: '/admin/questions/listening', label: 'Nghe' },
        { key: '/admin/questions/speaking', label: 'Nói' },
        { key: '/admin/questions/writing', label: 'Viết' },
      ],
    },
    {
      key: 'exams-group',
      icon: <FileTextOutlined />,
      label: 'Bộ đề thi',
      allowedRoles: ROLE_ACCESS.contentManagers,
      children: [
        { key: '/admin/exams', label: 'Danh sách bộ đề' },
        { key: '/admin/exams/create', label: 'Tạo bộ đề mới' },
      ],
    },
    {
      key: '/admin/materials',
      icon: <FolderOpenOutlined />,
      label: 'Tài liệu học tập',
      allowedRoles: ROLE_ACCESS.contentManagers,
    },
    {
      key: '/admin/grading',
      icon: <CheckSquareOutlined />,
      label: 'Kết quả & Lịch sử thi',
      allowedRoles: ROLE_ACCESS.contentManagers,
    },
    {
      key: '/admin/faq',
      icon: <QuestionCircleOutlined />,
      label: 'Quản lý Q&A',
      allowedRoles: ROLE_ACCESS.contentManagers,
    },
    {
      key: '/admin/notifications',
      icon: <BellOutlined />,
      label: 'Quản lý thông báo',
      allowedRoles: ROLE_ACCESS.contentManagers,
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt hệ thống',
      allowedRoles: ROLE_ACCESS.adminOnly,
    },
  ];

  // Lọc menu theo vai trò rồi bỏ trường allowedRoles trước khi đưa vào antd Menu.
  const menuItems = allMenuItems
    .filter((item) => BYPASS_ROLE || hasAnyRole(role, item.allowedRoles))
    .map((item) => {
      const rest = { ...item };
      delete (rest as Partial<typeof item>).allowedRoles;
      return rest;
    });

  const getSelectedKeys = () => {
    if (currentPath === '/admin') return ['/admin'];
    if (currentPath.startsWith('/admin/users')) return ['/admin/users'];
    if (currentPath.startsWith('/admin/questions')) {
      const match = currentPath.match(/^\/admin\/questions\/([a-z-]+)/);
      if (match) return [`/admin/questions/${match[1]}`];
      return ['/admin/questions/grammar'];
    }
    if (currentPath.startsWith('/admin/exams/create')) return ['/admin/exams/create'];
    if (currentPath.startsWith('/admin/exams')) return ['/admin/exams'];
    if (currentPath.startsWith('/admin/materials')) return ['/admin/materials'];
    if (currentPath.startsWith('/admin/grading')) return ['/admin/grading'];
    if (currentPath.startsWith('/admin/settings')) return ['/admin/settings'];
    if (currentPath.startsWith('/admin/faq')) return ['/admin/faq'];
    if (currentPath.startsWith('/admin/notifications')) return ['/admin/notifications'];
    return [];
  };

  const getOpenKeys = () => {
    if (collapsed) return [];
    const keys: string[] = [];
    if (currentPath.startsWith('/admin/users')) keys.push('users-group');
    if (currentPath.startsWith('/admin/questions')) keys.push('questions-group');
    if (currentPath.startsWith('/admin/exams')) keys.push('exams-group');
    return keys;
  };

  const renderSidebarContent = () => (
    <>
      <S.LogoWrapper $collapsed={collapsed} onClick={() => navigate({ to: '/admin' })}>
        <img src={generalSettings.logoUrl || '/image.png'} alt={`${generalSettings.appName} Logo`} />
        <span>{generalSettings.appName}</span>
      </S.LogoWrapper>
      <S.MenuWrapper>
        <S.StyledMenu
          mode="inline"
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={getOpenKeys()}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </S.MenuWrapper>
      <S.UserCard $collapsed={collapsed}>
        <div className="avatar">{displayName.charAt(0).toUpperCase()}</div>
        <div className="info">
          <span className="name">{displayName}</span>
          <span className="role">{roleLabel}</span>
        </div>
      </S.UserCard>
    </>
  );

  const isMobile = windowWidth < 768;

  return (
    <ConfigProvider theme={adminTheme}>
      <GlobalAdminStyle />
      <S.StyledLayout>
        {/* Desktop Sider */}
        {!isMobile && (
          <S.StyledSider
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            width={260}
            collapsedWidth={64}
            trigger={null}
          >
            {renderSidebarContent()}
          </S.StyledSider>
        )}

        {/* Mobile Sider Drawer */}
        {isMobile && (
          <Drawer
            placement="left"
            closable={false}
            onClose={() => setMobileOpen(false)}
            open={mobileOpen}
            size={260}
            styles={{ body: { padding: 0, background: ADMIN_COLORS.sidebarBg } }}
          >
            {renderSidebarContent()}
          </Drawer>
        )}

        <Layout
          style={{
            marginLeft: isMobile ? 0 : collapsed ? 64 : 260,
            transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <S.StyledHeader>
            <S.HeaderLeft>
              {!isMobile ? (
                <Button
                  type="text"
                  icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  onClick={() => setCollapsed(!collapsed)}
                  style={{ fontSize: '16px', width: 40, height: 40 }}
                />
              ) : (
                <Button
                  type="text"
                  icon={<MenuUnfoldOutlined />}
                  onClick={() => setMobileOpen(true)}
                  style={{ fontSize: '16px', width: 40, height: 40 }}
                />
              )}
              <Breadcrumb items={getBreadcrumbs()} />
            </S.HeaderLeft>
            <S.HeaderRight>
              <Badge count={5} size="small">
                <Button type="text" icon={<BellOutlined />} style={{ fontSize: '18px' }} />
              </Badge>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <UserOutlined style={{ color: ADMIN_COLORS.primary }} />
                </div>
                {!isMobile && (
                  <span style={{ fontSize: '14px', fontWeight: 600, color: ADMIN_COLORS.textPrimary }}>
                    {displayName}
                  </span>
                )}
              </div>
            </S.HeaderRight>
          </S.StyledHeader>

          {/* Main Content */}
          <S.StyledContent>
            <Outlet />
          </S.StyledContent>
        </Layout>
      </S.StyledLayout>
    </ConfigProvider>
  );
};

export default AdminLayout;
