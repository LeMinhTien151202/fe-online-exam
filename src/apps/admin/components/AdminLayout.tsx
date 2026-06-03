import React, { useState, useEffect } from 'react';
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
  BarChartOutlined,
  CheckSquareOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useRouterState, useNavigate, Outlet, Link } from '@tanstack/react-router';
import * as S from '../styles/layout.styled';
import { ADMIN_THEME, ADMIN_COLORS } from '../constants';

interface AdminLayoutProps {}

const AdminLayout: React.FC<AdminLayoutProps> = () => {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const navigate = useNavigate();

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
      if (path === 'users') label = 'Người dùng';
      else if (path === 'questions') label = 'Ngân hàng câu hỏi';
      else if (path === 'exams') label = 'Bộ đề thi';
      else if (path === 'materials') label = 'Tài liệu học tập';
      else if (path === 'progress') label = 'Tiến độ học viên';
      else if (path === 'grading') label = 'Chấm điểm';
      else if (path === 'settings') label = 'Cài đặt';
      else if (path === 'create') label = 'Tạo bộ đề';
      
      breadcrumbItems.push({
        title: index === paths.length - 1 ? <span>{label}</span> : <Link to={currentAcc as any}>{label}</Link>,
      });
    });

    return breadcrumbItems;
  };

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: 'Tổng quan',
    },
    {
      key: 'users-group',
      icon: <TeamOutlined />,
      label: 'Người dùng',
      children: [
        { key: '/admin/users', label: 'Danh sách học viên' },
      ],
    },
    {
      key: 'questions-group',
      icon: <BookOutlined />,
      label: 'Ngân hàng câu hỏi',
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
      children: [
        { key: '/admin/exams', label: 'Danh sách bộ đề' },
        { key: '/admin/exams/create', label: 'Tạo bộ đề mới' },
      ],
    },
    {
      key: '/admin/materials',
      icon: <FolderOpenOutlined />,
      label: 'Tài liệu học tập',
    },
    {
      key: '/admin/progress',
      icon: <BarChartOutlined />,
      label: 'Tiến độ học viên',
    },
    {
      key: '/admin/grading',
      icon: <CheckSquareOutlined />,
      label: 'Kết quả & Lịch sử thi',
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt hệ thống',
    },
  ];

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
    if (currentPath.startsWith('/admin/progress')) return ['/admin/progress'];
    if (currentPath.startsWith('/admin/grading')) return ['/admin/grading'];
    if (currentPath.startsWith('/admin/settings')) return ['/admin/settings'];
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
        <img src="/image.png" alt="Aptis Admin Logo" />
        <span>APTIS ADMIN</span>
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
        <div className="avatar">A</div>
        <div className="info">
          <span className="name">Administrator</span>
          <span className="role">Super Admin</span>
        </div>
      </S.UserCard>
    </>
  );

  const isMobile = windowWidth < 768;

  return (
    <ConfigProvider theme={ADMIN_THEME}>
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
            width={260}
            bodyStyle={{ padding: 0, background: ADMIN_COLORS.sidebarBg }}
          >
            {renderSidebarContent()}
          </Drawer>
        )}

        <Layout
          style={{
            marginLeft: isMobile ? 0 : collapsed ? 64 : 260,
            transition: 'margin-left 0.2s ease',
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
                    Admin
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
