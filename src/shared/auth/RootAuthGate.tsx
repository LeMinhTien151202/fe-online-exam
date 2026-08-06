import React, { useEffect } from 'react';
import { Spin } from 'antd';
import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { useAccountQuery } from '@apps/auth/services/authQuery';
import { useAppSelector } from '@/shared/store/hooks';
import { tokenManager } from '@/shared/utils/tokenManager';

// Các trang KHÔNG cần đăng nhập: dashboard, đăng nhập/đăng ký/oauth, và Góc giải đáp (Q&A).
// Mọi trang còn lại (luyện tập 5 kỹ năng, thi thử, tài liệu, hồ sơ, admin...) đều bắt buộc đăng nhập.
const PUBLIC_EXACT = new Set<string>(['/']);
const PUBLIC_PREFIXES = ['/login', '/register', '/oauth', '/faq'];

const isPublicPath = (pathname: string) =>
  PUBLIC_EXACT.has(pathname) ||
  PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

const FullScreenSpin: React.FC = () => (
  // flex:1 + width:100% để lấp đầy #root (bản thân #root là flex row) — nếu không div co theo
  // nội dung và dồn sát lề trái, khiến spinner trông lệch trái thay vì giữa màn hình.
  <div
    style={{
      flex: 1,
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
    }}
  >
    <Spin size="large" description="Đang tải..." />
  </div>
);

// Guard đăng nhập đặt ở root: chặn cả điều hướng nội bộ lẫn truy cập URL trực tiếp.
// Chờ khôi phục phiên xong mới quyết định để không đá nhầm người đang đăng nhập ra /login.
export const RootAuthGate: React.FC = () => {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Cùng queryKey với useAuthBootstrap nên được dedup; chỉ để biết trạng thái tải phiên.
  const { isLoading } = useAccountQuery();
  const user = useAppSelector((s) => s.auth.user);
  const hasToken = !!tokenManager.getAccessToken();

  const bootstrapping = isLoading || (hasToken && !user);
  const needsAuth = !isPublicPath(pathname);

  useEffect(() => {
    if (bootstrapping) return;
    if (needsAuth && !user) {
      navigate({ to: '/login', replace: true });
    }
  }, [bootstrapping, needsAuth, user, navigate]);

  if (needsAuth && (bootstrapping || !user)) return <FullScreenSpin />;
  return <Outlet />;
};

export default RootAuthGate;
